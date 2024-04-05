import express from "express";
import {generateProducts} from "../controllers/mocking.controller.js";
import authAdmin from "../middlewares/authAdmin.js";

const mockingRouter = express.Router();

mockingRouter.get("/products", generateProducts)

export default mockingRouter