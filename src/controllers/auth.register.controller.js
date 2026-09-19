import userModel from "../models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import Config from "../config/config.js";

export const registerController = async(req,res) =>{
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    const {username,email,password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or:[{username},{email}]
    })
    if ( isAlreadyRegistered ){
        return res.status(409).json({ // confliction of username or email
            message : "Username or email already exsits"
        })
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    const user = await userModel.create({
        username,email,password:hashedPassword
    })
    const token = jwt.sign({
        id:user._id
    },Config.JWT_SECRET,{
        expiresIn:"1d"
    })
    res.status(201).json({ // resources created
        message:"User created successfully",
        user:{
            username:user.username,
            email:user.email
        },token
    })
}
