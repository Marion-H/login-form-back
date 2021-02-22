const Sequelize = require("sequelize")
const SequelizeInstance = require("../sequelize")

const User = SequelizeInstance.define("User", {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    name:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    mobile:{
        type: Sequelize.STRING(200),
        allowNull: true,
    }
})

module.exports = User