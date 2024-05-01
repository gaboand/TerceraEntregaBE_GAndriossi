import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "products";
const defaultAdminEmail = "gaboandriossi@gmail.com";

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, max: 200 },
    price: { type: Number, default: 0 },
    thumbnail: { type: String },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, default: 1 },
    category: { type: String },
    owner: { type: String, required: true, default: defaultAdminEmail, ref: "users" }
});

ProductSchema.plugin(paginate);
export const ProductsModel = mongoose.model(productCollection, ProductSchema);