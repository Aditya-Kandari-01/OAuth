import { Router } from "express";
import { registerController, getMeController, refreshTokenController, logOutController, logOutAllController, loginController,verifyEmail } from "../controllers/auth.controller.js"

const authRouter = Router();


/**
 * POST /api/auth/register
 */

authRouter.post("/register", registerController)


/**
 * POST /api/auth/login
 */

authRouter.post("/login", loginController)

/**
 * Get /api/auth/get-me
 */

authRouter.get("/get-me", getMeController)


/**
 * Get /api/auth/get-me
 */

authRouter.get("/refresh-token", refreshTokenController)

/**
 * Get /api/auth/logout
 */

authRouter.get("/logout", logOutController)

/**
 * Get /api/auth/logout-all
 */

authRouter.get("/logout-all", logOutAllController)


/**
 * Get /api/auth/verify-email
 */

authRouter.get("/verify-email", verifyEmail)


export default authRouter