

import {
    getAll,
    getContactById,
    deleteOneContact,
    addContact,
    updateContact as updateOneContact,

} from "../servises/contactsServices.js";

import { HttpError } from "../helpers/index.js";


import { updateContactSchema, createContactSchema } from "../shemas/contactsSchemas.js";



export const getAllContacts = async (req, res, next) => {
    try {
        const result = await getAll();
        res.json(result);
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getContactById(id);
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
        const result = await deleteOneContact(id);
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
        const result = await addContact(req.body)
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

        const result = await updateOneContact(id, req.body)
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result);
    } catch (e) {
        next(e);
    }
};