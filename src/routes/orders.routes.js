import express from "express";
import { getOrders, getOrderById, resolveOrder, createOrderFromCart, payment } from "../controllers/purchase.controller.js"; 
const ordersRouter = express.Router();

ordersRouter.post("/fromcart/:cid", createOrderFromCart);
ordersRouter.get("/", getOrders);
ordersRouter.get("/:id", getOrderById);
ordersRouter.put("/:id", resolveOrder);
ordersRouter.post('/pay/:orderId', payment);

export default ordersRouter;

