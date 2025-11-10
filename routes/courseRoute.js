import express  from "express"  ;
import { addCourse, addCourseModule, addThumbnail, createLesson, deleteLesson, deleteModule, editCourse, 
        fetchLessonByModule, fetchModuleByCourse, getCourseById, 
        getCreaterCourse, getPublishedCourse, removeCourseById, 
        removePhotoCloudinary, getPublishedByEducator, getModulesWithLessonsPublic, 
        enrollCourses, addReview } from "../controller/CourseController.js"; 
      
import isAuth from "../middleware/isAuth.js";
import { searchWithai } from "../controller/searchWithai.js";

const CourseRouter = express.Router() ; 



CourseRouter.post("/add-course" , isAuth  ,  addCourse)
CourseRouter.post("/add-thumbnail" , isAuth  , addThumbnail  )
CourseRouter.post("/cloudinary/delete"  , removePhotoCloudinary)
CourseRouter.post("/edit-course" , isAuth  , editCourse) 
CourseRouter.delete("/delete-course/:courseId" , isAuth , removeCourseById ) 
CourseRouter.get("/creater-course", isAuth ,  getCreaterCourse )
CourseRouter.get("/getcourse-by-id/:couresId", getCourseById)
CourseRouter.get("/getAllcourse" , getPublishedCourse )
CourseRouter.get("/published-by-educator/:educatorId" , getPublishedByEducator )
CourseRouter.get("/modules-with-lessons/:courseId" , getModulesWithLessonsPublic )
CourseRouter.get("/getenrollcourses" , isAuth , enrollCourses)
CourseRouter.post("/add-review", isAuth, addReview)

// Routes for Modules and Lessons 
CourseRouter.post("/add-module", isAuth ,  addCourseModule) ;
CourseRouter.post("/add-lesson" , isAuth , createLesson)  ;
CourseRouter.get("/get-modules/:courseId" , isAuth , fetchModuleByCourse) ;
CourseRouter.get("/get-lessons/:moduleId" , isAuth , fetchLessonByModule) ;
CourseRouter.delete("/module-delete/:moduleId" , isAuth , deleteModule) ;
CourseRouter.delete("/lesson-delete/:lessonId" , isAuth , deleteLesson) ;


// add review 
CourseRouter.post("/add-review" , isAuth , addReview)  ;


// search with Ai
CourseRouter.post("/search-with-ai" ,  searchWithai )


export default CourseRouter ;