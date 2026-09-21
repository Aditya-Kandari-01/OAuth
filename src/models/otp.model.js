import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, // The value stored in this field must be an ObjectId
        ref: "users", // collection
        required: [true,"UserId is required"]
    },
    otpHash: {
        type:String,
        required:[true,"OTP hash is required"]
    }   
},{
    timestamps:true
})

const otpModel = mongoose.model("otps",otpSchema)

export default otpModel
