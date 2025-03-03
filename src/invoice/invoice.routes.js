import { Router } from "express";
import { createInvoiceFromCart, getAllInvoices, getUserInvoices, getInvoiceById, updateInvoiceStatus } from "./invoice.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validateAdminRole } from "../../middlewares/validate.role.js";

const api = Router();

api.post("/savefromcart", [validateJwt], createInvoiceFromCart);
api.get("/", [validateJwt, validateAdminRole], getAllInvoices);
api.get("/user/:user", [validateJwt, validateAdminRole], getUserInvoices);
api.get("/:id", [validateJwt, validateAdminRole], getInvoiceById);
api.put("/update/:id", [validateJwt, validateAdminRole], updateInvoiceStatus);

export default api;
