
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import genToken from "../middleware/token.js";





// signup Controller
export const signUp = async (req, res) => {

        const { name, email, password, role, discription, phone } = req.body;

        if (!name || !email || !password || !role ) {
                return res.status(400).json({
                        success: false,
                        message: "All field are Required"
                })
        }


        if (validator.isStrongPassword(password, {
                minLength: 8,       // Minimum 8 characters
                minLowercase: 1,    // At least 1 lowercase
                minUppercase: 1,    // At least 1 uppercase
                minNumbers: 1,      // At least 1 number
                minSymbols: 1       // At least 1 special character
        })) {
                console.log("✅ Strong password");
        } else {
                return res.status(400).json({
                        message: "weak password",
                        success: false
                })
        }

        if (!validator.isEmail(email)) {
                return res.status(400).json({
                        message: "Invalid Email",
                        success: false
                })
        }




        let isEmailExits = await User.findOne({ email: email });

        if (isEmailExits) {
                return res.status(409).json({
                        success: false,
                        message: "User Email Alreday Exits"
                })
        }

        let hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
                name,
                email,
                password: hashPassword,
                role,
                discription,
                phone
        })

          
        if(!user) return res.status(400).json({
                message : "user not created",
                success : false

        })

   
        const token =   await genToken({
                 userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                discription: user.discription,
                phone: user.phone
        })

        console.log("this is a token ", token);

        res.cookie("Logintoken", token, {
                httpOnly: true,       // JS can’t access (secure)
                secure: false,         // HTTPS only
                sameSite: "strict",   // Prevent CSRF
                maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({
                success: true,
                message: "user created Successfully"
        })

}


// login controller 
export const login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({
                message: "All field are Required",
                success: false
        })


        let user = await User.findOne({ email });
        console.log(user);

        if (!user) return res.status(401).json({
                message: "User not Found",
                success: false
        })

        let isCorrectPassowrd = await bcrypt.compare(password, user.password);

        if (!isCorrectPassowrd) return res.status(401).json({
                message: "Incorrect Password",
                success: false
        })

        const token =   await genToken({
                 userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                discription: user.discription,
                phone: user.phone
        })


        console.log("this is a token ", token);



        res.cookie("Logintoken", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000

        })


        res.status(200).json({
                message: "Successfully Login",
                success: true
        })

}


//logout Controller 

export const logout = async (req, res) => {
        try {
                // Clear cookie by setting it to empty and expired
                res.clearCookie("Logintoken", {
                        httpOnly: true,
                        secure: false,
                        sameSite: "strict",
                });

                return res.status(200).json({
                        success: true,
                        message: "Logged out successfully",
                });
        } catch (error) {
                return res.status(500).json({
                        success: false,
                        message: "Logout failed",
                        error: error.message,
                });
        }
}