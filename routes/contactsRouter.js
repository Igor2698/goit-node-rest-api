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
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, validateAddContactBody, createContact);

contactsRouter.put("/:id", authenticate, isValidId, validateChangeContactBody, updateContact);

contactsRouter.patch("/:id/favorite", authenticate, isValidId, validateChangeFavoriteBody, updateFavorit)

export default contactsRouter;