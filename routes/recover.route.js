const express = require("express");

const recoverApp = express.Router();

const env = process.env.NODE_ENV;

const whitelist = process.env.CLIENT_URLS;

const User = require("../models/User");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

recoverApp.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ where: { email } });
    if (findUser === null) {
      res.status(401).json({
        message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`,
      });
    } else {
      //Generate and set password reset token
      findUser.generatePasswordReset();

      // Save the updated user object
      const userSave = await findUser.save();

      let link;
      if (env === "production") {
        link = `${whitelist}/reset/${serSave.resetPasswordToken}`;
      } else {
        link = `http://localhost:3000/reset/${userSave.resetPasswordToken}`;
      }
      
      const mailOptions = {
        to: userSave.email,
        from: process.env.FROM_EMAIL,
        subject: "Password change request",
        text: `Hi ${userSave.username} \n 
        Please click on the following link ${link} to reset your password. \n\n 
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      
      // send email
      sgMail.send(mailOptions, (error, result) => {
        if (error) {
          return res.status(500).json({ message: error });
        } else {
          res.status(200).json({
            message: `A reset email has been sent to ${userSave.email}.`,
          });
        }
      });
    }
  } catch (error) {
    res.status(422).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = recoverApp;
