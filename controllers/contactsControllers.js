

import {
    getAll,
    getContactById,
    deleteOneContact,
    addContact,
    updateContact as updateOneContact,

} from "../servises/contactsServices.js";

import { Contact } from "../models/contact.js";


import { HttpError } from "../helpers/index.js";


import { updateContactSchema, createContactSchema } from "../shemas/contactsSchemas.js";



export const getAllContacts = async (req, res, next) => {
    try {
        const result = await Contact.find({});
        console.log(result)
        res.json(result);
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result)

    } catch (error) {
        next(error)
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndRemove(id);
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const result = await Contact.create(req.body)
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }

};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fielsInRequest = Object.keys(req.body).length
        if (!fielsInRequest) {
            throw HttpError(400, "Body must have at least one field")
        }
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result);
    } catch (e) {
        next(e);
    }
};


export const updateFavorit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result);
    } catch (e) {
        next(e);
    }
}