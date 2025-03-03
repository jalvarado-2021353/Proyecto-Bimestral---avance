import Invoice from "./invoice.model.js";
import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";

export const createInvoiceFromCart = async (req, res) => {
    try {
        const user = req.user.uid; 
        if (!user) return res.status(401).send({ success: false, message: "Unauthorized: Token is missing or invalid" });
        console.log("Buscando carrito para usuario:", user);
        const cart = await Cart.findOne({ user }).populate("products.product");
        console.log("Carrito encontrado:", cart);
        if (!cart || cart.products.length === 0) {
            return res.status(400).send({ success: false, message: "Cart is empty" });
        }
        let total = 0;
        let productUpdates = [];
        for (let item of cart.products) {
            const product = item.product;
            if (product.stock < item.quantity) {
                return res.status(400).send({ success: false, message: `Not enough stock for ${product.name}` });
            }
            total += product.price * item.quantity;
            productUpdates.push({
                updateOne: {
                    filter: { _id: product._id },
                    update: { $inc: { stock: -item.quantity, sold: item.quantity } }
                }
            });
        }
        await Product.bulkWrite(productUpdates);
        const newInvoice = new Invoice({
            user,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total
        });
        await newInvoice.save();
        await Cart.findOneAndDelete({ user });
        return res.send({ success: true, message: "Invoice created successfully", invoice: newInvoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Error creating invoice", error: err.message });
    }
};


export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("user", "name username").populate("products.product", "name price")
        if (invoices.length === 0) return res.status(404).send({ success: false, message: "No invoices found" })
        return res.send({ success: true, message: "Invoices retrieved successfully", invoices })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error retrieving invoices", error: err.message })
    }
}

export const getUserInvoices = async (req, res) => {
    try {
        const user = req.params.user;
        const invoices = await Invoice.find({ user }).populate("products.product", "name price");
        if (invoices.length === 0) {
            return res.status(404).send({ success: false, message: "No invoices found for this user" });
        }
        return res.send({ success: true, message: "User invoices retrieved successfully", invoices });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Error retrieving user invoices", error: err.message });
    }
};


export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id).populate("user", "name username").populate("products.product", "name price")
        if (!invoice) return res.status(404).send({ success: false, message: "Invoice not found" })
        return res.send({ success: true, message: "Invoice retrieved successfully", invoice })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error retrieving invoice", error: err.message })
    }
}

export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { products, status } = req.body;
        const invoice = await Invoice.findById(id).populate("products.product");
        if (!invoice) return res.status(404).send({ success: false, message: "Invoice not found" });
        if (status) {
            invoice.status = status;
        }
        if (products && products.length > 0) {
            let productUpdates = [];
            for (let item of invoice.products) {
                let product = await Product.findById(item.product._id);
                if (product) {
                    product.stock += item.quantity; 
                    await product.save();
                }
            }
            for (let item of products) {
                let product = await Product.findById(item.product);
                if (!product) return res.status(404).send({ success: false, message: `Product ${item.product} not found` });
                if (product.stock < item.quantity) {
                    return res.status(400).send({ success: false, message: `Not enough stock for ${product.name}` });
                }
                product.stock -= item.quantity; 
                product.sold += item.quantity; 
                await product.save();

                productUpdates.push({
                    product: item.product,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            invoice.products = productUpdates;
        }
        invoice.total = invoice.products.reduce((sum, item) => sum + item.quantity * item.price, 0);
        await invoice.save();
        return res.send({ success: true, message: "Invoice updated successfully", invoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Error updating invoice", error: err.message });
    }
};




