import { Router } from "express";
import { registerController,getMeController,refreshTokenController,logOutController } from "../controllers/auth.register.controller.js"
const authRouter = Router();


/**
 * POST /api/auth/register
 */

authRouter.post("/register",registerController)

/**
 * Get /api/auth/get-me
 */

authRouter.get("/get-me",getMeController )


/**
 * Get /api/auth/get-me
 */

authRouter.get("/refresh-token",refreshTokenController )

/**
 * Get /api/auth/logout
 */

authRouter.get("/logout",logOutController )


export default authRouter