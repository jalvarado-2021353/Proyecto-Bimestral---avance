'use strict'

// ECModules | ESModules
import express from 'express' 
import morgan from 'morgan' 
import helmet from 'helmet'
import cors from 'cors' 
import { limiter } from '../middlewares/rate.limit.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoriesRoutes from '../src/categories/categories.routes.js'

const configs = (app)=>{
    app.use(express.json()) 
    app.use(express.urlencoded({extended: false})) 
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/categories', categoriesRoutes)
}


//ESModules no acepta exports.
export const initServer = async()=>{
    const app = express() //Instancia de express
    try{
        configs(app) //Aplicar configuraciones al servidor
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}