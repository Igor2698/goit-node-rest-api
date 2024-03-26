import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
} from "../controllers/contactsControllers.js";
import { validateAddContactBody, validateChangeContactBody } from "../shemas/contactsSchemas.js";



const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateAddContactBody, createContact);

contactsRouter.put("/:id", validateChangeContactBody, updateContact);

export default contactsRouter;