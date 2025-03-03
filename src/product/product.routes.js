import { Router } from "express";
import { save, getAll, get, update, deleteProduct, getOutOfStockProducts, getTopSellingProducts } from "./product.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validateAdminRole } from "../../middlewares/validate.role.js";
import { addProductValidator, updateProductValidator } from "../../helpers/validators.js";

const api = Router();

api.post("/save", [validateJwt, validateAdminRole, addProductValidator], save);
api.get("/", getAll);
api.get("/outstock", [validateJwt, validateAdminRole], getOutOfStockProducts);
api.get("/topselling", [validateJwt, validateAdminRole], getTopSellingProducts);
api.get("/:id", get);
api.put("/update/:id", [validateJwt, validateAdminRole, updateProductValidator], update);
api.delete("/delete/:id", [validateJwt, validateAdminRole], deleteProduct);

export default api;