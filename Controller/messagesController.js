import { config } from '../configuration.js';
import { DBConnection, OBJECT_FORMAT} from '../db/dbConnection.js';

export async function createFriendMessage({ senderId, reciverId, content}) {
  try {

    

    const conection = await DBConnection()
    const sql = `INSERT INTO MESSAGES (consMensaje, consecUser, Use_consecUser, fechaRegMen) VALUES (:consMensaje,:senderId, :reciverId, :timestamp) RETURNING consMensaje, consecUser, Use_consecUser as mensajeId`
    const consMensaje = await getConsMensaje(senderId, reciverId)
    const result = await conection.execute(sql, [consMensaje, senderId, reciverId, new Date()], {outFormat: OBJECT_FORMAT})
    saveContent(content)
    await conection.commit()
    await conection.close()
    return { msg: "Message created successfully", message: result.rows[0] }
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}

export async function createGroupMessage() {
  
}

async function getConsMensaje(senderId, reciverId) {
  try {
    const conection = await DBConnection()
    const sql = `SELECT MAX(consMensaje) as consMensaje FROM MENSAJES WHERE consecUser = :senderId AND Use_consecUser = :reciverId`
    const result = await conection.execute(sql, [senderId, reciverId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows[0].consMensaje + 1
  } catch (error) {
    console.error("Error fetching consMensaje:", error)
    throw error
  }
  
}

async function saveContent({name, contenidoImag, tipoArchivo, tipoContenido}) {
  try {
    const conection = await DBConnection()
    const sql = `INSERT INTO CONTENIDO (conseContenido, contenidoImag, idTipoArchivo, idTipoContenido) VALUES (:conseContenido, :contenidoImag, :tipoArchivo, :tipoContenido)`
    const conseContenido = await getConseContenido()
    await conection.execute(sql, [conseContenido, contenidoImag, tipoArchivo, tipoContenido], {outFormat: OBJECT_FORMAT})
    await conection.commit()
    await conection.close()
    return true
  } catch (error) {
    console.error("Error saving content:", error)
    throw error
  }
  
}

async function getConseContenido() {
  try {
    const conection = await DBConnection()
    const sql = `SELECT MAX(conseContenido) as conseContenido FROM CONTENIDO`
    const result = await conection.execute(sql, [], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows[0].conseContenido + 1
  } catch (error) {
    console.error("Error fetching conseContenido:", error)
    throw error
  }
}