import mongoose from "mongoose"  ;



const ThumbnailSchema = mongoose.Schema({

            courseId : {
                 type : mongoose.Schema.Types.ObjectId , 
                 ref : "Course" , 
                 required : true
            }     ,
             
            images : {
               type: [String],
                default : []
                        }    , 

            demoLink : {
               type : String , 
               default : null
            }            

})


export  const Thumbnail = mongoose.model("Thumbnail" , ThumbnailSchema)  ;