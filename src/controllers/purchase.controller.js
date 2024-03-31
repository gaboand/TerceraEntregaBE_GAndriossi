import { ordersDao } from "../dao/index.js";
import { cartsDao } from "../dao/index.js";
import { UserModel } from "../dao/mongo/models/user.model.js";

export const createOrderFromCart = async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await cartsDao.getCartWithProductDetails(cid);   
      if (!cart) {
          return res.status(404).json({ message: "Carrito no encontrado" });
      }
      
      const user = await UserModel.findOne({ cartId: cid });
      if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado para el carrito proporcionado" });
      }
  
      const orderCode = (Math.random().toString(16) + '000000000').substr(2, 10).toUpperCase();
  
      let totalPrice = 0;
      cart.products.forEach(product => {
          totalPrice += product.quantity * product.productId.price;
      });
  
      const newOrder = await ordersDao.createOrder({
          code: orderCode,
          cart: cart._id,
          user: user._id,
          products: cart.products.map(product => ({
              productId: product.productId._id,
              quantity: product.quantity
          })),
          totalPrice: totalPrice,
          status: "Pendiente"
      });
  
      await UserModel.findByIdAndUpdate(user._id, {
          $push: { orders: newOrder._id }
      });

      return res.status(201).json({
          success: true,
          message: "Orden creada con éxito",
          order: newOrder
      });
  } catch (error) {
      console.error("Error al crear la orden desde el carrito", error);
      return res.status(500).json({
          message: "Error al crear la orden",
          error: error.message
      });
  }
};
export const getOrders = async (req, res) => {
  try {
    const orders = await ordersDao.getOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las ordenes",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await ordersDao.getOrderById(id);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la orden",
      error: error.message,
    });
  }
};

export const resolveOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await ordersDao.resolveOrder(id, req.body);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la orden",
      error: error.message,
    });
  }
};

