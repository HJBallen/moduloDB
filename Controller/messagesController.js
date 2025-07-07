import { config } from '../configuration.js';
import { DBConnection, OBJECT_FORMAT} from '../db/dbConnection.js';

export async function createFriendTextMessage({ senderId, reciverId, senderHiloId, reciverHiloId, mensajeHiloId,content}) {
  try {

    const conection = await DBConnection()
    const sql = `INSERT INTO MESSAGES (consMensaje, consecUser, Use_consecUser, fechaRegMen, MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE) VALUES (:consMensaje,:senderId, :reciverId, :timestamp, :senderHiloId, :reciverHiloId, :mensajeHiloId) RETURNING consMensaje, consecUser, Use_consecUser`
    const consMensaje = await getConsMensaje(senderId, reciverId)
    const result = await conection.execute(sql, [consMensaje, senderId, reciverId, new Date(), senderHiloId, reciverHiloId, mensajeHiloId], {outFormat: OBJECT_FORMAT})
    const mensaje = {mensajeId:consMensaje, senderId, reciverId}
    saveContent(mensaje,content)
    await conection.commit()
    await conection.close()
    return { msg: "Message created successfully", message: result.rows[0] }
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}

export async function createFriendContentMessage({ senderId, reciverId, senderHiloId, reciverHiloId, mensajeHiloId,content}) {
  try {
    const conection = await DBConnection()
    const sql = `INSERT INTO MESSAGES (consMensaje, consecUser, Use_consecUser, fechaRegMen, MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE) VALUES (:consMensaje,:senderId, :reciverId, :timestamp, :senderHiloId, :reciverHiloId, :mensajeHiloId) RETURNING consMensaje, consecUser, Use_consecUser`
    const consMensaje = await getConsMensaje(senderId, reciverId)
    const result = await conection.execute(sql, [consMensaje, senderId, reciverId, new Date(), senderHiloId, reciverHiloId, mensajeHiloId], {outFormat: OBJECT_FORMAT})
    const mensaje = {mensajeId:consMensaje, senderId, reciverId}
    saveContent(mensaje,content)
    await conection.commit()
    await conection.close()
    return { msg: "Message created successfully", message: result.rows[0] }
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}

export async function createContentGroupMessage({ senderId, reciverId, codGrupo,senderHiloId, reciverHiloId, mensajeHiloId, content }) {
  try {
    const conection = await DBConnection()
    const sql = `INSERT INTO MENSAJE (CONSECUSER, USE_CONSECUSER, CONSMENSAJE, MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE, CODGRUPO, FECHAREGMEN) VALUES (:senderId, :reciverId, :consMensaje,:senderHiloId, reciverHiloId, mensajeHiloId,:codGrupo ,CURRENT_DATE);`
    const consMensaje = await getConsMensajeGrupo(senderId, reciverId, codGrupo)
    const result = await conection.execute(sql, [senderId, reciverId, consMensaje, senderHiloId, reciverHiloId, mensajeHiloId, codGrupo ,new Date()], {outFormat: OBJECT_FORMAT})
    const mensaje = {mensajeId:consMensaje, senderId, reciverId}
    saveContent(mensaje,content)
    await conection.commit()
    await conection.close()
    return { msg: "Message created successfully", message: result.rows[0] }
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}

export async function createTextGroupMessage({ senderId, reciverId, codGrupo,senderHiloId, reciverHiloId, mensajeHiloId, content }) {
  try {
    const conection = await DBConnection()
    const sql = `INSERT INTO MENSAJE (CONSECUSER, USE_CONSECUSER, CONSMENSAJE, MEN_CONSECUSER, MEN_USE_CONSECUSER, MEN_CONSMENSAJE, CODGRUPO, FECHAREGMEN) VALUES (:senderId, :reciverId, :consMensaje,:senderHiloId, reciverHiloId, mensajeHiloId,:codGrupo ,CURRENT_DATE);`
    const consMensaje = await getConsMensajeGrupo(senderId, reciverId, codGrupo)
    const result = await conection.execute(sql, [senderId, reciverId, consMensaje, senderHiloId, reciverHiloId, mensajeHiloId, codGrupo ,new Date()], {outFormat: OBJECT_FORMAT})
    const mensaje = {mensajeId:consMensaje, senderId, reciverId}
    saveContent(mensaje,content)
    await conection.commit()
    await conection.close()
    return { msg: "Message created successfully", message: result.rows[0] }
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
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

async function getConsMensajeGrupo(senderId, reciverId, codGrupo) {
  try {
    const conection = await DBConnection()
    const sql = `SELECT MAX(consMensaje) as consMensaje FROM MENSAJES WHERE consecUser = :senderId AND Use_consecUser = :reciverId AND CODGRUPO = :codGrupo`
    const result = await conection.execute(sql, [senderId, reciverId, codGrupo], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows[0].consMensaje + 1
  } catch (error) {
    console.error("Error fetching consMensaje:", error)
    throw error
  }
  
}

async function saveContent({mensajeId, senderId, reciverId},{localizacion, tipoArchivo, tipoContenido}) {
  try {
    const conection = await DBConnection()
    const sql = `INSERT INTO CONTENIDO (CONSECCONTENIDO, IDTIPOCONTENIDO, CONSECUSER, USE_CONSECUSER, CONSMENSAJE, IDTIPOARCHIVO, CONTENIDOIMAG, LOCALIZACONTENIDO) VALUES (:conseContenido, :tipoContenido, :senderId, :reciverId, :mensajeId, :tipoArchivo, EMPTY_BLOB(), :localizacion)`
    const conseContenido = await getConseContenido(senderId, reciverId, mensajeId)
    await conection.execute(sql, [conseContenido, tipoContenido, senderId, reciverId, mensajeId, tipoArchivo, localizacion], {outFormat: OBJECT_FORMAT})
    await conection.commit()
    await conection.close()
    return true
  } catch (error) {
    console.error("Error saving content:", error)
    throw error
  }
  
}

async function getConseContenido(senderId, reciverId, mensajeId) {
  try {
    const conection = await DBConnection()
    const sql = `SELECT MAX(conseContenido) as conseContenido FROM CONTENIDO WHERE CONSECUSER = :senderId AND USE_CONSECUSER = :reciverId AND CONSMENSAJE = :mensajeId`
    const result = await conection.execute(sql, [senderId, reciverId, mensajeId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows[0].conseContenido + 1
  } catch (error) {
    console.error("Error fetching conseContenido:", error)
    throw error
  }
}


export async function getFriendMensajes(senderId, reciverId) {
  try {
    const conection = await DBConnection()
    const sql = `
      SELECT M.CONSMENSAJE id,
        M.CONSECUSER remitente,
        M.USE_CONSECUSER receptor,
        M.FECHAREGMEN fecha,
        M.MEN_CONSMENSAJE hilo,
        M.MEN_CONSECUSER hiloRemitente,
        M.MEN_USE_CONSECUSER hiloReceptor,
        C.LOCALIZACONTENIDO localizaContenido,
        T.DESCTIPOCONTENIDO tipoContenido,
        A.DESCTIPOARCHIVO tipoArchivo
      FROM MENSAJE M
      LEFT JOIN CONTENIDO C ON M.USE_CONSECUSER= C.USE_CONSECUSER AND M.CONSECUSER = C.CONSECUSER AND M.CONSMENSAJE = C.CONSMENSAJE
      LEFT JOIN TIPOCONTENIDO T ON C.IDTIPOCONTENIDO = T.IDTIPOCONTENIDO
      LEFT JOIN TIPOARCHIVO A ON C.IDTIPOARCHIVO = A.IDTIPOARCHIVO
      WHERE ((M.CONSECUSER = :senderId AND M.USE_CONSECUSER = :reciverId) OR (M.USE_CONSECUSER = :senderId AND M.CONSECUSER = :reciverId)) AND M.CODGRUPO IS NULL
      ORDER BY M.FECHAREGMEN DESC`
    const result = await conection.execute(sql, [senderId, reciverId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching friend messages:", error)
    throw error
  }
}

export async function getGroupMensajes(codGrupo) {
  try {
    const conection = await DBConnection()
    const sql = `
      SELECT M.CONSMENSAJE id, 
        M.CONSECUSER remitente,
        M.USE_CONSECUSER receptor,
        M.FECHAREGMEN fecha,
        M.MEN_CONSMENSAJE hilo,
        M.MEN_CONSECUSER hiloRemitente,
        M.MEN_USE_CONSECUSER hiloReceptor,
        C.LOCALIZACONTENIDO localizaContenido,
        T.DESCTIPOCONTENIDO tipoContenido,
        A.DESCTIPOARCHIVO tipoArchivo
      FROM MENSAJE M
      LEFT JOIN CONTENIDO C 
        ON M.USE_CONSECUSER = C.USE_CONSECUSER 
        AND M.CONSECUSER = C.CONSECUSER 
        AND M.CONSMENSAJE = C.CONSMENSAJE
      LEFT JOIN TIPOCONTENIDO T ON C.IDTIPOCONTENIDO = T.IDTIPOCONTENIDO
      LEFT JOIN TIPOARCHIVO A ON C.IDTIPOARCHIVO = A.IDTIPOARCHIVO
      WHERE M.CODGRUPO = :codGrupo
      ORDER BY M.FECHAREGMEN DESC`
    const result = await conection.execute(sql, [codGrupo], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching friend messages:", error)
    throw error
  }
}

export async function getIntegrantesGrupos(userId, codGrupo) {
  try {
    const conection = await DBConnection()
    const sql = `
    SELECT U.CONSECUSER id
    FROM USUARIO U 
    INNER JOIN PERTENECE P ON U.CONSECUSER = P.USE_CONSECUSER
    WHERE P.CODGRUPO = :codGrupo AND P.CONSECUSER NOT LIKE :userId;`
    const result = await conection.execute(sql, [codGrupo, userId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching group members:", error)
    throw error
  }
}

export async function prepareFile(file) {
  try {
    const localizacion = file.path
    const tipoArchivo = getFileType(file)
    const tipoContenido = getContentType(file)
    return {localizacion, tipoArchivo, tipoContenido}
  } catch (error) {
    throw new Error("Error preparing file: " + error.message);
    
  }
}

export function getFileType(file) {
  const fileType = file.mimetype.split('/')[1];
  switch (fileType) {
    case 'jpeg':
      return 'BMP'
    case 'jpg':
      return 'BMP'
    case 'png':
      return 'BMP'
    case 'pdf':
      return 'PDF'
    case 'mp4':
      return 'MP4'
    case 'avi':
      return 'AVI'
    case 'mp3':
      return 'MP3'
    case 'exe':
      return 'EXE'
    case 'docx':
      return 'DOC'
    case 'xlsx':
      return 'XLS'
    default:
      return 'DOC'
  }
}

export function getContentType(file) {
  const fileType = file.mimetype.split('/')[0];
  switch (fileType) {
    case 'image':
      return '1'
    case 'video':
      return '5'
    case 'text':
      return '2'
    default:
      return '2'
  }
}

export async function getLastGroupMessage(codGrupo) {
  try {
    const conection = await DBConnection()
    const sql = `
      SELECT * FROM (
  SELECT M.CONSMENSAJE id, 
        M.CONSECUSER remitente,
        M.USE_CONSECUSER receptor,
        M.FECHAREGMEN fecha,
        M.MEN_CONSMENSAJE hilo,
        M.MEN_CONSECUSER hiloRemitente,
        M.MEN_USE_CONSECUSER hiloReceptor,
        C.LOCALIZACONTENIDO localizaContenido,
        T.DESCTIPOCONTENIDO tipoContenido,
        A.DESCTIPOARCHIVO tipoArchivo
FROM MENSAJE M
LEFT JOIN CONTENIDO C 
  ON M.USE_CONSECUSER = C.USE_CONSECUSER 
  AND M.CONSECUSER = C.CONSECUSER 
  AND M.CONSMENSAJE = C.CONSMENSAJE
LEFT JOIN TIPOCONTENIDO T ON C.IDTIPOCONTENIDO = T.IDTIPOCONTENIDO
LEFT JOIN TIPOARCHIVO A   ON C.IDTIPOARCHIVO = A.IDTIPOARCHIVO
WHERE M.CODGRUPO = :codGrupo
ORDER BY M.FECHAREGMEN ASC
) WHERE ROWNUM = 1`
    const result = await conection.execute(sql, [codGrupo], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching friend messages:", error)
    throw error
  }
  
}

export async function getLastFriendMessage(senderId,reciverId) {
  try {
    const conection = await DBConnection()
    const sql = `
      SELECT * FROM (
  SELECT M.CONSMENSAJE id,
        M.CONSECUSER remitente,
        M.USE_CONSECUSER receptor,
        M.FECHAREGMEN fecha,
        M.MEN_CONSMENSAJE hilo,
        M.MEN_CONSECUSER hiloRemitente,
        M.MEN_USE_CONSECUSER hiloReceptor,
        C.LOCALIZACONTENIDO localizaContenido,
        T.DESCTIPOCONTENIDO tipoContenido,
        A.DESCTIPOARCHIVO tipoArchivo
FROM MENSAJE M
LEFT JOIN CONTENIDO C ON M.USE_CONSECUSER= C.USE_CONSECUSER AND M.CONSECUSER = C.CONSECUSER AND M.CONSMENSAJE = C.CONSMENSAJE
LEFT JOIN TIPOCONTENIDO T ON C.IDTIPOCONTENIDO = T.IDTIPOCONTENIDO
LEFT JOIN TIPOARCHIVO A ON C.IDTIPOARCHIVO = A.IDTIPOARCHIVO
WHERE ((M.CONSECUSER = :senderId AND M.USE_CONSECUSER = :reciverId) OR (M.CONSECUSER = :reciverId AND M.USE_CONSECUSER = :senderId)) AND M.CODGRUPO IS NULL
ORDER BY M.FECHAREGMEN ASC
) WHERE ROWNUM = 1`
    const result = await conection.execute(sql, [senderId,reciverId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching friend messages:", error)
    throw error
  }
  
}