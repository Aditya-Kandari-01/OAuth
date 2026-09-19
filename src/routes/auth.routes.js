import { Router } from "express";
import { registerController } from "../controllers/auth.register.controller.js"
const authRouter = Router();


/**
 * POST /api/auth/register
 */

authRouter.post("/register",registerController)



export default authRouter