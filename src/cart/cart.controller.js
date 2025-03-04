import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const user = req.user.uid;
        let { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).send({ success: false, message: "Product and quantity are required" })
        }

        quantity = Number(quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).send({ success: false, message: "Quantity must be a valid number greater than 0" })
        }

        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).send({ success: false, message: "Product not found" })
        }

        let cart = await Cart.findOne({ user })

        if (cart) {
            const productIndex = cart.products.findIndex(item => item.product.toString() === product)
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity })
            }
            await cart.save();
        } else {
            cart = new Cart({ user, products: [{ product, quantity }] })
            await cart.save();
        }

        return res.send({ success: true, message: "Product added to cart successfully", cart })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Error adding product to cart", error: err.message })
    }
}


export const getCart = async (req, res) => {
    try {
        const user = req.user?.uid;  
        if (!user) return res.status(401).send({ success: false, message: "Unauthorized: Token is missing or invalid" })
        const cart = await Cart.findOne({ user }).populate("products.product", "name price")
        if (!cart || cart.products.length === 0) {
            return res.status(404).send({ success: false, message: "Cart is empty" })
        }
        return res.send({ success: true, message: "Cart retrieved successfully", cart })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Error retrieving cart", error: err.message })
    }
}

export const clearCart = async (req, res) => {
    try {
        const user = req.user.uid;
        console.log("Buscando carrito para usuario:", user)
        const cart = await Cart.findOne({ user }).populate("products.product")
        console.log("Carrito encontrado:", cart);
        if (!cart || cart.products.length === 0) {
            return res.status(400).send({ success: false, message: "Cart is already empty" })
        }
        for (let item of cart.products) {
            let productExists = await Product.findById(item.product._id)
            if (productExists) {
                productExists.stock += item.quantity;
                await productExists.save();
            }
        }
        await Cart.findOneAndDelete({ user });
        return res.send({ success: true, message: "Cart cleared successfully, products returned to stock" })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Error clearing cart", error: err.message })
    }
}






