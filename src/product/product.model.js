import { Schema, model } from "mongoose";
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxLength: [100, "Product name cannot exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: [0, "Stock cannot be negative"]
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Categories",
            required: [true, "Category is required"]
        },
        sold: {
            type: Number,
            default: 0
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

export default model("Product", productSchema);
