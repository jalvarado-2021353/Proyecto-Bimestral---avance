//Rutas de Categories
import { Router } from "express"
import { save,
    getAll, 
    get, 
    update,
    deleteCategories
} from "./categories.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"
import { UpdateValidator } from "../../helpers/validators.js"
import { validateAdminRole } from "../../middlewares/validate.role.js"

const api = Router()

//Rutas privadas (Solo puede acceder si está logeado)
api.post('/save',[validateJwt, validateAdminRole],save)
api.post('/')
api.get('/', getAll)
api.get('/:id', get)
api.put('/updateCategories/:id', [validateJwt, validateAdminRole], update)
api.delete('/deleteCategories/:id', [validateJwt, validateAdminRole], deleteCategories)
export default api