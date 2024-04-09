
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import dotenv from "dotenv";
dotenv.config()

import { fileURLToPath } from 'url';
import path from 'path';



const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email is already in use")
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, password: hashPassword });

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

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw HttpError(401, 'Email or password invalid')
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