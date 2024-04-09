import { model, Schema } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../middlewares/handleMongooseError.js";
import validateBody from "../helpers/validateBody.js";


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const userSchema = new Schema({
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, 'Email is required'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    token: {
        type: String,
        default: ""
    },
    avatarURL: {
        type: String,
        required: true,
    }

}, { versionKey: false, timestamps: true })

userSchema.post("save", handleMongooseError);


const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required().min(6)
})


const loginSchema = Joi.object({
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().min(6).required(),
})

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required()
})

export const User = model('user', userSchema);
export const validateRegisterBody = validateBody(registerSchema);
export const validateLoginBody = validateBody(loginSchema);
export const validateUpdateSubscription = validateBody(updateSubscriptionSchema)

