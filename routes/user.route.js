const express = require("express")

const appUser = express.Router();

const User = require("../models/User");

appUser.get("/", async (req, res) => {
  try {
    const resUsers = await User.findAll();
    res.status(200).json(resUsers);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = appUser;
