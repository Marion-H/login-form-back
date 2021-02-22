const Sequelize = require("sequelize");
const SequelizeInstance = require("../sequelize");
const bcrypt = require("bcrypt")

const User = SequelizeInstance.define(
  "User",
  {
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    hooks: {
      beforeCreate: (user) => {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        }
      },
    },
  }
);

User.prototype.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;
