import mongoose from "mongoose" ; 


const paymentSchema = new mongoose.Schema({  
         
           courseId : { 
               type : mongoose.Schema.Types.ObjectId , 
               ref : "Course" , 
               required : true
           }   , 

           amount : String  
       
})


export const Payment = mongoose.model("Payment" ,  paymentSchema )