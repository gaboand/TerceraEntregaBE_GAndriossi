import OrderDB from "../dao/mongo/orders.js";
import {CartModel} from "../dao/mongo/models/carts.model.js";
import {UserModel} from "../dao/mongo/models/user.model.js"; 

const getOrders = async (req, res) => {
  const result = await OrderDB.getOrders();
  res.json(result);
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await OrderDB.getOrderById(id);

  if (!order) {
    res.status(404).send("Order not found");
  }

  res.json(order);
};

const createOrder = async (req, res) => {
    const { userId, cartId } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const cart = await CartModel.findById(cartId).populate("products.productId");
        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        let totalPrice = 0;
        const productsWithInsufficientStock = [];
        cart.products.forEach(({ productId, quantity }) => {
            if (productId.stock < quantity) {
                productsWithInsufficientStock.push(productId._id);
            } else {
                totalPrice += productId.price * quantity;
            }
        });

        if (productsWithInsufficientStock.length > 0) {
            return res.status(400).send({
                message: "Insufficient stock for some products",
                productsWithInsufficientStock,
            });
        }

        let orderNumber = Date.now();

        const newOrderData = {
            number: orderNumber,
            cart: cartId,
            user: userId,
            products: cart.products,
            totalPrice: totalPrice,
            status: "pending",
        };
        
        const newOrder = await OrderDB.createOrder(newOrderData);

        res.send({ status: "success", order: newOrder });
    } catch (error) {
        console.error("Error creating order", error);
        res.status(500).send("Error creating order");
    }
};

const resolveOrder = async (req, res) => {
  const { id } = req.params;
  const newOrder = req.body;
  let orderById = await OrderDB.getOrderById(req.params.id);
  if (!orderById) {
    res.status(404).send("Order not found");
  }
  const order = await OrderDB.resolveOrder(id, newOrder);

  res.json({
    status: "Order modified",
    order,
  });
};

export { getOrders, getOrderById, createOrder, resolveOrder };