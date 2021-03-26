require("dotenv").config();
const Sequelize = require("sequelize");

const {
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_DIALECT,
  DB_HOST,
  DB_TEST,
  NODE_ENV,
  DATABASE_URL
} = process.env;

if (DATABASE_URL) {
   module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
} else {

module.exports = new Sequelize({
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: NODE_ENV !== "test" ? DB_DATABASE : DB_TEST,
  dialect: DB_DIALECT,
  logging: false,
})
}
