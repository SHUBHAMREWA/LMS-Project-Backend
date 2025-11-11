import { Course } from "../model/Course.js";  
import { GoogleGenAI } from "@google/genai";  

import dotenv from "dotenv" ; 

dotenv.config() ;

 
export  const searchWithai = async(req ,res)=>{    

       console.log("this is frontend  query" , req.query)    

         
        const {query}  = req.query ;  

        const ai = new GoogleGenAI({
               apiKey: process.env.GEMINI_API_KEY, // Ensure your API key is set in environment variables})
               }) ;


      const Prompt = `Role: You are an intelligent course keyword generator.

Goal: I will give you a query, topic, or need, and you will analyze it and return one or more related keywords from the following courses:

Web Development

UI/UX Designing

Ethical Hacking

AI/ML

App Development

Data Science

Data Analytics

AI Tools

Instructions:

Understand the user’s keyword or request deeply.

Match it to one or more of the given courses that are most relevant.

Return only the matching course names and related sub-keywords (no explanation text).

If multiple courses fit, return multiple.

Example 1:
Input: “I want to make a website for my business”
Output: Web Development, UI/UX Designing

Example 2: 
Input : "data" 
Output : Data Science, Data Analytics



Now respond based on the next user input.  
 Input Query: ${req.query.query} ` ;  

       
          
       if(!query || query.trim() === ""){
          return res.status(400).json({
               message : "query is required" , 
               success : false
          })
       }

       
       
     try {   

            
            let responseFromAI = await ai.models.generateContent({
               model : "gemini-2.5-flash",
               content : Prompt 
            })

            let aiResponseText  = responseFromAI.text  ;   

            if(!aiResponseText || aiResponseText.trim() === ""){
               return res.status(404).json({
                    message : "no keywords found from ai" , 
                    success : false
               }) ;     
         }

            console.log("AI response for course search " , aiResponseText) ;

          const allCourses = await Course.aggregate([

          {
          $match: {
               isPublished: true,
               $or: [
               { title: { $regex: new RegExp(aiResponseText, "i") } },
               { description: { $regex: new RegExp(aiResponseText, "i") } },
               { category: { $regex: new RegExp(aiResponseText, "i") } },
               { subTitle: { $regex: new RegExp(aiResponseText, "i") } }
               ]
          }
          },
          {
          $lookup: {
               from: "thumbnails",          // collection ka naam
               localField: "_id",
               foreignField: "courseId",
               as: "thumbnails"
          }
          },
          {
          $unwind: {
               path: "$thumbnails",
               preserveNullAndEmptyArrays: true
          }
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
               "thumbnails.demoLink": 1
          }
          }
               ]);

          console.log("courses found from ai search " , allCourses) ;

          if(!allCourses){
                return res.status(404).json({
                     message : "no course found" , 
                     success : false
                }) ;     
          }

          return res.status(200).json({
               message : "course" , 
               success : true , 
               courseData : allCourses
          }) ;

        

         
     } catch (error) {
          
          console.log("course seach with ai error ❌❌❌" , error.message) ; 

       return  res.status(500).json({
            message : error.message,
            success : false
       })
        
     }

}
