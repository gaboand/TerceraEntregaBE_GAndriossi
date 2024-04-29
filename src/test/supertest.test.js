import supertest from "supertest";
import {expect} from "chai";

const requester = supertest("http://localhost:3000");

describe("Testing proyecto ecommerce", () => {
    describe("Testing de products", () => {
        it("El endpoint GET /api/products debe poder obtener todos los productos", async () => {
            const result = await requester.get("/api/products");
            expect(result.statusCode).to.equal(200);
        });

        it("El endpoint GET /api/products/:pid debe obtener un producto específico", async () => {
            const productId = "662fc82a922b3a971320fed4";
            const result = await requester.get(`/api/products/${productId}`);
            expect(result.statusCode).to.equal(200);
        });
    
        it ("El endpoint POST /api/products debe poder crear un nuevo producto", async () => {
            const product = {
                title: "test",
                description: "test",
                price: 1,
                thumbnail: "test",
                code: "test00000001",
                stock: 1,
                category: "test",
                owner: "661c56c3d0ea0ecf3c364f14",
            }
            const result = await requester.post("/api/products").send(product);
            expect(result.ok).to.be.true;
        })

        it("El endpoint PUT /api/products/:pid debe actualizar un producto existente", async () => {
            const productId = "662fc82a922b3a971320fed4";
            const updateInfo = {
                title: "Producto Actualizado",
                price: 30.00,
                stock: 20
            };
            const result = await requester.put(`/api/products/${productId}`).send(updateInfo);
            expect(result.statusCode).to.equal(200);
        });

        it("El endpoint DELETE /api/products/:pid debe eliminar un producto", async () => {
            const productId = "662fc82a922b3a971320fed4";
            const result = await requester.delete(`/api/products/${productId}`);
            expect(result.statusCode).to.equal(200);
        });
    });

    describe("Testing de carts", () => {
        it("El endpoint POST /api/carts/ debería crear un carrito nuevo", async () => {
            const result = await requester.post("/api/carts/");
            expect(result.statusCode).to.equal(200);
        });
    
        it("El endpoint GET /api/carts/:cid debería obtener los detalles de un carrito", async () => {
            const result = await requester.get("/api/carts/662fc1243364176aa3b67db2");
            expect(result.statusCode).to.equal(200);
        });
    
        it("El endpoint GET /api/carts/ debería obtener todos los carritos", async () => {
            const result = await requester.get("/api/carts/");
            expect(result.statusCode).to.equal(200);
        });
    
        it("El endpoint POST /api/carts/:cid/product debería agregar un producto al carrito", async () => {
            const productToAdd = { pid: "662fb2dcb1f241fbee2c5591", quantity: 1 }; 
            const result = await requester.post("/api/carts/662fc1243364176aa3b67db2/product").send(productToAdd);
            expect(result.statusCode).to.equal(200);
        });

        it("El endpoint PUT /api/carts/:cid/product/:productId/quantity debería actualizar la cantidad de un producto en el carrito", async () => {
            const updateInfo = { quantity: 2 }; 
            const result = await requester.put("/api/carts/662fc1243364176aa3b67db2/product/662fb2dcb1f241fbee2c5591/quantity").send(updateInfo);
            expect(result.statusCode).to.equal(200);
        });
    
    
        it("El endpoint DELETE /api/carts/:cid/empty debería vaciar el carrito", async () => {
            const result = await requester.delete("/api/carts/662fc1243364176aa3b67db2/empty");
            expect(result.statusCode).to.equal(200);
        });
    

    });
    

    describe("Testing de users", () => {
        it("El endpoint POST /api/session/signup debería registrar un nuevo usuario", async () => {
            const newUser = {
                first_name: "Sofi",
                last_name: "Andriossi",
                email: "sofi@gmail.com",
                password: "123456",
                age: 21,
                role: "user"
            };
            const result = await requester.post("/api/session/signup").send(newUser);
            expect(result.statusCode).to.equal(200);
        });
    
        it("El endpoint POST /api/session/login debería autenticar un usuario", async () => {
            const credentials = { email: "sofi@gmail.com", password: "123456" };
            const result = await requester.post("/api/session/login").send(credentials);
            expect(result.statusCode).to.equal(200);
        });
    
        it("El endpoint GET /api/session/logout debería cerrar la sesión del usuario", async () => {
            const result = await requester.get("/api/session/logout");
            expect(result.statusCode).to.equal(302);
        });
    
    });
})

