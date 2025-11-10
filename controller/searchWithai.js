import { Course } from "../model/Course.js";  


 
export  const searchWithai = async(req ,res)=>{    

       console.log("this is frontend  query" , req.query)
         
        const {query}  = req.query ;
       
     try { 

          const allCourses = await Course.aggregate([

          {
          $match: {
               isPublished: true,
               $or: [
               { title: { $regex: new RegExp(query, "i") } },
               { description: { $regex: new RegExp(query, "i") } },
               { category: { $regex: new RegExp(query, "i") } },
               { subTitle: { $regex: new RegExp(query, "i") } }
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
