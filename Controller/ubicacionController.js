import { DBConnection, OBJECT_FORMAT} from '../db/dbConnection.js';
import { config } from '../configuration.js';

export async function getPaises() {
  try {
    const conection = await DBConnection();
    const sql = `SELECT CODUBICA codigo,NOMUBICA Pais FROM UBICACION WHERE CODTIPOUBICA = :id`;
    const result = await conection.execute(sql, ['1'], { outFormat: OBJECT_FORMAT });
    await conection.close();
    console.log("Paises:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
  
}

export async function getUbicacion() {
try {
  const conection = await DBConnection();
  const sql = `SELECT * FROM UBICACION`;
  const result = await conection.execute(sql,[],{});
  await conection.close();
  console.log("Paises:", result);
  return result.rows;
} catch (error) {
  console.error("Error fetching location:", error);
  throw error;
  }
}
