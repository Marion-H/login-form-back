require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./sequelize");

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome in your API");
});

async function main() {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    console.log("Database succesfully joined")
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Unable to join database", error.message);
  }
}

if (process.env.NODE_ENV !== "test") {
    main();
}