const express = require("express");

const userApp = express.Router();

const User = require("../models/User");
const regExIntCheck = require("../middlewares/regExIntCheck");
const {
  uuidv4RegEx,
  mobileRegEx,
  strongRegExPwd,
} = require("../middlewares/regEx");

userApp.get("/", async (req, res) => {
  try {
    const resUsers = await User.findAll();
    res.status(200).json(resUsers);
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

userApp.get("/:uuid", regExIntCheck(uuidv4RegEx), async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const resUser = await User.findOne({ where: { uuid } });
    if (resUser !== null) {
      res.status(200).json(resUser);
    } else {
      res.status(404).json({
        status: "error",
        message: "User uuid or key not found",
      });
    }
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
    const emailIsExist = await User.findOne({ where: { email } });
    console.log(emailIsExist);
    if (userIsExist === null && emailIsExist === null) {
      const checkRegExMobile = mobileRegEx.test(mobile);
      const checkRegExPwdStrong = strongRegExPwd.test(password);
      if (checkRegExMobile && checkRegExPwdStrong) {
        await User.create({ name, password, email, mobile });
        res.status(201).end();
      } else {
        if (!checkRegExMobile) {
          res.status(422).json({
            status: "error",
            message: "wrong format mobile",
          });
        } else {
          res.status(422).json({
            status: "error",
            message: "password is not strong",
          });
        }
      }
    } else {
      if (userIsExist !== null) {
        res.status(422).json({
          status: "error",
          message: "this email is already taken",
        });
      } else {
        res.status(422).json({
          status: "error",
          message: "an account already exists with this email",
        });
      }
    }
  } catch (err) {
    res.status(422).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = userApp;
