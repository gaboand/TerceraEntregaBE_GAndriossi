import express from "express";
import {getProducts, getProductId, saveProducts, updateProducts, deleteProducts} from "../controllers/products.controller.js";
import authAdmin from "../middlewares/authAdmin.js";
import authPremium from "../middlewares/authPremium.js";

const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductId);
productsRouter.post("/", saveProducts);
productsRouter.put("/:pid", updateProducts);
productsRouter.delete("/:pid", deleteProducts);


export default productsRouter;