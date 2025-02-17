//Modelo de usuario

import { Schema, model } from 'mongoose'

const userSchema = Schema(
    {  
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true, //NO SE PUEDE DUPLICAR EL VALOR
            //lowercase: true, //Lo vuelve minúscula
            maxLength: [15, `Can't be overcome 15 characters`],
        },
        email: {
            type: String,
            //Vamos a ver que pasa si no es único
            //isEmail: true, //ExpressValidator
            required: [true, 'Email is required']
            //match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `Can't be overcome 100 characters`],
            //match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm]
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true, //Volver en mayúscula
            enum: ['ADMIN', 'CLIENT']
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

//Modificar el toJSON para excluir datos en la respuesta
userSchema.methods.toJSON = function(){
    const { __v, password, ...user} = this.toObject() //Sirve para convertir un documento de MongoDB a Objeto de Javascript
    return user
}

//Crear y exportar el modelo
export default model('User', userSchema)