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

    // ✅ Build the prompt
    const Prompt = `
You are an intelligent course keyword generator.

Courses List:
Web Development, UI/UX Designing, Ethical Hacking, AI/ML, App Development, Data Science, Data Analytics, AI Tools.

Instructions:
- Analyze the user's query.
- Return one or more related course names (comma-separated).
- No explanation or extra text.

Example:
Input: "I want to make a website for my business"
Output: Web Development, UI/UX Designing

User Query: ${query}
`;

    // ✅ Generate content with latest SDK syntax
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash", // or gemini-2.5-flash
      contents: [{ role: "user", parts: [{ text: Prompt }] }],
    });

    const aiResponseText = result.response.text();

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

    // ✅ Search in MongoDB using those keywords
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

    console.log("Courses found from AI search:", allCourses);

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
