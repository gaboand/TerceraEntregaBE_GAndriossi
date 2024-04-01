import express from "express";
import {getProducts, getProductId, saveProducts, updateProducts, deleteProducts} from "../controllers/products.controller.js";
import {generateProducts} from "../controllers/mocking.controller.js";

const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductId);
productsRouter.post("/", saveProducts);
productsRouter.put("/:pid", updateProducts);
productsRouter.delete("/:pid", deleteProducts);
productsRouter.post("/mockingproducts", generateProducts)

export default productsRouter;
