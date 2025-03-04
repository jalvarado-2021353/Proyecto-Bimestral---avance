//Lógica de negocio

import User from "./user.model.js"
import { checkPassword, encrypt } from "../../utils/encrypt.js"

export const getAll = async(req, res)=>{
    try{
        //Configuraciones de paginación
        const { limit = 20, skip = 0 } = req.query
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0) return res.status(404).send({message: 'Users not found', success: false})
        return res.send(
            {
                success: true,
                message: 'Users found: ', 
                users,
                total: users.length
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

export const update = async(req,res)=>{
    try {
        const id = req.params.id
        const data = req.body
        if (!id) return res.status(400).send({ message: 'Invalid ID' }); // Verificar que el ID es válido
        const updateUser = await User.findByIdAndUpdate(id,data,{new:true})
        if (!updateUser)return res.status(404).send({Message: 'User not found'})
            return res.send({message: 'User updated succesfully', updateUser})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'General Error',err})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const { password } = req.body;
        const authenticatedUser = req.user;
        let user = await User.findById(id);
        if (!user) return res.status(404).send({ message: "User not found" });
        if (authenticatedUser.role !== "ADMIN" && authenticatedUser.uid !== id) {
            return res.status(403).send({ message: "You can only delete your own account" });
        }
        const passwordMatch = await checkPassword(user.password, password);
        if (!passwordMatch) return res.status(400).send({ message: "Incorrect password" });
        await User.findByIdAndDelete(id);
        return res.send({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error deleting user", error: err.message });
    }
};