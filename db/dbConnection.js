import {config} from '../configuration.js';
import OracleDB from 'oracledb';


async function DBConnection() {
  try {
    OracleDB.initOracleClient()
    await OracleDB.createPool({
      user: config.DBUSER,
      password: config.DBPASSWORD,
      connectString: config.DB_CONNECTION_STRING
    });
    console.log("Database connection pool created");
    const connection = OracleDB.getConnection()
    return connection
  } catch (error) {
    console.error("Error creating database connection pool:", error);
  }
}

const OBJECT_FORMAT = OracleDB.OUT_FORMAT_OBJECT;

export { 
  DBConnection, 
  OBJECT_FORMAT
};
