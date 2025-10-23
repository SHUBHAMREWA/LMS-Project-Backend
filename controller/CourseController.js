
import { Course } from "../model/Course.js"
import { Thumbnail } from "../model/Thumbnail.js";
import cloudinary from "../config/cloudinary.js";



// add courses by Educator 
export const addCourse = async (req, res) => {

    const { title, subTitle, description, mrp, price, isPublished } = req.body;

    console.log("Ye hit hua", title, subTitle, description, mrp, price, isPublished)

    if (!title || !subTitle || !description || !price) {

        return res.status(400).json({
            message: "All field are Required",
            success: false
        })

    }

    try {

        let course = await Course.create({
            title,
            subTitle,
            description,
            mrp,
            price,
            isPublished,
            educatorId: req.userId
        })

        if (!course) {
            return res.status(400).json({
                message: "Course not Created",
                success: false
            })
        }


        return res.status(201).json({
            message: "Course Created Successfully",
            success: true,
            courseId: course._id
        })


    }
    catch (err) {

        console.log("eeror form Add Course Cotroller", err.message);
        return res.status(500).json({
            message: "Failed to Add Course",
            success: false,
            error: err.message
        })

    }







}

//  add Thumblain of Course 
export const addThumbnail = async (req, res) => {

    const { courseId, demoLink, images } = req.body;

    if (!courseId || !demoLink || !images) return res.status(400).json({
        message: "All field are Required",
        success: false
    })

    try {

        let tumbnail = await Thumbnail.create({
            courseId,
            demoLink,
            images
        })

        if (!tumbnail) {

            await Course.findByIdAndDelete(courseId);

            return res.status(400).json({
                message: "thumnail not Created ",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Thumnail Created Successfully",
            success: true,
            thumnailId: tumbnail._id,
            courseId: courseId
        })


    }
    catch (err) {

        console.log("eeror form Add Course Cotroller", err.message);

        return res.status(500).json({
            message: "Failed to Add Course",
            success: false,
            error: err.message
        })

    }

}



// remove Thumblain fo Couse 
export const removePhotoCloudinary = async (req, res) => {

    const { publicId } = req.body;


    console.log("this is public Id  ==>", publicId)

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
export const getCreaterCourse = async (req ,res) => {   
     
         let userId = req.userId  
            
        try {
        
            let course = await Course.find({ educatorId : userId })  ; 
             
              if(!course) return res.status(404).json({ 
                 message : "Course Not Found",
                 success : false
              })  
               

               return res.status(200).json({
                message : "Course Found Successfully",
                success : true,
                courseData : course
               })
             
            
        } catch (error) {               

             console.log("error in GetCreater Course Controller" , error.message)  ;  

             return res.status(500).json({
                message : error.message , 
                success : false
             })           

        }

}




// ▒▒ Edit Course ▒▒  
export const editCourse = async (req, res) => {

    const { title, subTitle, description, mrp, price, isPublished, courseId, demoLink, images } = req.body;


    if (!title || !subTitle || !description || !price || !courseId) {

        return res.status(400).json({
            message: "All field are Required",
            success: false
        })

    }


    try {

        let course = await Course.findByIdAndUpdate(
            courseId,
            { $set: { title, subTitle, description, mrp, price, isPublished } },
            { new: true, runValidators: true }
        );


        if (!course) {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            })
        }


        let updateThumbnail = await Thumbnail.findOneAndUpdate(
            { courseId },
            { $set: { demoLink, images } },
            { new: true }   // 👈 ye likho to updated document return kare
        );

        if (!updateThumbnail) return res.status(404).status({
            message: "Thumbnail Not Found",
            success: false
        })


        return res.status(200).json({
            message: "Course Updated Successfully",
            success: true,
            courseId: courseId,
            thumnailId: updateThumbnail._id
        })



    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false

        })

    }





}


// Get Course By ID  
export const getCourseById = async (req, res) => {

    const { couresId } = req.params;

    try {

        let course = await Course.findById(couresId);

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found",
                success: false
            })
        }


        let tumbnail = await Thumbnail.findOne({ courseId: couresId });


        return res.status(200).json({
            message: "Course Found Successfully",
            success: true,
            courseData: { course, tumbnail }
        })

    } catch (error) {

        console.log(error.message);

        res.status(500).json({
            message: error.message,
            success: false
        })

    }

}


// remover Course By id 
export const removeCourseById = async (req, res) => {

    const { courseId } = req.params;

    try {

        let course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(400).json({
                message: "Course Not Found",
                success: false
            })
        }

        let thumnail = await Thumbnail.findOneAndDelete({ courseId: courseId });

        if (!thumnail) return res.status(400).json({
            message: "Thumbnail Not Found",
            success: false
        })


        return res.status(200).json({
            message: "Course Deleted Successfully",
            success: true
        })


    } catch (error) {

        console.log("course Deleted Error", error.message)

        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}