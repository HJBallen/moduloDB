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

export async function getUserInfo({email}) {
  try {
    const conection = await DBConnection()
    const sql = `SELECT * FROM USUARIO WHERE EMAIL = :email`
    const result = await conection.execute(sql, [email], {outFormat: OBJECT_FORMAT})
    await conection.close()
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching user info:", error)
    throw error
  }
}

export async function createUser({nombre, apellido, usuario, email, celular, codubicacion}) {
  try {
    validation.nombre(nombre)
    validation.apellido(apellido)
    validation.user(usuario)
    validation.email(email)
    validation.celular(celular)
    validation.codubicacion(codubicacion)

    if (await checkUser(usuario)) {
      throw new Error("User already exists");
    }

    const conection = await DBConnection()
    const sql = `INSERT INTO USUARIO (CONSECUSER, CODUBICA, NOMBRE, APELLIDO, USUARIO, FECHAREGISTRO, EMAIL, CELULAR) 
      VALUES (:id, :idubica,:nombre, :apellido,:usuario, :fecharegistro,:email, :celular)`
      let result;
      try {
      result = await conection.execute(sql, [await newUserId(), codubicacion.toString(),nombre, apellido, usuario, new Date(), email, celular], {outFormat : OBJECT_FORMAT})
      await conection.commit()
    } catch (error) {
      await conection.rollback()
      console.error("Error executing SQL:", error);
      throw new Error("Database operation failed");
    }
    await conection.close()
    return {msg: "User created successfully", user: result.rows}
  } catch (error) {
    console.error("Error creating user:", error);
    throw error
  }
}

export async function checkUser(user) {
  try {
    const conection = await DBConnection()
    const sql = `SELECT NOMBRE FROM USUARIO WHERE (USUARIO = :usuario)`
    const result = await conection.execute(sql, [user])
    console.log(result.rows.length);
    await conection.close()
    if (result.rows.length > 0) {
      console.log("User already exists");
      return true
    }
    return false
  } catch (error) {
    console.error("Error checking user:", error);
    throw error
  }
}

export async function newUserId() {
  try {
    const conection = await DBConnection()
    const sql = `SELECT MAX(TO_NUMBER(CONSECUSER)) as maxId FROM USUARIO`
    const result = await conection.execute(sql,[], {outFormat: OBJECT_FORMAT})
    await conection.close()
    console.log("resultado:",result);

    const lastId = result.rows[0].MAXID === null ? 1 : result.rows[0].MAXID + 1;
    console.log(`Last ID: ${lastId}`);
    if (lastId > 99999) {
      throw new Error("User ID limit reached, cannot create more users.");
    }
    const newId = lastId.toString().padStart(5,'0')
    console.log(`New User ID: ${newId}`);
    return newId
  } catch (error) {
    console.error("Error generating new user ID:", error);
    throw error
  }
}

export async function checkUserByEmail(email) {
  try {
    const conection = await DBConnection()
    const sql = `SELECT NOMBRE FROM USUARIO WHERE (EMAIL = :email)`
    const result = await conection.execute(sql, [email], {outFormat: OBJECT_FORMAT})
    await conection.close()
  
    if (result.rows.length > 0) {
      console.log("Email already exists");
      return true
    }
    return false
  } catch (error) {
    console.error("Error checking email:", error);
    throw error
  }
}

export async function checkEmail(email) {
  try{
    const code = Math.ceil((Math.random()*1000000)).toString().padStart(6,"0")
    console.log(code);
    
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${code}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
        
      } else {
        console.log("Email sent:", info.response);
        return {success:true, code:code}
      }
    })
    return {success: true, code}
  }catch(error){
    console.error("Error checking email:", error);
    throw error
  }
}

const validation = {
  nombre: (nombre)=>{ if(typeof nombre !== 'string') throw new Error("Nombre must be a string")},
  apellido: (apellido)=>{ if(typeof apellido !== 'string') throw new Error("Apellido must be a string")},
  user: (user)=>{ if(typeof user !== 'string') throw new Error("User must be a string")},
  email: (email)=>{ if(typeof email !== 'string') throw new Error("Email must be a string")},
  celular: (celular)=>{ if(typeof celular !== 'string') throw new Error("Celular must be a string")},
  codubicacion: (codubicacion)=>{ if(typeof codubicacion !== 'string') throw new Error("CodUbicacion must be a string")},
}
