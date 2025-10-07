
import jwt from "jsonwebtoken" ;




const genToken = async(data)=>{  

      try{
         let token = await jwt.sign(data, process.env.JWT_SECRET , {expiresIn : "7d"})
       console.log("token generated from gentoken function✅✅==>" , token
       )
      return token ;

      }
      catch(error){

        console.log("error form generated token==>", error )

      }
      
      
}


export default genToken ;