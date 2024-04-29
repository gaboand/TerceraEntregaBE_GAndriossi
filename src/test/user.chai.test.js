import mongoose from "mongoose";
import {expect} from "chai";
import UserDB from "../dao/mongo/users.js";
import CartDB from "../dao/mongo/carts.js";
import OrderDB from "../dao/mongo/orders.js";
import ProductDB from "../dao/mongo/products.js";
import dotenv from "dotenv";

dotenv.config();
const DB_URL = process.env.DB_URL
const temporalUser = {
    first_name: "test",
    last_name: "test",
    email: "test@test.com",
    password: 1234,
    age: 18,
    role: "user",
    cartId: "66251caab410c7d5bda62d17",
    _id: "",
};

mongoose.connect(DB_URL);

describe("Testing de users dao", () => {
    before(function() {
        this.UserDB = new UserDB();
    });

    beforeEach(function() {
        this.timeout(5000);  
    });

    it("Obtenemos todos los usuarios", async function() {  
        const users = await this.UserDB.getUsers(); 
        expect(users).to.be.an("array"); 
    });

    it("crear un usuario en la Base de Datos", async function() {
        const user = {
            first_name: "test",
            last_name: "test",
            email: "test@test.com",
            password: 1234,
            age: 18,
            role: "user",
            cartId: "66251caab410c7d5bda62d17",
        }
        const result = await this.UserDB.createUser(user);
        temporalUser._id = result._id;
        expect(result._id).to.not.be.undefined.and.to.not.be.null;
        
    });
    
    it("Buscar un usuario por ID", async function() {
        const id = temporalUser._id;
        const user = await this.UserDB.getUserById(id);
        expect(user).contain.all.key;
    });

    it("Borrar un usuario", async function() {
        const id = temporalUser._id;
        const user = await this.UserDB.deleteUser(id);
        expect(user !== undefined, true);
    });
});
