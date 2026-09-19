import mongoose from "mongoose";
import Config from "./config.js";

const connectDb = async() => {
    try {
        await mongoose.connect(Config.MONGO_URI)
        console.log("Connected to db")
        
    } catch (error) {
        console.log(error)
    }
}

export default connectDb