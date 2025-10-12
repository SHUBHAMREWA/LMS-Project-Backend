import mongoose from "mongoose";  


const userSchema  =  new mongoose.Schema({
            name : {
                 type : String  ,
                 required : true
                        }  , 
            email : {
                  type : String , 
                  unique : true , 
                  required : true 
            }  ,
            discription : {
                type : String , 
                default : null
            }        , 
            
            password : {
                  type : String 
            }  ,
            role : {
                 type : String , 
                 enum : ["student" , "educator"] ,
                 default : "student"
            } , 
            phone : {
                  type : String  ,
                  default : null
            } ,
            photoUrl : {
                  type : String , 
                  default : null
            } , 
            provider : {
                    type : String , 
                    enum : ["local" , "google"] , 
                    default : "local"
            }
     
} , {timestamps : true})   



const User =  mongoose.model("User", userSchema) ;

export default User ;