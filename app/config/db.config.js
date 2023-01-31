require("dotenv").config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DB,
    dialect: "mysql" ,
    pool: {
      max: 7,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  };