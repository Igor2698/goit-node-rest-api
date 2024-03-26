import Joi from "joi";
import { validateBody } from "../helpers/index.js";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
})


export const validateAddContactBody = validateBody(createContactSchema);
export const validateChangeContactBody = validateBody(updateContactSchema);

