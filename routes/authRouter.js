import express from "express";
import { isValidId } from "../middlewares/isValidId.js";
import { register, login, getCurrent, logout, updateSubscription } from "../controllers/authController.js";
import { validateRegisterBody, validateLoginBody, validateUpdateSubscription } from "../models/user.js";
import { authenticate } from "../middlewares/authenticate.js";




const authRouter = express.Router();


authRouter.post('/register', validateRegisterBody, register)
authRouter.post('/login', validateLoginBody, login)
authRouter.get("/current", authenticate, getCurrent);
authRouter.post('/logout', authenticate, logout)
authRouter.patch('/users', validateUpdateSubscription, authenticate, updateSubscription)



export default authRouter

