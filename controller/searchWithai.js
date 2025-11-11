import { Course } from "../model/Course.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Simple in-memory cache to reduce repeated AI calls (keyed by normalized query)
const CACHE = new Map();
const getCache = (key) => {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (entry.expireAt < Date.now()) {
    CACHE.delete(key);
    return null;
  }
  return entry.value;
};
const setCache = (key, value, ttlMs = 5 * 60 * 1000) => {
  CACHE.set(key, { value, expireAt: Date.now() + ttlMs });
};

// Preferred model can be configured to avoid multi-model retries (helps with quotas)
const PREFERRED_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Reusable Mongo search with regex terms
const runCourseSearch = async (terms) => {
  const orClauses = terms.flatMap((term) => [
    { title: { $regex: new RegExp(term, "i") } },
    { description: { $regex: new RegExp(term, "i") } },
    { category: { $regex: new RegExp(term, "i") } },
    { subTitle: { $regex: new RegExp(term, "i") } },
  ]);

  return await Course.aggregate([
    { $match: { isPublished: true, $or: orClauses } },
    {
      $lookup: {
        from: "thumbnails",
        localField: "_id",
        foreignField: "courseId",
        as: "thumbnails",
      },
    },
    { $unwind: { path: "$thumbnails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        title: 1,
        description: 1,
        price: 1,
        category: 1,
        mrp: 1,
        subTitle: 1,
        isPublished: 1,
        "thumbnails.images": 1,
        "thumbnails.demoLink": 1,
      },
    },
  ]);
};

export const searchWithai = async (req, res) => {
  const raw = String(req.query?.query || "").trim();
  if (!raw) {
    return res.status(400).json({ message: "query is required", success: false });
  }

  // Cache first
  const cacheKey = `q:${raw.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) return res.status(200).json(cached);

  // For very short queries, skip AI to save quota and do regex search directly
  if (raw.length < 2) {
    const courseData = await runCourseSearch([raw]);
    const payload = { message: "Courses found (fallback: regex)", success: true, usedModel: null, aiKeywords: [raw], courseData };
    setCache(cacheKey, payload);
    return res.status(200).json(payload);
  }

  // Gemini client (AI Studio)
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Try preferred model first, then a few fallbacks only if needed
  const MODEL_CANDIDATES = [
    PREFERRED_MODEL,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-pro",
  ].filter(Boolean);

  const Prompt = `
You are an intelligent course keyword generator.

Courses:
Web Development, UI/UX Designing, Ethical Hacking, AI/ML, App Development, Data Science, Data Analytics, AI Tools.

Instructions:
- Analyze the user's query.
- Return only the most relevant course names, comma-separated.
- No explanations or extra text.

Example:
Input: "I want to make a website for my business"
Output: Web Development, UI/UX Designing

User Query: ${raw}
`.trim();

  const extractText = (result) => {
    if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.response.candidates[0].content.parts[0].text;
    }
    if (typeof result?.response?.text === "function") {
      return result.response.text();
    }
    if (result?.output_text) return result.output_text;
    return "";
  };

  let aiResponseText = "";
  let usedModel = "";

  try {
    let lastErr;
    for (const model of MODEL_CANDIDATES) {
      try {
        const result = await genAI.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: Prompt }] }],
        });
        const text = extractText(result);
        if (text && text.trim()) {
          aiResponseText = text.trim();
          usedModel = model;
          break;
        }
      } catch (err) {
        lastErr = err;
        if (String(err?.message || "").includes("NOT_FOUND")) {
          console.warn(`Model ${model} not found/supported, trying next…`);
          continue;
        }
        if (String(err?.message || "").includes("429")) {
          // Quota limit → fallback to regex search instead of failing the request
          const courseData = await runCourseSearch([raw]);
          const payload = { message: "Courses found (fallback: regex due to rate limit)", success: true, usedModel: null, aiKeywords: [raw], rate_limited: true, courseData };
          setCache(cacheKey, payload, 60 * 1000); // shorter cache when limited
          return res.status(200).json(payload);
        }
        console.warn(`Model ${model} failed:`, err?.message);
      }
    }

    // If AI produced nothing, fallback to regex search
    if (!aiResponseText) {
      const courseData = await runCourseSearch([raw]);
      const payload = { message: "Courses found (fallback: regex)", success: true, usedModel: null, aiKeywords: [raw], courseData };
      setCache(cacheKey, payload);
      return res.status(200).json(payload);
    }

    const keywords = aiResponseText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const terms = keywords.length ? keywords : [raw];
    const courseData = await runCourseSearch(terms);

    if (!courseData || courseData.length === 0) {
      return res.status(404).json({ message: "No course found", success: false });
    }

    const payload = {
      message: "Courses found successfully",
      success: true,
      usedModel,
      aiKeywords: terms,
      courseData,
    };
    setCache(cacheKey, payload);
    return res.status(200).json(payload);
  } catch (error) {
    // As a final safe fallback, never block the UI: try regex search once
    try {
      const courseData = await runCourseSearch([raw]);
      const payload = { message: "Courses found (fallback after error)", success: true, usedModel: null, aiKeywords: [raw], courseData };
      setCache(cacheKey, payload);
      return res.status(200).json(payload);
    } catch (_) {}

    console.error("Course search with AI error ❌❌❌", error?.message);
    return res.status(500).json({ message: error?.message, success: false });
  }
};
