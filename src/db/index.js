import mongoose from "mongoose";
import { DB_Name } from "../constants.js";
// also add the full name with extension like constants.js

// Your db is in another continent so always use async await and try catch block
// await the proccess
const connectDB = async () =>{
    try {
      const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
      console.log(`\n MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`); // for checking on which host we are connected
      
    } catch (error) {
        console.log("MongoDB Connection Error : ",error);
        process.exit(1)// node feature
    }

}


export default connectDB