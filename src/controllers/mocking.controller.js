import { faker } from "@faker-js/faker";

async function generateProducts(req, res) {
    const productsMocking = [];
    try {
        for (let i = 0; i < 100; i++) {
            let product = {
                id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                thumbnail: faker.image.url(),
                code: faker.commerce.isbn(),
                stock: Math.floor(Math.random() * 20),
                category: faker.commerce.department()
            };

            productsMocking.push(product);
        }
        res.json({
            data: productsMocking,
            limit: false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
}

export { generateProducts };