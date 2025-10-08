
import User from "../model/User.js";


export const getCurrentUser = async(req , res)=>{
       
         let userId = req.userId ;  

         let checkUser = await  User.findById(userId).select("-password") ; 

         if(!checkUser) return res.status(404).json({
              message : "user not Found" , 
              success : false
         })
           
        return res.status(200).json({
              message : "user user Found SuccesFully ✅✅✅✅",
              userData : checkUser ,
              success : true 
        })

}