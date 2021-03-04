const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const faker = require("faker/locale/fr");

const User = require("../models/User");

const { SECRET } = process.env;

let expect = chai.expect;

const server = require("../index");

const sequelize = require("../sequelize");

chai.use(chaiHttp);

const userKey = ["uuid", "token", "name"];

const userProfil = {
  uuid: faker.random.uuid(),
  name: faker.internet.userName(),
  password: `${faker.internet.password()}!`,
  email: faker.internet.email(),
  mobile: faker.phone.phoneNumber(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};

describe("LOGIN", () => {
  before(async () => {
    await sequelize.sync({ force: true });

    newUser = await User.create(userProfil);
  });

  describe("post an user and receive a token", () => {
    it("should return an object with uuid and token", async () => {
      try {
        const { name, password } = userProfil;
        const res = await chai
          .request(server)
          .post("/login")
          .send({ name, password });
        expect(res).have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(userKey);
      } catch (error) {
        throw error;
      }
    });

    it("failed to generate token with wrong name", async () => {
      try {
        const { password } = userProfil;
        const res = await chai.request(server).post("/login").send({
          name: faker.internet.userName(),
          password,
        });
        expect(res).have.status(404);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(["status", "message"]);
        expect(res.body.message).to.have.string("User not found");
      } catch (err) {
        throw err;
      }
    });

    it("failed to generate token with wrong password", async () => {
      try {
        const { name } = userProfil;
        const res = await chai
          .request(server)
          .post("/login")
          .send({
            name,
            password: `${faker.internet.password()}!`,
          });
        expect(res).have.status(401);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(["status", "message"]);
        expect(res.body.message).to.have.string("Password is not good");
      } catch (err) {
        throw err;
      }
    });
  });
});
