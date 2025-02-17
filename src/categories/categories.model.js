//Modelo de Categoria

import {Schema, model} from "mongoose"

const categoriesSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

export default model('Categories', categoriesSchema)