import mongoose from "mongoose";


const CourseModuleSchema = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    name: {
        type: String,
        required: true
    },
    number: {
        type: String
    }

},
    { timestamps: true }
)



export const CourseModule = mongoose.model("CourseModule", CourseModuleSchema);