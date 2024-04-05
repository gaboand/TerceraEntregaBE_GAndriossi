import { ordersDao } from "../dao/index.js";
import { cartsDao } from "../dao/index.js";
import { UserModel } from "../dao/mongo/models/user.model.js";
import { productsDao } from "../dao/index.js";
import { sendConfirmationEmail } from "../controllers/mail.controller.js";

export const createOrderFromCart = async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await cartsDao.getCartWithProductDetails(cid);
      if (!cart) {
          return res.status(404).json({ message: "Carrito no encontrado" });
      }

      if (cart.products.length === 0) {
          return res.status(400).json({ message: "El carrito está vacío, no se puede generar la orden." });
      }

      let productosAjustados = [];
      let productosSinStockSuficiente = [];
      let totalPrice = 0;

      for (let product of cart.products) {
          const productoEnStock = await productsDao.getProductsById(product.productId._id);
          if (productoEnStock && productoEnStock.stock > 0) {
              const cantidadDisponible = Math.min(product.quantity, productoEnStock.stock);
              productosAjustados.push({
                  productId: product.productId._id,
                  quantity: cantidadDisponible,
                  price: product.productId.price
              });
              totalPrice += cantidadDisponible * product.productId.price;
          } else {
              productosSinStockSuficiente.push(product.productId.title);
          }
      }

      if (productosAjustados.length > 0) {
          const orderCode = (Math.random().toString(16) + '000000000').substr(2, 10).toUpperCase();
          const newOrder = await ordersDao.createOrder({
              code: orderCode,
              cart: cart._id,
              user: req.session.passport.user,
              products: productosAjustados,
              totalPrice: totalPrice,
              status: "Pendiente"
          });
          console.log("Orden creada:", newOrder);

          await UserModel.findByIdAndUpdate(req.session.passport.user, { $push: { orders: newOrder._id } });

          let message = "Orden creada con éxito.";
          if (productosSinStockSuficiente.length > 0) {
              message += " Algunos productos no estaban disponibles o tenían stock limitado y fueron ajustados: " + productosSinStockSuficiente.join(", ");
          }

          return res.status(201).json({
              success: true,
              message: message,
              order: newOrder
          });
      } else {
          return res.status(400).json({
              success: false,
              message: "No fue posible procesar la orden debido a falta de stock.",
          });
      }
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
}

  export const payment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await ordersDao.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        for (const item of order.products) {
            const product = await productsDao.getProductsById(item.productId);
            if (product && product.stock >= item.quantity) {
                await productsDao.updateProductStock(item.productId, -item.quantity);
            } else {
                return res.status(400).json({ message: `No hay suficiente stock para el producto ${product.title}` });
            }
        }
        
        await cartsDao.emptyCart(order.cart);

        const updatedOrder = await ordersDao.resolveOrder(orderId, { status: 'Pagado' });
        const userEmail = req.session.user;
        await sendConfirmationEmail(userEmail, order._id, order.totalPrice);

        res.json({
            success: true,
            message: 'Pago procesado correctamente',
            orderDetails: {
                orderId: order._id,
                products: order.products,
                total: order.totalPrice,
            }
        });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ success: false, message: 'Error al procesar el pago' });
    }

}


