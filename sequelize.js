require("dotenv").config();
const sequelize = require("sequelize");

const { DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT, DB_HOST } = process.env;


module.exports = new sequelize({
    host: DB_HOST,
    name: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    loggin: false
})