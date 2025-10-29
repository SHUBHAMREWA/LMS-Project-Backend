
import { Course } from "../model/Course.js"
import { Thumbnail } from "../model/Thumbnail.js";
import cloudinary from "../config/cloudinary.js";
import { CourseModule } from "../model/CourseModule.js";
import LessonModule from "../model/LessonModule.js";
import mongoose from "mongoose";


// add courses by Educator 
export const addCourse = async (req, res) => {

    const { title, subTitle, description, mrp, price, isPublished, category } = req.body;

    console.log("Ye hit hua", title, subTitle, description, mrp, price, isPublished)

    if (!title || !subTitle || !description || !price) {

        return res.status(400).json({
            message: "All field are Required",
            success: false
        })

    }

    try {

        let course = await Course.create({
            title,
            subTitle,
            description,
            mrp,
            price,
            category,
            isPublished,
            educatorId: req.userId
        })

        if (!course) {
            return res.status(400).json({
                message: "Course not Created",
                success: false
            })
        }


        return res.status(201).json({
            message: "Course Created Successfully",
            success: true,
            courseId: course._id
        })


    }
    catch (err) {

        console.log("eeror form Add Course Cotroller", err.message);
        return res.status(500).json({
            message: "Failed to Add Course",
            success: false,
            error: err.message
        })

    }







} 

//  add Thumblain of Course 
export const addThumbnail = async (req, res) => {

    const { courseId, demoLink, images } = req.body;

    if (!courseId || !demoLink || !images) return res.status(400).json({
        message: "All field are Required",
        success: false
    })

    try {

        let tumbnail = await Thumbnail.create({
            courseId,
            demoLink,
            images
        })

        if (!tumbnail) {

            await Course.findByIdAndDelete(courseId);

            return res.status(400).json({
                message: "thumnail not Created ",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Thumnail Created Successfully",
            success: true,
            thumnailId: tumbnail._id,
            courseId: courseId
        })


    }
    catch (err) {

        console.log("eeror form Add Course Cotroller", err.message);

        return res.status(500).json({
            message: "Failed to Add Course",
            success: false,
            error: err.message
        })

    }

}



// remove Thumblain fo Couse 
export const removePhotoCloudinary = async (req, res) => {

    const { publicId } = req.body;


    console.log("this is public Id  ==>", publicId)

    try {

        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });

        console.log(result)

        // Check if deletion was successful
        if (result.result === 'ok') {
            return res.status(200).json({ message: 'File deleted successfully', result });
        } else if (result.result === 'not found') {
            return res.status(404).json({ message: 'File not found', result });
        } else {
            return res.status(500).json({ message: 'Cloudinary error', result });
        }


    } catch (error) {

        res.status(500).json(error);

    }

}


// ▒▒ Get allcourse to show in Course page and which one is pusblished we can them ▒▒
export const getPublishedCourse = async (req, res) => {

    try {

        const allCourses = await Course.aggregate([
            {
                $match: {
                    isPublished: true  // sirf published courses
                }
            },
            {
                $lookup: {
                    from: "thumbnails",
                    localField: "_id",
                    foreignField: "courseId",
                    as: "thumbnails"
                }
            },
            {
                $unwind: {
                    path: "$thumbnails",
                    preserveNullAndEmptyArrays: true  // agar thumbnail na ho toh bhi course dikhe
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    category: 1,
                    _id: 1,
                    mrp: 1,
                    subTitle: 1,
                    description: 1,
                    "thumbnails.images": 1,
                    "thumbnails.demoLink": 1
                }
            }
        ]);

        console.log("this is a course fetch", allCourses)

        // return

        if (!allCourses) {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            })
        }



        return res.status(200).json({
            message: "Course Found Successfully",
            success: true,
            courseData: allCourses
        })

    } catch (error) {

        console.log(error.message);

        res.status(500).json({
            message: error.message,
            success: false
        })

    }

}




//  get Creater Course for show the Educator side
export const getCreaterCourse = async (req, res) => {

    let userId = req.userId

    try {

        let course = await await Course.aggregate([
            {
                $match: {
                    educatorId :  new mongoose.Types.ObjectId(userId)  // sirf published courses
                }
            },
            {
                $lookup: {
                    from: "thumbnails",
                    localField: "_id",
                    foreignField: "courseId",
                    as: "thumbnails"
                }
            },
            {
                $unwind: {
                    path: "$thumbnails",
                    preserveNullAndEmptyArrays: true  // agar thumbnail na ho toh bhi course dikhe
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    category: 1,
                    _id: 1,
                    mrp: 1,
                    subTitle: 1,
                    description: 1,
                    "thumbnails.images": 1,
                    "thumbnails.demoLink": 1
                }
            }
        ]);  



        if (!course) return res.status(404).json({
            message: "Course Not Found",
            success: false
        })


        return res.status(200).json({
            message: "Course Found Successfully",
            success: true,
            courseData: course
        })


    } catch (error) {

        console.log("error in GetCreater Course Controller", error.message);

        return res.status(500).json({
            message: error.message,
            success: false
        })

    }

}




// ▒▒ Edit Course ▒▒  
export const editCourse = async (req, res) => {

    const { title, subTitle, description, mrp, price, category, isPublished, courseId, demoLink, images } = req.body;


    if (!title || !subTitle || !description || !price || !courseId) {

        return res.status(400).json({
            message: "All field are Required",
            success: false
        })

    }


    try {

        let course = await Course.findByIdAndUpdate(
            courseId,
            { $set: { title, subTitle, description, mrp, price, isPublished, category } },
            { new: true, runValidators: true }
        );


        if (!course) {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            })
        }


        let updateThumbnail = await Thumbnail.findOneAndUpdate(
            { courseId },
            { $set: { demoLink, images } },
            { new: true }   // 👈 ye likho to updated document return kare
        );

        if (!updateThumbnail) return res.status(404).status({
            message: "Thumbnail Not Found",
            success: false
        })


        return res.status(200).json({
            message: "Course Updated Successfully",
            success: true,
            courseId: courseId,
            thumnailId: updateThumbnail._id
        })



    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false

        })

    }





}


// Get Course By ID  
export const getCourseById = async (req, res) => {

    const { couresId } = req.params;

    try {

        let course = await Course.findById(couresId);

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            })
        }


        let tumbnail = await Thumbnail.findOne({ courseId: couresId });


        return res.status(200).json({
            message: "Course Found Successfully",
            success: true,
            courseData: { course, tumbnail }
        })

    } catch (error) {

        console.log(error.message);

        res.status(500).json({
            message: error.message,
            success: false
        })

    }

}


// remover Course By id 
export const removeCourseById = async (req, res) => {

    const { courseId } = req.params;

    try {

        let course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(400).json({
                message: "Course Not Found",
                success: false
            })
        }

        let thumnail = await Thumbnail.findOneAndDelete({ courseId: courseId });

        if (!thumnail) return res.status(400).json({
            message: "Thumbnail Not Found",
            success: true
        })


        return res.status(200).json({
            message: "Course Deleted Successfully",
            success: true
        })


    } catch (error) {

        console.log("course Deleted Error", error.message)

        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}





// ▒◄▒▒▒◄▒▒▒▒◄◄▒▒▒◄▒▒▒◄▒▒▒▒◄◄▒▒▒◄▒▒▒◄▒▒▒▒◄◄▒▒▒◄▒▒▒◄▒▒▒▒◄◄▒▒▒◄▒▒▒◄▒▒▒▒◄◄▒▒▒◄▒▒▒◄▒▒▒▒◄◄▒▒▒◄▒▒▒◄▒▒▒▒◄◄▒▒
//COURSE MODULE AND Lessons Controller 



// ▒◄▒ addCourseModule ▒◄▒

export const addCourseModule = async (req, res) => {

    const { courseId, name , number } = req.body;   

    if(!courseId || !name || !number) return res.status(400).json({
                                            message: "All field are Required",
                                            success: false
                                        })
   
  
        try {
              
            const module = await CourseModule.create({
                 courseId , 
                 name , 
                 number
            })

            if(!module) return res.status(400).json({
                message : "Module Not Created",
                success : false
                })

            return res.status(201).json({
                message : "Module Created Successfully",
                success : true , 
                moduleId : module._id
            })
            
        } catch (error) {  

            return res.status(500).json({
                message : "Failed to Add Module",
                success : false , 
                error : error.message
            })
            
        }                                


      
     
}


// create a Lesson for module  
export  const createLesson = async (req, res) => {  
           
    const { lessonName, lessonNumber ,lessonDetails, videoUrl ,  moduleId}  = req.body ;   
    
    console.log(lessonName, lessonNumber ,lessonDetails, videoUrl ,  moduleId)
    
    
    if(!lessonName || !lessonNumber || !lessonDetails || !videoUrl || !moduleId) return res.status(400).json({
        message: "All field are Required",
        success: false
    })

    console.log(lessonName, lessonNumber ,lessonDetails, videoUrl ,  moduleId)


    try {

        let lesson = await LessonModule.create({
            moduleId , 
            name : lessonName , 
            number : lessonNumber , 
            lessonDetails ,
            videoUrl 
            })

        if(!lesson) return res.status(400).json({
            message : "Lesson Not Created",
            success : false
        })

        return res.status(201).json({
            message : "Lesson Created Successfully",
            success : true , 
            lessonId : lesson._id
        })
        
    } catch (error) { 
          
         return res.status(500).json({
            message : "Failed to Add Lesson",
            success : false , 
            error : error.message
        
    })
    }
}


// ◄▒▒ Fetch Module By Course 
export const fetchModuleByCourse = async (req, res) => {

    const { courseId } = req.params;  

    if(!courseId) return res.status(400).json({
        message : "Course Id is Required",
        success : false
    })
     
     try {

        let module = await CourseModule.find({ courseId });

        if(!module) return res.status(404).json({
            message : "Module Not Found",
            success : false
        })

        console.log("fetch course Module data successFully ✅✅✅"  , module)

        return res.status(200).json({
            message : "Module Found Successfully",
            success : true , 
            moduleData : module
        })
        
     } catch (error) {

        console.log("error in FetchModule Data ❌❌" , error.message) 
         
        return res.status(500).json({
            message : error.message,
            success : false
        })
        
     }

}


// ◄▒▒ Fetch Lesson by Module
 export const fetchLessonByModule = async (req, res) => {  
     
         const {moduleId}   = req.params ;  

          if(!moduleId) return res.status(400).json({
            message : "Module Id is Required",
            success : false
         })


         try {

             let lessons = await LessonModule.find({moduleId}); 
              
             if(!lessons) return res.status(404).json({
                message : "Lessons Not Found",
                success : false
             })


             console.log("lesson data fetch successFully ✅✅✅✅" , lessons)
             
             return res.status(200).json({
                message : "Lessons Found Successfully",
                success : true , 
                lessonData : lessons
             }
             )  

             
            
         } catch (error) {  
              console.log("lesson data fetch error ❌❌❌❌" , error.message);
              return res.status(500).json({
                message: error.message,
                success: false
              })
            
         }

      
 } 


//  ◄▒▒ delete Module Controller 
export const deleteModule = async(req , res)=>{ 


    const {moduleId}  = req.params ; 

    if(!moduleId) return res.status(404).json({
        message : "Module Id is Required",
        success : false
    })



    try {

        let module = await CourseModule.findByIdAndDelete(moduleId) ; 

        let lessons = await LessonModule.deleteMany({moduleId}) ;   
  
        if(!module) return res.status(404).json({
            message : "Module Not Found",
            success : false
        })

        return res.status(200).json({
            message : "Module Deleted Successfully",
            success : true
        })   


        
    } catch (error) { 

        console.log("module Delete Error ❌❌❌❌" , error.message) ;

        return res.status(500).json({
            message : error.message,
            success : false
        })
        
        
    }


      
       
     
}


// ◄▒▒ delete Lesson Contoller 
export const deleteLesson = async(req , res)=>{ 
        
             const {lessonId}  = req.params ;

             if(!lessonId) return res.status(404).json({
                message : "Lesson Id is Required",
                success : false
             })



            try {

                 let lesson = await LessonModule.findByIdAndDelete(lessonId) ; 

                 if(!lesson) return res.status(404).json({
                    message : "Lesson Not Found",
                    success : false
                 })

                 return res.status(200).json({
                    message : "Lesson Deleted Successfully",
                    success : true
                 })     
                
            } catch (error) {

                console.log("lesson Delete Error ❌❌❌❌" , error.message )
                 
                return res.status(500).json({
                    message : error.message,
                    success : false
                })  
                
            }

}