const express = require("express");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

const loginApp = express.Router();

const User = require("../models/User");

loginApp.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userFind = await User.scope("passwordActive").findOne({
      where: { username },
    });
    if (userFind !== null) {
      const isValide = userFind.validatePassword(password);
      if (isValide) {
        const token = jwt.sign(
          {
            uuid: userFind.dataValues.uuid,
            username: userFind.dataValues.username,
          },
          SECRET,
          { expiresIn: "1h" }
        );
        const { uuid, name } = userFind;
        res.status(200).json({ token, uuid, name });
      } else {
        res.status(401).json({
          status: "error",
          message: "Password is not good",
        });
      }
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = loginApp;
