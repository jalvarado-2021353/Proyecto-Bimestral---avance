import Product from "./product.model.js";

export const save = async (req, res) => {
    try {
        const data = req.body;
        const product = new Product(data);
        await product.save();
        return res.send({ success: true, message: `${product.name} saved successfully`, product })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error when adding product", error: err.message })
    }
}

// Obtener todos los productos con paginación
export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const products = await Product.find()
            .populate("category", "name")
            .skip(Number(skip))
            .limit(Number(limit));
        if (products.length === 0) return res.status(404).send({ success: false, message: "Products not found" })
        return res.send({
            success: true,
            message: "Products found",
            products,
            total: products.length
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", error: err.message })
    }
}

// Obtener un solo producto por ID
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category", "name");
        if (!product) return res.status(404).send({ success: false, message: "Product not found" });
        return res.send({ success: true, message: "Product found", product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error", error: err.message });
    }
}

// Actualizar un producto
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!updatedProduct) return res.status(404).send({ success: false, message: "Product not found" });
        return res.send({ success: true, message: "Product updated successfully", updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error", error: err.message });
    }
}

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).send({ success: false, message: "Product not found" });
        return res.send({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error", error: err.message });
    }
}

export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 }).populate("category", "name");
        if (products.length === 0) return res.status(404).send({ success: false, message: "No out-of-stock products found" });
        return res.send({ success: true, message: "Out-of-stock products retrieved successfully", products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error", error: err.message });
    }
}

export const getTopSellingProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const products = await Product.find()
            .sort({ sold: -1 }) 
            .limit(Number(limit))
            .populate("category", "name");
        if (products.length === 0) return res.status(404).send({ success: false, message: "No top-selling products found" })
        return res.send({ success: true, message: "Top-selling products retrieved successfully", products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", error: err.message })
    }
}


