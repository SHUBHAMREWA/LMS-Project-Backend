
import { Course } from "../model/Course.js"
import { Thumbnail } from "../model/Thumbnail.js";
import cloudinary from "../config/cloudinary.js";



// add courses by Educator 
export const addCourse = async(req , res)=>{ 

      const { title , subTitle , description , mrp , price , isPublished   }   = req.body ;     
      
      console.log("Ye hit hua" ,title , subTitle , description , mrp , price , isPublished)

      if(!title || !subTitle || !description || !price){

       return   res.status(400).json({
               message : "All field are Required",
               success : false
          })
         
      }  
        
      try{

        let course = await Course.create({
                  title, 
                  subTitle, 
                  description, 
                  mrp, 
                  price, 
                  isPublished  ,
                  educatorId : req.userId
               })  

          if(!course){
               return res.status(400).json({
                   message : "Course not Created" , 
                   success : false 
               })
          }       


          return res.status(201).json({
                message : "Course Created Successfully",
                success : true , 
                courseId : course._id
          })


      }
      catch(err){  

          console.log("eeror form Add Course Cotroller"  , err.message) ;
          return res.status(500).json({ 
              message : "Failed to Add Course",
              success : false , 
              error : err.message
          })

      }
      



     
      
      
}

//  add Thumblain of Course 
export const addThumbnail =  async(req , res)=>{  
           
              const {courseId , demoLink , images}  = req.body ; 
        
            try{  
                 
                  let tumbnail = await Thumbnail.create({
                       courseId , 
                       demoLink , 
                       images
                  })

                  if(!tumbnail){  
                      
                      await Course.findByIdAndDelete(courseId) ; 
                     
                     return res.status(400).json({
                         message : "thumnail not Created" , 
                         success : false , 
                     })
                  }

                   return res.status(200).json({
                      message : "Thumnail Created Successfully" , 
                      success : true , 
                      thumnailId : tumbnail._id , 
                      courseId : courseId
                   })


            }
            catch(err){ 
               
          console.log("eeror form Add Course Cotroller"  , err.message) ; 

          return res.status(500).json({
              message : "Failed to Add Course",
              success : false , 
              error : err.message   
                  })
                 
            }
    
}



// remove Thumblain fo Couse 
export const removePhotoCloudinary = async(req , res)=> {    
            
       const {publicId}   = req.body ;   

        
        console.log("this is public Id  ==>" , publicId)
      
        try {   

         const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
         
         console.log(result)

          // Check if deletion was successful
            if (result.result === 'ok') {
            return res.status(200).json({ message: 'File deleted successfully', result });
            } else if (result.result === 'not found') {
            return res.status(404).json({ message: 'File not found', result });
            } else {
            return res.status(500).json({ message: 'Cloudinary error', result });
            }
                
            
        } catch (error) {  

              res.status(500).json(error);
            
        }
     
}


//  Get course to show in Course page and which one is pusblished we can them
export const getPublishedCourse = () => {
  

    
}




//  get Creater Course for show the Educator side
export const getCreaterCourse = ()=>{
     
}