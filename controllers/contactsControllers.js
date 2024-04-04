

import {
    getAll,
    getContactById,
    deleteOneContact,
    addContact,
    updateContact as updateOneContact,

} from "../servises/contactsServices.js";

import { Contact } from "../models/contact.js";


import { HttpError } from "../helpers/index.js";





export const getAllContacts = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { page = 1, limit = 10, favorite } = req.query;
        const skip = (page - 1) * limit;
        let query = { owner };
        if (favorite !== undefined) {
            query.favorite = favorite;
        }

        const result = await Contact.find(query, "-createdAt -updatedAt", { skip, limit }).populate("owner", "name email");
        res.json(result);
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const result = await Contact.findOne({ _id: id, owner: owner });
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
        const { _id: owner } = req.user;
        const { id } = req.params;
        const result = await Contact.findOneAndDelete({ _id: id, owner: owner });
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
        const { _id: owner } = req.user;
        const result = await Contact.create({ ...req.body, owner });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }

};

export const updateContact = async (req, res, next) => {
    try {
        console.log(req.params)
        const { id } = req.params;
        const { _id } = req.user;
        console.log(_id)


        const fielsInRequest = Object.keys(req.body).length
        if (!fielsInRequest) {
            throw HttpError(400, "Body must have at least one field")
        }
 const result = await Contact.findOneAndUpdate({ _id: id, owner: _id }, req.body, { new: true });
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