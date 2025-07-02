import express from 'express';

//Importar Rutas
import { ubicacionRouter } from './ubicacionRouter.js';
import { userRouter } from './userRouter.js';

const Router = express.Router()
//Definir rutas

Router.get("/test",(req,res)=>{
  res.send("<h1>Test Route!</h1>")
})

Router.use('/ubicacion',ubicacionRouter)
Router.use('/user', userRouter)


export default Router;