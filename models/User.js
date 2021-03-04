const Sequelize = require("sequelize");
const SequelizeInstance = require("../sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

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
    resetPasswordToken: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      passwordActive: {},
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

User.prototype.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};


module.exports = User;
