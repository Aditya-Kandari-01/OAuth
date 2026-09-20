import userModel from "../models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import Config from "../config/config.js";
import sessionModel from "../models/session.model.js";

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ username }, { email }]
        })
        if (isAlreadyRegistered) {
            return res.status(409).json({ // confliction of username or email
                message: "Username or email already exsits"
            })
        }

        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
        const user = await userModel.create({
            username, email, password: hashedPassword
        })

        const refreshToken = jwt.sign({
            id: user._id
        }, Config.JWT_SECRET, {
            expiresIn: "7d"
        })

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        const session = await sessionModel.create({
            userId: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = jwt.sign({
            id: user._id,
            sessionId: session._id // ._id is kept to retrieve the details of generated tokens
        }, Config.JWT_SECRET, {
            expiresIn: "15m"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // the js on client side will not be able to read the cookies data
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({ // resources created
            message: "User created successfully",
            user: {
                username: user.username,
                email: user.email
            }, accessToken
        })

    } catch (error) {
        console.log(error)
    }
}

export const getMeController = async (req, res) => {
    // split the key which is formed as :
    // bearer [space] token

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const decoded = jwt.verify(token, Config.JWT_SECRET) // It will return the user's id , iat , exp

    const user = await userModel.findById(decoded.id)

    return res.status(200).json({
        message: "user fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })

}


export const refreshTokenController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(404).json({
            message: "Refresh token not found"
        })
    }

    // Generate new access token
    const decode = jwt.verify(refreshToken, Config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    // Identify session of the user
    // check whether the refreshToken was valid or not
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked:false
    })

    if(!session){
        return res.status(401).json({
            message:"Invalid refresh token"
        })
    }

    const accessToken = jwt.sign({
        id: decode.id
    }, Config.JWT_SECRET, {
        expiresIn: "15m"
    })

    // creating new refresh token on every access token
    // make the system more secure 

    const newRefreshToken = jwt.sign({
        id: decode.id
    }, Config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
    
    // update the refreshTokenHash in the session document
    session.refreshTokenHash = newRefreshTokenHash
    await session.save()

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true, // the js on client side will not be able to read the cookies data
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken
    })
}

export const logOutController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    // now this refresh token should be converted to hashed version of refresh token
    // to check whether this hashed version is in db or not

    const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest("hex")


    const session = await sessionModel.findOne({
        refreshTokenHash : refreshTokenHashed,
        revoked: false
    })
    console.log(session)

    console.log(123)

    if (!session) {
        return res.status(400).json({
            message: "Invalid Refresh token"
        })
    }

    session.revoked = true
    await session.save()

    res.clearCookie("refreshToken")

    return res.status(200).json({
        message: "Successfully logged out"
    })
}