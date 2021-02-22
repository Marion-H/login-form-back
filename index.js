require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./sequelize");

const user = require("./routes/user.route")
const login = require("./routes/login.route")

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use("/login", login)
app.use("/users", user)

app.get("/", (req, res) => {
  res.status(200).send("Welcome in your API");
});

async function main() {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    console.log("Database succesfully joined");
    app.listen(PORT, (error) => {
      if (error) throw new Error(error.message);
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Unable to join database", error.message);
  }
}

if (process.env.NODE_ENV !== "test") {
  main();
}


module.exports = app