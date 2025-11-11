import { Course } from "../model/Course.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const searchWithai = async (req, res) => {
  console.log("this is frontend query:", req.query);

  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      message: "query is required",
      success: false,
    });
  }

  try {
    // ✅ Initialize Gemini client
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // ✅ Build Prompt
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
`;

    // ✅ Generate content using new SDK format
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: Prompt }],
        },
      ],
    });

    // ✅ Safely extract the AI text (new SDK response structure)
    let aiResponseText = "";

    if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      aiResponseText = result.response.candidates[0].content.parts[0].text;
    } else if (result?.response?.text) {
      aiResponseText = result.response.text();
    } else {
      console.log("⚠️ Unexpected Gemini response:", JSON.stringify(result, null, 2));
      throw new Error("Gemini returned an unexpected format");
    }

    if (!aiResponseText || aiResponseText.trim() === "") {
      return res.status(404).json({
        message: "No keywords found from AI",
        success: false,
      });
    }

    console.log("AI response for course search:", aiResponseText);

    // ✅ Extract keywords
    const keywords = aiResponseText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    // ✅ MongoDB query
    const allCourses = await Course.aggregate([
      {
        $match: {
          isPublished: true,
          $or: keywords.flatMap((keyword) => [
            { title: { $regex: new RegExp(keyword, "i") } },
            { description: { $regex: new RegExp(keyword, "i") } },
            { category: { $regex: new RegExp(keyword, "i") } },
            { subTitle: { $regex: new RegExp(keyword, "i") } },
          ]),
        },
      },
      {
        $lookup: {
          from: "thumbnails",
          localField: "_id",
          foreignField: "courseId",
          as: "thumbnails",
        },
      },
      {
        $unwind: {
          path: "$thumbnails",
          preserveNullAndEmptyArrays: true,
        },
      },
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
      return res.status(404).json({
        message: "No course found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Courses found successfully",
      success: true,
      aiKeywords: keywords,
      courseData: allCourses,
    });
  } catch (error) {
    console.error("Course search with AI error ❌❌❌", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
