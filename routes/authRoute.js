

import express from "express" ;
import { login, logout, signUp , sendOtp ,verifyOtp , forgotPassword} from "../controller/authController.js";


const authRoute = express.Router() ; 


authRoute.post("/signup" , signUp )
authRoute.post("/login" , login)
authRoute.get("/logout" , logout)
authRoute.post("/sent-otp" , sendOtp )
authRoute.post("/verify-otp" , verifyOtp) 
authRoute.post("/forgot-password" , forgotPassword )  


export default authRoute ;