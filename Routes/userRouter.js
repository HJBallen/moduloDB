import express from 'express'

import { checkEmail, checkUserByEmail, createUser, getUser , checkUser} from '../Controller/userController.js'

export const userRouter = express.Router()

userRouter.get("/test", async (req,res)=>{
  res.send(await getUser())
})

userRouter.post('/', async (req,res)=>{
  const { nombre, apellido, usuario, email, celular, codubicacion } = req.body
  console.log(nombre, apellido, usuario, email, celular, codubicacion );
  
  try {
    const result = await createUser({nombre, apellido, usuario, email, celular, codubicacion})
    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message})
  }
})


userRouter.post('/checkEmail/', async (req, res) => {
  const { email } = req.body
  console.log("Checking email:", email)

  try {
    const result = await checkEmail(email)
    console.log(result);
    
    res.status(200).json(result)
  } catch (error) {
    console.error("Error checking email:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

userRouter.post('/checkUser', async (req, res) => {
  const { usuario } = req.body
  console.log("Checking user:", usuario)

  try {
    const exists = await checkUser(usuario)
    res.status(200).json({ disponible: !exists})
  } catch (error) {
    console.error("Error checking user:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

userRouter.post('/checkUserEmail', async (req, res) => {
  const { email } = req.body
  console.log("Checking user and email:", email)

  try {
    const exists = await checkUserByEmail(email)
    res.status(200).json({ disponible: !exists })
  } catch (error) {
    console.error("Error checking user and email:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})


