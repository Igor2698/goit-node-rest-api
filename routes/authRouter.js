import express from "express";
import { register, login, getCurrent, logout, updateSubscription, updateAvatar, verifyEmail, resendVerifyEmail } from "../controllers/authController.js";
import { validateRegisterBody, validateLoginBody, validateUpdateSubscription, validateEmail } from "../models/user.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";




const authRouter = express.Router();


authRouter.post('/register', validateRegisterBody, register);
authRouter.get('/verify/:verificationCode', verifyEmail)
authRouter.post('/login', validateLoginBody, login);
authRouter.post("/verify", validateEmail, resendVerifyEmail);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post('/logout', authenticate, logout);
authRouter.patch('/users', validateUpdateSubscription, authenticate, updateSubscription);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);




export default authRouter

