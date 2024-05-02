import {productsDao} from "../dao/index.js"
import CustomError from "../services/CustomError.js";
import enumErrors from "../services/enum.js";
import { generateAddProductErrorInfo , generateFindProductErrorInfo } from "../services/info.js";

const getProducts = async (req, res) => {
    try {
        req.logger.http("Mensaje HTTP: Get Products");
        const { limit = 9, page = 1, sort, category } = req.query;
        const filter = {
            options: {
                limit,
                page,
            },
        };
        
        if (category) {
            filter.query = { category: category };
        }

        if (sort) {
            filter.options.sort = { price: sort };
        }

        const productsData = await productsDao.getPaginatedProducts(filter);
        const { products } = productsData;

        if (products.length < 1) {
            res.status(404).json({
                success: false,
                message: "Los productos no se pudieron recuperar",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProductId = async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productsDao.getProductsById(pid);

        if (!product) {
            CustomError.createError({
                name: "Error al buscar el producto",
                cause: generateFindProductErrorInfo(pid),
                message: "Producto no encontrado",
                code: enumErrors.FINDING_PRODUCT_ERROR,
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const saveProducts = async (req, res) => {
    try {
        const productData = req.body;

        if (req.user.role !== 'admin' && req.user.role !== 'premium') {
            return res.status(403).json({
                success: false,
                message: "No autorizado para crear productos"
            });
        }

        productData.owner = req.user.email;

        if (!productData.title || !productData.description || !productData.code || !productData.price || !productData.stock || !productData.category) {
            CustomError.createError({
                name: "Error creando el producto",
                cause: generateAddProductErrorInfo(req.body),
                message: "Uno o más campos son inválidos",
                code: enumErrors.ADDING_PRODUCT_ERROR,
            });
        }

        const newProduct = await productsDao.createProduct(productData);

        if (!newProduct) {
            res.status(400).json({
                success: false,
                message: "No se pudo crear el producto",
            });
            return;
        }

        const products = await productsDao.getProducts();
    
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProducts = async (req, res) => {
    try {
        const { pid } = req.params;
        const productData = req.body;

        const product = await productsDao.getProductsById(pid);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        const ownerEmail = product.owner;
        const userEmail = req.user.email;

        if (req.user.role === 'Premium' && ownerEmail !== userEmail) {
            return res.status(403).json({
                success: false,
                message: "No autorizado para actualizar este producto",
            });
        }

        if (req.user.role === 'admin' || (req.user.role === 'premium' && ownerEmail === userEmail)) {
            const updatedProduct = await productsDao.updateProduct(pid, productData);
            if (!updatedProduct) {
                return res.status(400).json({
                    success: false,
                    message: "No se pudo actualizar el producto",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Producto actualizado exitosamente",
                data: updatedProduct,
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "No autorizado para actualizar este producto",
            });
        }
    } catch (error) {
        console.log("updateProducts: Error al actualizar el producto", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const deleteProducts = async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productsDao.getProductsById(pid);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        const ownerEmail = product.owner;
        const userEmail = req.user.email;

        if (req.user.role === 'premium' && ownerEmail === userEmail) {
            await productsDao.deleteProductById(pid);
            return res.status(200).json({
                success: true,
                message: "Producto eliminado exitosamente",

            });
        } else if (req.user.role === 'admin') {
            await productsDao.deleteProductById(pid);
            return res.status(200).json({
                success: true,
                message: "Producto eliminado exitosamente",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "No autorizado para eliminar este producto",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export { getProducts, getProductId, saveProducts, updateProducts, deleteProducts };