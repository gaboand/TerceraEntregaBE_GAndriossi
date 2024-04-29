import mongoose from "mongoose";
import Assert from "assert";
import ProductDB from "../dao/mongo/products.js";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL
const assert = Assert.strict;
const temporalProduct = {
    title: "test",
    description: "test",
    price: 1,
    thumbnail: "test",
    code: "test999",
    stock: 1,
    category: "test",
    owner: "661c56c3d0ea0ecf3c364f14",
    _id: "",
};

mongoose.connect(DB_URL);

describe("Testing de products dao", () => {
    before(function() {
        this.productDB = new ProductDB();
    });

    beforeEach(function() {
        this.timeout(5000);  
    });

    it("Obtenemos todos los productos", async function() {  
        const products = await this.productDB.getProducts(); 
        assert(products.length > 0, true); 
    });

    it("crear un producto en la Base de Datos", async function() {
        const product = {
            title: "test",
            description: "test",
            price: 1,
            thumbnail: "test",
            code: "test999",
            stock: 1,
            category: "test",
            owner: "661c56c3d0ea0ecf3c364f14",
        }
        const result = await this.productDB.createProduct(product);
        temporalProduct._id = result._id;
        assert.strictEqual(result._id !== undefined, true);
        
    });
    
    it("Buscar un producto por ID", async function() {
        const id = temporalProduct._id;
        const product = await this.productDB.getProductsById(id);
        assert(product !== null, true);
    });

    it("Borrar un producto", async function() {
        const id = temporalProduct._id;
        const product = await this.productDB.deleteProductById(id);
        assert(product !== undefined, true);
    });
});