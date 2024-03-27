import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateFavorit
} from "../controllers/contactsControllers.js";
import { validateAddContactBody, validateChangeContactBody, validateChangeFavoriteBody } from "../shemas/contactsSchemas.js";



const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateAddContactBody, createContact);

contactsRouter.put("/:id", validateChangeContactBody, updateContact);

contactsRouter.patch("/:id/favorite", validateChangeFavoriteBody, updateFavorit)

export default contactsRouter;