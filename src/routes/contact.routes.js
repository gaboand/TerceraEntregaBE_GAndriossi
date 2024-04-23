import express from "express";
import { createContact, getContacts, modifyContact, deleteContact } from "../controllers/contact.controller.js";

const contactRouter = express.Router();

contactRouter.get("/", getContacts);
contactRouter.post("/", createContact);
contactRouter.put("/:id", modifyContact);
contactRouter.delete("/:id", deleteContact);

export default contactRouter;