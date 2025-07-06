import express from 'express'
import multer from 'multer'

export const messageRouter = express.Router()

import {createFriendTextMessage, createFriendContentMessage, prepareFile, getFriendMensajes, getGroupMensajes} from '../Controller/messagesController.js'

const storage = multer.diskStorage({destination: (req, file, cb) => {
  cb(null, 'uploads/')
}, filename: (req, file, cb) => {
  const timestamp = Date.now()
  cb(null, `${timestamp}-${file.originalname}`)
}})
const upload = multer({storage: storage})

messageRouter.post('/createContentFriendMessage', upload.single('file'), async (req, res) => {
  let { senderId, reciverId, senderHiloId, reciverHiloId, mensajeHiloId, content } = req.body
  const file = req.file
  if (senderHiloId === undefined) senderHiloId = null
  if (reciverHiloId === undefined) reciverHiloId = null
  if (mensajeHiloId === undefined) mensajeHiloId = null
  content = await prepareFile(file)
  try {
    const result = await createFriendContentMessage({ senderId, reciverId, senderHiloId, reciverHiloId, mensajeHiloId, content })
    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating friend message:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})


messageRouter.post('/createTextFriendMessage', async (req, res) => {
  let { senderId, reciverId, senderHiloId, reciverHiloId, mensajeHiloId, mensaje} = req.body
  if (senderHiloId === undefined) senderHiloId = null
  if (reciverHiloId === undefined) reciverHiloId = null
  if (mensajeHiloId === undefined) mensajeHiloId = null
  let content = {localizacion: mensaje, tipoArchivo: null, tipoContenido: '2'} 
  try {
    const result = await createFriendTextMessage({ senderId, reciverId, senderHiloId, reciverHiloId, mensajeHiloId, content })
    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating friend message:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

messageRouter.post('/createContentGroupMessage', upload.single('file'), async (req, res) => {
  let { senderId, reciverId, codGrupo, senderHiloId, reciverHiloId, mensajeHiloId, content } = req.body
  const file = req.file
  if (senderHiloId === undefined) senderHiloId = null
  if (reciverHiloId === undefined) reciverHiloId = null
  if (mensajeHiloId === undefined) mensajeHiloId = null
  content = await prepareFile(file)
  try {
    const result = await createContentGroupMessage({ senderId, reciverId, codGrupo, senderHiloId, reciverHiloId, mensajeHiloId, content })
    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating group message:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

messageRouter.post('/createTextGroupMessage', async (req, res) => {
  let { senderId, reciverId, codGrupo, senderHiloId, reciverHiloId, mensajeHiloId, mensaje } = req.body
  if (senderHiloId === undefined) senderHiloId = null
  if (reciverHiloId === undefined) reciverHiloId = null
  if (mensajeHiloId === undefined) mensajeHiloId = null
  let content = {localizacion: mensaje, tipoArchivo: null, tipoContenido: '2'} 
  try {
    const result = await createTextGroupMessage({ senderId, reciverId, codGrupo, senderHiloId, reciverHiloId, mensajeHiloId, content })
    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating group message:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

messageRouter.get('/getFriendMessages/:senderId/:reciverId', async (req, res) => {
  const { senderId, reciverId } = req.params
  try {
    const messages = await getFriendMensajes(senderId, reciverId)
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error fetching friend messages:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

messageRouter.get('/getGroupMessages/:codGrupo', async (req, res) => {
  const { codGrupo } = req.params
  try {
    const messages = await getGroupMensajes(codGrupo)
    console.log(messages);
    
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error fetching group messages:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})
