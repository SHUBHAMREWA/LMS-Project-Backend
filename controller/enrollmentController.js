
import RazorpayInstance from "../config/rezorPayinstance.js";
import { Payment } from "../model/Payments.js";
import { Enrollment } from "../model/Enrollment.js";
import { Course } from "../model/Course.js";





 export  const generateOrder = async(req ,res)=>{ 

       const {courseId} = req.params ;  

       try { 

             let course = await Course.findById(courseId) ;      
             
             if(!course)  return res.status(404).json({
                message : "Course Not Found",
                success : false
             })
             
             const option = {
                  amount : Math.round(Number(String(course.price).replace(/[^0-9.-]+/g, ''))) * 100, 
                  currency:  "INR",
                  receipt: course.title ,

             }

           RazorpayInstance().orders.create(option , (err  , order)=>{
                  
                  if (err) {
                console.log("this is order failed from RazorPay ❌❌"  , err)
                return res.status(500).json({
                    message: "Something went Wrong",
                    success: false
                })
            }
            console.log("this is order created By RazorPay ==>" , order) 
        
            // send response when order create
            res.status(200).json(order) 

        })
              
        
       } catch (error) {
        return res.status(500).json({
            message: "Something went Wrong",
            success: false
        })

        
       }
       

}



export const verifyPaymentAndEnrollment = async(req ,res)=>{  

const { courseId  , userId  , razorpay_order_id} =  req.body  ;


try {

      // Validate inputs
        if (!courseId || !userId || !razorpay_order_id) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }


    const orderInfo = await RazorpayInstance().orders.fetch(razorpay_order_id) ; 


if(orderInfo.status === "paid"){
   
   let paymentAmount  = orderInfo.amount / 100   
    
     let payment = await Payment.create({
         courseId , 
         amount : paymentAmount.toString()
     })   


     if(!payment)   return res.status(500).json({
         message : "Payment Not Created",
         success : false
     })
      

     let enrollment  = await Enrollment.create({
         userId , 
         courseId , 
         paymentId : payment._id , 
         validTill : new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)
     })  
      
     if(!enrollment)   return res.status(500).json({
         message : "Enrollment Not Created",
         success : false
     })

     return res.status(200).json({
        message : "Enrollment Successfully",
        success : true
     })

}
    
} catch (error) {

    return res.status(500).json({
        message : "Something went Wrong",
        success : false
    })
    
}


}


