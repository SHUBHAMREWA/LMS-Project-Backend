import mongoose from "mongoose";


const LessonSchema = new mongoose.Schema({ 


    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseModule",
        required: true,
    } , 

    name: {
        type: String,
        required: true,
    }, 
    
    lessonDetails: String,

    number: String,

    videoUrl: String,

})


const LessonModule = mongoose.model("Lesson", LessonSchema );

export default LessonModule ;