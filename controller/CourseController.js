
import { Course } from "../model/Course.js"
import { Thumbnail } from "../model/Thumbnail.js";



// add courses by Educator 
export const addCourse = async(req , res)=>{ 

      const { title , subTitle , discription , mrp , price , isPublished  , }   = req.body ;    

      if(!title || !subTitle || !discription || !price){

       return   res.status(400).json({
               message : "All field are Required",
               success : false
          })
         
      }  
        
      try{

        let course = await Course.create({
                  title, 
                  subTitle, 
                  discription, 
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



//  Get course to show in Course page and which one is pusblished we can them
export const getPublishedCourse = () => {
  

    
}




//  get Creater Course for show the Educator side
export const getCreaterCourse = ()=>{
     
}