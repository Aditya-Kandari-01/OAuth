import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, // The value stored in this field must be an ObjectId
        ref: "users", // collection
        required: [true,"User is required"]

    },
    refreshTokenHash: {
        type: String,
        required: [true,"Refresh token hash is required"]
    },
    ip: {
        type: String,
        required: [true,"Ip address is required"]
    },
    userAgent: {
        type:String,
        required: [true,"User Agent is required"] // To know the type of browser 
    },
    revoked: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})

const sessionModel = mongoose.model("sessions",sessionSchema)

export default sessionModel