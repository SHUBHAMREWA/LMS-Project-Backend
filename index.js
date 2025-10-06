
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";



// dotenv config for use procces.env   
dotenv.config();

const PORT = process.env.PORT;

const app = express(); 

app.use(express.json())  ;

// for reading from data we use urlencoded 
app.use(express.urlencoded({extended : true})) ;    


// cookied parser for Read cookie Data of Client 
app.use(cookieParser())


//  All route are here 
app.use("/api/user" , authRoute)




// Port listen Here
app.listen(PORT, () => {
      console.log(`server is running on  PORT : ${PORT}`)
      // connected DB on port Listen  
      connectDB();
}
)