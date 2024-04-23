
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import gravatar from 'gravatar'
import jimp from 'jimp'

import fs from 'fs/promises'

import { sendEmail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

import dotenv from "dotenv";
dotenv.config()

import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';




const { SECRET_KEY } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const avatarsDir = path.join(__dirname, "../", "public", "avatars");


export const register = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email is already in use")
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);
        const verificationCode = nanoid();

        const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });

        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationCode}">Click verify email</a>`
        }

        await sendEmail(verifyEmail);

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: "starter"
            }
        }
        )
    }
    catch (e) {
        next(e)
    }
}


export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.params;

    console.log(req.params)
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: null })

    res.json({ message: "Verification successful" })
}

export const resendVerifyEmail = async (req, res, next) => {

    try {
        const { email } = req.body;
        if(!email) { 
            throw HttpError(400, "missing required field email")
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email not found");
        }
        if (user.verify) {
            throw HttpError(400, "Verification has already been passed")
        }
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`
        };

        await sendEmail(verifyEmail);

        res.json({
            message: "Verify email send success"
        })
    }
    catch (e) {
        next(e)
    }

}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw HttpError(401, 'Email or password invalid')
        }

        if (!user.verify) {
            throw HttpError(401, "Email not verified");
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password invalid");
        }
        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
        await User.findByIdAndUpdate(user._id, { token });
        res.json({
            token,
            user: {
                email,
                subscription: "starter"
            }
        })
    }
    catch (e) {
        next(e)
    }

}


export const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    })
}


export const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(204).send()
}

export const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(_id, { subscription })
    res.json({ message: "Successfully updated" })
}

export const updateAvatar = async (req, res, next) => {

    try {
        const { _id } = req.user;
        if (!req.file) {
            throw HttpError(400, 'Must be a photo')
        }

        const { path: tempUpload, originalname } = req.file;
        const filename = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarsDir, filename);

        const image = await jimp.read(tempUpload);
        image.resize(250, 250);
        await image.writeAsync(resultUpload);
        await fs.unlink(tempUpload);

        const avatarURL = path.join('avatars', filename);
        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({
            avatarURL,
        })
    }
    catch (e) {
        next(e)
    }


}