

import express from "express" ;
import { login, logout, signUp } from "../controller/authController.js";


const authRoute = express.Router() ; 


authRoute.post("/signup" , signUp )
authRoute.post("/login" , login)
authRoute.get("/logout" , logout)



export default authRoute ;