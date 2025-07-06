import express from 'express';

//Importar Rutas
import { userRouter } from './userRouter.js';
import { messageRouter } from './messageRouter.js';

const Router = express.Router()
//Definir rutas

Router.get("/test",(req,res)=>{
  res.send("<h1>Test Route!</h1>")
})

Router.use('/mensajes',messageRouter)
Router.use('/user', userRouter)


export default Router;