import mongoose from "mongoose"  ;


const connectDB = async()=>{  

    try{          
            await mongoose.connect(process.env.MONGODB_URI)  ; 
           console.log("DataBase Connected SuccessFully ✅✅✅") ;
    }
    catch(error){  

        console.log("DataBase Not connected ❌❌❌" , error.message)

    }
    finally{
          console.log("connectDB function Called 🔅📊")
    }   
}



export default connectDB 