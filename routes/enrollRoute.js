import express from "express" ; 
import isAuth from "../middleware/isAuth.js";
import { generateOrder, verifyPaymentAndEnrollment } from "../controller/enrollmentController.js";


const enrollmentRoute = express.Router() ; 

enrollmentRoute.post("/generate-order/:courseId" , isAuth , generateOrder)  ;
enrollmentRoute.post("/verify-payment", isAuth , verifyPaymentAndEnrollment ) ; 


export default enrollmentRoute ;