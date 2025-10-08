import mongoose from "mongoose"  ;


const connectDB = async()=>{  

    try{          
            await mongoose.connect(process.env.MONGODB_URI , {
                dbName : "LMS"
            })  ; 
           console.log("DataBase Connected SuccessFully ✅✅✅") ;
    }
    catch(error){  

        console.log("DataBase Not connected ❌❌❌" , error)

    }
    finally{
          console.log("connectDB function Called 🔅📊")
    }   
}
 


export default connectDB 