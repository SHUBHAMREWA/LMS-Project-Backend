
import mongoose from "mongoose" ;


const otpSchema = new mongoose.Schema({
        userId :    {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",      // 👈 link to User model for populate
            required: true,   // 👈 userId must exist
        },
        otp    : String  , 
        verify : { type : Boolean , 
        default : false} , 

        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // OTP automatically delete after 5 minutes (300 seconds)
        }, 
})


export const OTP = mongoose.model("Otp" , otpSchema) ;