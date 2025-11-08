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
              type: Date,
          default: function() {
            // Add 1 year to current date
            const date = new Date();
            date.setFullYear(date.getFullYear() + 2);
            return date;
        }
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