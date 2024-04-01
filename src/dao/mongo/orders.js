import { OrderModel } from "./models/orders.model.js";

export default class OrderDB {

  createOrder = async (orderData) => {
    try {
      const newOrder = new OrderModel(orderData);
      const savedOrder = await newOrder.save();
      return savedOrder;
    } catch (error) {
      console.error("Error al crear la orden", error);
      throw error;
    }
  };

  getOrders = async () => {
    try {
      return await OrderModel.find();
    } catch (error) {
      console.error("Error al obtener las ordenes", error);
    }
  };

  getOrderById = async (id) => {
    try {
      let result = await OrderModel.findById(id);
      return result;
    } catch (error) {
      console.error("Error al obtener la orden", error);
      throw error;
    }
  };

  resolveOrder = async (id, order) => {
    try {
      let result = await OrderModel.findByIdAndUpdate(id, order, { new: true });;
      return result;
    } catch (error) {
      console.error("Error al modificar la orden", error);
      throw error;
    }
  };
};