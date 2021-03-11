const express = require("express");
const bcrypt = require("bcrypt");

const resetApp = express.Router();

const User = require("../models/User");

resetApp.post("/:resetPasswordToken", async (req, res) => {
  const { newPassword } = req.body;
  const { resetPasswordToken } = req.params;
  try {
    const userFind = await User.scope("passwordActive").findOne({
      where: {
        resetPasswordToken,
      },
      resPasswordExpires: { $gt: Date.now() },
    });
    if (!userFind) {
      return res
        .status(401)
        .json({ message: "Password reset token is invalid or has expired." });
    } else {
      userFind.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());
      userFind.resetPasswordToken = null;
      userFind.resetPasswordExpires = null;
      await userFind.save();
      res.status(200).json({ message: "Your password has been updated." });
    }
  } catch (error) {
    res.status(422).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = resetApp;
