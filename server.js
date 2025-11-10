
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import getUserRoute from "./routes/getUserRoute.js";
import CourseRouter from "./routes/courseRoute.js";
import enrollmentRoute from "./routes/enrollRoute.js"


// dotenv config for use procces.env   
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());

// CORS for Cross-Origin Resource Sharing with flexible origin (dev + env)
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes("localhost:5173") ||
        origin.startsWith("http://192.168.")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// for reading from data we use urlencoded 
app.use(express.urlencoded({ extended: true }));

// cookie parser for Read cookie Data of Client 
app.use(cookieParser());

// All routes are here 
app.use("/api/user", authRoute); // user signup , login  , logout route here
app.use("/user", getUserRoute); // get user info
app.use("/api/course", CourseRouter); // Course Related Routes here

// Enroll Course purchase Route Here 
app.use("/api/enroll" , enrollmentRoute ) ;


// ▒▒▒ Port listen Here ▒▒▒
app.listen(PORT, () => {
  console.log(`server is running on  PORT : ${PORT}`);
  // connect DB on port listen
  connectDB();
});
