const express = require("express")

const login = express.Router();

const User = require("../models/User");

login.post("/", async (req, res) => {
  const { user, password } = req.body;
  try {
    const userFind = await User.findOne({ where: { user } });
    res.status(200).json(userFind);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = login;
