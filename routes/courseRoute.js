import express  from "express"  ;
import { addCourse, addThumbnail, removePhotoCloudinary } from "../controller/CourseController.js";
import isAuth from "../middleware/isAuth.js";

const CourseRouter = express.Router() ; 



CourseRouter.post("/add-course" , isAuth  ,  addCourse)
CourseRouter.post("/add-thumbnail" , isAuth  , addThumbnail  )
CourseRouter.post("/cloudinary/delete"  , removePhotoCloudinary)



export default CourseRouter ;