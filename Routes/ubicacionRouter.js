import express from 'express'
import { getUbicacion, getPaises} from '../Controller/ubicacionController.js'

export const ubicacionRouter = express.Router()

ubicacionRouter.get("/paises",async (req,res)=>{
  res.status(200).json(await getPaises())
})