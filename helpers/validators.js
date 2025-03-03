//Validar campos en las rutas
import { body } from "express-validator" //Capturar todo el body de la solicitud
import { validateErrors,validateErrorWithoutImg } from "./validate.error.js"
import { existUsername, objectIdValid } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),//.isOPCIONAL
    body('surname', 'Surname cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email').notEmpty().isEmail(),
    body('username', 'Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().withMessage('The password must be strong').isLength({min: 8}),
    validateErrors
]

export const loginValidator = [
    body('username', 'Username cannot be empty').notEmpty().toLowerCase(),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().withMessage('The password must be strong').isLength({min: 8}),
    validateErrors
]

export const UpdateValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('surname', 'Surname cannot be empty').notEmpty(),
    body('username', 'Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    validateErrors
]

export const addProductValidator = [
    body("name", "Product name cannot be empty").notEmpty().isLength({ max: 100 }).withMessage("Product name cannot exceed 100 characters"),
    body("description", "Description is required").notEmpty(),
    body("price", "Price is required and must be a positive number").notEmpty().isFloat({ min: 0 }).withMessage("Price cannot be negative"),
    body("stock", "Stock is required and must be a positive number").notEmpty().isInt({ min: 0 }).withMessage("Stock cannot be negative"),
    body("category", "Category is required").notEmpty().isMongoId().withMessage("Invalid category ID"),
    validateErrors
];

export const updateProductValidator = [
    body("name").optional().isLength({ max: 100 }).withMessage("Product name cannot exceed 100 characters"),
    body("description").optional(),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price cannot be negative"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock cannot be negative"),
    body("category").optional().isMongoId().withMessage("Invalid category ID"),
    validateErrors
];