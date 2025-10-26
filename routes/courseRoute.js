import express  from "express"  ;
import { addCourse, addThumbnail, editCourse, getCourseById, 
     getCreaterCourse, getPublishedCourse, removeCourseById, 
      removePhotoCloudinary } from "../controller/CourseController.js"; 
      
import isAuth from "../middleware/isAuth.js";

const CourseRouter = express.Router() ; 



CourseRouter.post("/add-course" , isAuth  ,  addCourse)
CourseRouter.post("/add-thumbnail" , isAuth  , addThumbnail  )
CourseRouter.post("/cloudinary/delete"  , removePhotoCloudinary)
CourseRouter.post("/edit-course" , isAuth  , editCourse) 
CourseRouter.delete("/delete-course/:courseId" , isAuth , removeCourseById ) 
CourseRouter.get("/creater-course", isAuth ,  getCreaterCourse )
CourseRouter.get("/getcourse-by-id/:couresId", getCourseById)
CourseRouter.get("/getAllcourse" , getPublishedCourse )


export default CourseRouter ;