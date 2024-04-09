import express from "express";
import { register, login, getCurrent, logout, updateSubscription, updateAvatar } from "../controllers/authController.js";
import { validateRegisterBody, validateLoginBody, validateUpdateSubscription } from "../models/user.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";




const authRouter = express.Router();


authRouter.post('/register', validateRegisterBody, register)
authRouter.post('/login', validateLoginBody, login)
authRouter.get("/current", authenticate, getCurrent);
authRouter.post('/logout', authenticate, logout)
authRouter.patch('/users', validateUpdateSubscription, authenticate, updateSubscription);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);




export default authRouter

