const express = require("express");

const userApp = express.Router();

const User = require("../models/User");
const regExIntCheck = require("../middlewares/regExIntCheck");
const {
  uuidv4RegEx,
  mobileRegEx,
  strongRegExPwd,
  emailRegEx,
} = require("../middlewares/regEx");

userApp.get("/", async (req, res) => {
  try {
    const resUsers = await User.findAll();
    res.status(200).json(resUsers);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
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
      message: error.message,
    });
  }
});

userApp.post("/", async (req, res) => {
  const { username, password, email, mobile } = req.body;
  try {
    const userIsExist = await User.findOne({ where: { username } });
    const emailIsExist = await User.findOne({ where: { email } });
    if (userIsExist === null && emailIsExist === null) {
      const checkRegExMobile = mobileRegEx.test(mobile);
      const checkRegExPwdStrong = strongRegExPwd.test(password);
      const checkRegExEmail = emailRegEx.test(email.toLowerCase());
      if (checkRegExMobile && checkRegExPwdStrong && checkRegExEmail) {
        await User.create({ username, password, email, mobile });
        res.status(201).end();
      } else {
        if (!checkRegExMobile) {
          res.status(422).json({
            status: "error",
            message: "wrong format mobile",
          });
        } else {
          if (!checkRegExEmail) {
            res.status(422).json({
              status: "error",
              message: "the email format is not correct",
            });
          } else {
            res.status(422).json({
              status: "error",
              message: "password is not strong",
            });
          }
        }
      }
    } else {
      if (userIsExist !== null) {
        res.status(422).json({
          status: "error",
          message: "this username is already taken",
        });
      } else {
        res.status(422).json({
          status: "error",
          message: "an account already exists with this email",
        });
      }
    }
  } catch (error) {
    res.status(422).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = userApp;
