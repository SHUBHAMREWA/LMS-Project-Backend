
import mongoose from "mongoose" ; 


const ReviewSchema = mongoose.Schema({  

        studentId : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "User" , 
            required : true

        } , 
        courseId : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "Course" , 
            required : true
        }  
        ,   
        rating : {
             type : Number , 
             default : 5
        } , 
   
         comment : {
             type : String ,  
             defualt : null
         }  
         
                 

 })


 export const Review = mongoose.model("Review" , ReviewSchema) ;