import mongoose from "mongoose";


const courseSchema = mongoose.Schema({

    educatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    subTitle: {
        type: String,
        required: true

    },


    description: {
        type: String,
        required: true
    },

    mrp: {
        type: String,
        default: null
    },

    price: {
        type: String,
        default: null
    },

    isPublished: {
        type: Boolean,
        default: false
    }

})



 export  const Course = mongoose.model("Course", courseSchema);                 