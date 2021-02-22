const express = require("express");

const userApp = express.Router();

const User = require("../models/User");
const regExIntCheck = require("../middlewares/regExIntCheck");
const uuidv4RegEx = require("../middlewares/regEx");

userApp.get("/", async (req, res) => {
  try {
    const resUsers = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(resUsers);
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

userApp.get("/:uuid", regExIntCheck(uuidv4RegEx), async (req, res) => {
  const { uuid } = req.params;
  try {
    const resUser = await User.findOne(
      {
        attributes: {
          exclude: ["password"],
        },
      },
      { where: { uuid } }
    );
    res.status(200).json(resUser);
  } catch (error) {
    res.status(422).json({
      status: "error",
      message: err.message,
    });
  }
});

userApp.post("/", async (req, res) => {
  const { name, password, email, mobile } = req.body;
  try {
    const userIsExist = await User.findOne({ where: { name } });
    if (userIsExist === null) {
      await User.create({ name, password, email, mobile });
      res.status(201).end();
    } else {
      res.status(422).json({
        status: "error",
        message: "this name is already taken",
      });
    }
  } catch (err) {
    res.status(422).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = userApp;
