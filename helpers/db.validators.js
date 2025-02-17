//Validaciones en relación a la BD

import User from '../src/user/user.model.js'
import { isValidObjectId } from 'mongoose'

export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const objectIdValid = async(objectId)=>{
    if (!isValidObjectId(objectId)){
        throw new Error (`Keeper is not object valid`)
    }
        
}