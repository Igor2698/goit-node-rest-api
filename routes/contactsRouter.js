import express from "express";
import { isValidId } from "../middlewares/isValidId.js";
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

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateAddContactBody, createContact);

contactsRouter.put("/:id", isValidId, validateChangeContactBody, updateContact);

contactsRouter.patch("/:id/favorite", isValidId, validateChangeFavoriteBody, updateFavorit)

export default contactsRouter;