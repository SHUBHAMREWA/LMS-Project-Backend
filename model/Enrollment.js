import mongoose from "mongoose" ;



const enrollmentSchema = new mongoose.Schema({ 
         userId : {
              type : mongoose.Schema.Types.ObjectId , 
              ref : "User" , 
              required : true
         } ,   

         courseId : {
              type : mongoose.Schema.Types.ObjectId , 
              ref : "Course" , 
              required : true
         } ,  

         validTill : {
            type : Date
         }   ,  
     
          paymentId : {
             type : mongoose.Schema.Types.ObjectId ,
             ref : "Payment" ,
             required : true 
          }  

} , 
{timestamps : true}  
)


export const Enrollment = mongoose.model("Enrollment" , enrollmentSchema) ;