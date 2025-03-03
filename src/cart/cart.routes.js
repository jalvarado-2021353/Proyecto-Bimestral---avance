import { Router } from "express";
import { addToCart, getCart, clearCart } from "./cart.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router();

api.post("/add", [validateJwt], addToCart);
api.get("/", [validateJwt], getCart);
api.delete("/clear", [validateJwt], clearCart);

export default api;
