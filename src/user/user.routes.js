import { Router } from "express"
import { 
    getAll,  
    update,
    deleteUser
} from "./user.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"
import { UpdateValidator, deleteAccountValidator  } from "../../helpers/validators.js"
import { validateAdminRole } from "../../middlewares/validate.role.js"

const api = Router()

//Rutas privadas (Solo puede acceder si está logeado)
api.get('/', getAll)
api.put('/updateUser/:id', [validateJwt, UpdateValidator, validateAdminRole], update)
api.delete('/deleteUser/:id', [validateJwt, deleteAccountValidator], deleteUser)
export default api