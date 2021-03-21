require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./sequelize");

const user = require("./routes/user.route");
const login = require("./routes/login.route");
const recover = require("./routes/recover.route");
const reset = require("./routes/reset.route");

const app = express();
const PORT = process.env.PORT;

const env = process.env.NODE_ENV;

const whitelist = process.env.CLIENT_URLS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        whitelist.indexOf(origin) !== -1 ||
        (env !== "production" && !origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/login", login);
app.use("/users", user);
app.use("/recover", recover);
app.use("/reset", reset);

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

module.exports = app;
