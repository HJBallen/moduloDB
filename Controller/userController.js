import { config } from '../configuration.js';
import { DBConnection, OBJECT_FORMAT} from '../db/dbConnection.js';
import nodemailer from 'nodemailer';

export async function getUser() {
  try {
    const conection = await DBConnection()
    console.log(`Esta es la coneccion: ${conection}`);
    
    const sql = `SELECT * FROM USUARIO`
    const result = await conection.execute(sql,[],{outFormat: OBJECT_FORMAT})
    console.log(result.rows);
    await conection.close()
    
    return result.rows
  } catch (error) { 
    console.error("Error fetching user:", error);
    throw error
  }
}

export async function getUserInfo(userId) {
  try {
    const conection = await DBConnection()
    const sql = `
    SELECT CONSECUSER id, 
      NOMBRE nombre,
      APELLIDO apellido,
      EMAIL email,
      CELULAR celular
    FROM USUARIO
    WHERE CONSECUSER = :userId`
    const result = await conection.execute(sql, [userId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching user info:", error)
    throw error
  }
}

export async function getFriends(userId) {
  try {
    const conection = await DBConnection()
    const sql = `
      SELECT U.CONSECUSER id, 
        U.NOMBRE nombre, 
        U.APELLIDO apellido, 
        U.EMAIL email, 
        U.CELULAR celular
      FROM USUARIO U
      INNER JOIN AMIG_ A ON U.CONSECUSER = A.USE_CONSECUSER
      WHERE A.CONSECUSER = :userId`
    const result = await conection.execute(sql, [userId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching friends:", error)
    throw error
    
  }
}

export async function getUserGroups(userId) {
  try {
    const conection = await DBConnection()
    const sql = `
      SELECT G.CODGRUPO id,
        G.NOMGRUPO nombre
      FROM GRUPO G
      INNER JOIN PERTENECE P ON G.CODGRUPO = P.CODGRUPO
      WHERE P.CONSECUSER = :userId`
    const result = await conection.execute(sql, [userId], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows
  } catch (error) {
    console.error("Error fetching group messages by user:", error)
    throw error
  }

}