  
  import nodemailer from "nodemailer";  
  import dotenv from "dotenv"  ;
  import otpEmailFormate from "./EmailFormates.js" ;
  import path from "path";                // ✅ Add this
  import { fileURLToPath } from "url";    // ✅ Add this (for __dirname)

  dotenv.config()  ;

  // ✅ Fix __dirname (because ES Modules don’t have it)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const transporter = nodemailer.createTransport({
  host:   "smtp.gmail.com" ,
  port: 465 ,
  secure: true , // true for port 465
  auth: {
    user: process.env.EMAIL_USER , // test account user
    pass: process.env.EMAIL_PASS , // test account password
  },
});  


//  SEND OTP setup  
export  const sendOtpEmail = async(email , otp)=>{  

    try{
      

        const info = await transporter.sendMail({
                from:process.env.EMAIL_USER,
                to: email,
                subject: "VIHAAN Classes - OTP Verification", // Subject line
                html: otpEmailFormate(otp)  ,// html body 
                  attachments: [
                            {
                            filename: "logo.png",
                            path: path.join(__dirname, "../assets/img/logo.jpg"),
                            cid: "brandlogo",
                            },
                        ],
            });


            console.log("✅ OTP Email Sent Successfully", info.messageId);
    }
    catch(error){
        console.log("❌ Error in sending OTP email" , error)
    }
       
      
}