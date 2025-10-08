
import express from "express" ; 

import isAuth from "../middleware/isAuth.js";
import { getCurrentUser } from "../controller/getCurrentUser.js";


const getUserRoute = express.Router() ; 


getUserRoute.get("/getuser" , isAuth  , getCurrentUser)  
 


export default getUserRoute ;  