
import User from "../model/User.js"  ;
import bcrypt from "bcryptjs";  
import jwt from "jsonwebtoken" ;


export const signUp = async(req , res)=>{

        const {  name, email , password , role , discription  , phone}   = req.body ;    

         if(!name || !email || !password || !role || !discription ){
                  return  res.status(400).json({
                         success : false , 
                         message : "All field are Required"
                  })
         }

          
        let isEmailExits = await User.findOne({email : email}) ;

        if(isEmailExits){
                   return res.status(409).json({
                         success : false , 
                         message : "User Email Alreday Exits"
                   })
        }  

        let hashPassword  = await bcrypt.hash(password , 10) ;
         
         const user = await User.create({
                   name , 
                   email , 
                   password  : hashPassword , 
                   role , 
                   discription , 
                   phone
         })  


      
         const token = jwt.sign( {
                 userId : user._id , 
                 name : user.name , 
                 email : user.email , 
                 role : user.role , 
                 discription : user.discription , 
                 phone : user.phone
         }, process.env.JWT_SECRET , { expiresIn: "1d" }); 
        
          console.log("this is a token " , token) ;

                    res.cookie("Logintoken", token , {
                        httpOnly: true,       // JS can’t access (secure)
                        secure: false,         // HTTPS only
                        sameSite: "strict",   // Prevent CSRF
                        maxAge: 24 * 60 * 60 * 1000, // 1 day
                        }); 
           
              res.status(201).json({
                 success : true , 
                 message : "user created Successfully"
              })      

}