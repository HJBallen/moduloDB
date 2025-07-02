import express from 'express'
import {config} from './configuration.js'
import cors from 'cors'

import Router from './Routes/index.js'

const app = express()
const corsOptions = {
  origin: "*"
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/api/v1",Router)

app.get('/',(req,res)=>{
  res.send("<h1>Hello World!</h1>")
})

app.listen(config.PORT,()=>{
    console.log(`Server is running on port: ${config.PORT}`)
})