const express = require("express");

const recoverApp = express.Router();

const User = require("../models/User");

const sgMail = require("@sendgrid/mail");
const { createPool } = require("mysql2/promise");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

recoverApp.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ where: { email } });
    if (findUser === null) {
      res.status(401).json({
        message:
          "The email address " +
          req.body.email +
          " is not associated with any account. Double-check your email address and try again.",
      });
    } else {
      //Generate and set password reset token
      findUser.generatePasswordReset();

      // Save the updated user object
      const userSave = await findUser.save();
      console.log(userSave)

      // send email
      // let link =
      //   "http://" +
      //   req.headers.host +
      //   "/api/reset/" +
      //   userSave.resetPasswordToken;

      // const mailOptions = {
      //   to: userSave.email,
      //   from: process.env.FROM_EMAIL,
      //   subject: "Password change request",
      //   text: `Hi ${userSave.username} \n 
      //  Please click on the following link ${link} to reset your password. \n\n 
      //  If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      // };

      // sgMail.send(mailOptions, (error, result) => {
      //   if (error) {
      //     return res.status(500).json({ message: error });
      //   } else {
      //     res.status(200).json({
      //       message: "A reset email has been sent to " + user.email + ".",
      //     });
      //   }
      // });
    }
  } catch (error) {
    res.status(422).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = recoverApp;
