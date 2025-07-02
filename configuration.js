import dotenv from 'dotenv';
dotenv.config();

export const config={
  PORT: process.env.PORT || 3000,
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.DBPASSWORD,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
}