
import Razorpay from "razorpay" ;
import dotenv from "dotenv" ;

dotenv.config() ;


// Making razorpay instance for Payment
const RazorpayInstance = ()=>{
      
       return new Razorpay({
           key_id: process.env.KEY_ID ,
         key_secret: process.env.KEY_SECRET  ,
       })
}


export default RazorpayInstance ;