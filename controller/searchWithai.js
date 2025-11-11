import { Course } from "../model/Course.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const searchWithai = async (req, res) => {
  console.log("this is frontend query:", req.query);

  const { query } = req.query;
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "query is required", success: false });
  }

  // ✅ Gemini client (AI Studio)
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  // ✅ Try models in order (first that works will be used)
  const MODEL_CANDIDATES = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-pro",
  ];

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

User Query: ${query}
`.trim();

  // ✅ Helper: safely parse multiple possible response shapes
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
    // 🔁 Try available models
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
        // 404 => model not found on this endpoint/version → try next
        if (String(err?.message || "").includes("NOT_FOUND")) {
          console.warn(`Model ${model} not found/supported, trying next…`);
          continue;
        }
        // 429 => quota → bubble up (or handle as you like)
        if (String(err?.message || "").includes("429")) {
          throw err;
        }
        // Any other error → try next model
        console.warn(`Model ${model} failed:`, err?.message);
      }
    }

    if (!aiResponseText) {
      const msg = "No keywords generated. Models likely unsupported on this API version.";
      console.error(msg);
      return res.status(502).json({
        message: msg,
        success: false,
      });
    }

    console.log("✅ Gemini model used:", usedModel);
    console.log("AI response for course search:", aiResponseText);

    // ✅ Extract keywords list from comma-separated output
    const keywords = aiResponseText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    // ✅ If Gemini ne kabhi course ke alawa kuch de diya, filter to known courses:
    const ALLOWED = new Set([
      "Web Development",
      "UI/UX Designing",
      "Ethical Hacking",
      "AI/ML",
      "App Development",
      "Data Science",
      "Data Analytics",
      "AI Tools",
    ]);
    const filteredKeywords =
      keywords.length && keywords.every((k) => ALLOWED.has(k))
        ? keywords
        : keywords; // if you want to force only allowed, use: keywords.filter(k => ALLOWED.has(k))

    // ✅ MongoDB search using AI keywords (fallback to raw query if empty)
    const terms = filteredKeywords.length ? filteredKeywords : [query];

    const orClauses = terms.flatMap((term) => [
      { title:      { $regex: new RegExp(term, "i") } },
      { description:{ $regex: new RegExp(term, "i") } },
      { category:   { $regex: new RegExp(term, "i") } },
      { subTitle:   { $regex: new RegExp(term, "i") } },
    ]);

    const allCourses = await Course.aggregate([
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

    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({ message: "No course found", success: false });
    }

    return res.status(200).json({
      message: "Courses found successfully",
      success: true,
      usedModel,
      aiKeywords: terms,
      courseData: allCourses,
    });
  } catch (error) {
    // Special handling for 429
    if (String(error?.message || "").includes("429")) {
      return res.status(429).json({
        message: "Gemini quota limit reached. Please retry later.",
        success: false,
      });
    }

    console.error("Course search with AI error ❌❌❌", error?.message);
    return res.status(500).json({ message: error?.message, success: false });
  }
};
