import express from "express";
import ProductsRouter from "./products.routes.js";
import CartsRouter from "./cart.routes.js";
import MessagesRouter from "./messages.routes.js";
import ViewsRouter from "./views.routes.js";
import sessionRouter from "./session.routes.js";
import ordersRouter from "./orders.routes.js";
import mailRouter from "./mail.routes.js";
import mockingRouter from "./mocking.routes.js";

const IndexRouter = express.Router();

IndexRouter.use("/api/products", ProductsRouter);
IndexRouter.use("/api/carts", CartsRouter);
IndexRouter.use("/api/messages", MessagesRouter);
IndexRouter.use("/api/session", sessionRouter);
IndexRouter.use("/api/orders", ordersRouter);
IndexRouter.use("/api/mail", mailRouter);
IndexRouter.use("/api/mocking", mockingRouter);
IndexRouter.use("/", ViewsRouter);

export default IndexRouter;
