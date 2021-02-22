const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker/locale/fr");

const User = require("../models/User");

let expect = chai.expect;

const server = require("../index");

const sequelize = require("../sequelize");

chai.use(chaiHttp);

const userKey = ["uuid", "name", "email", "mobile", "createdAt", "updatedAt"];
const userGood = {
  uuid: faker.random.uuid(),
  name: faker.internet.userName(),
  password: `${faker.internet.password()}!`,
  email: faker.internet.email(),
  mobile: faker.phone.phoneNumber(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};

let user;

describe("USER", () => {
  before(async () => {
    await sequelize.sync({ force: true });
    user = await User.create(userGood);
  });

  describe("get all users", () => {
    it("should return an array of users", async () => {
      try {
        const res = await chai.request(server).get("/users");
        expect(res).have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body[0]).have.keys(userKey);
        expect(res.body).lengthOf(1);
      } catch (error) {
        throw error;
      }
    });
  });

  describe("get one user", () => {
    it("should return an object user with uuid", async () => {
      try {
        const res = await chai.request(server).get(`/users/${user.uuid}`);
        expect(res).have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(userKey);
      } catch (error) {
        throw error;
      }
    });

    it("failed to get one user with wrong format uuid", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${faker.random.number()}`);
        expect(res).have.status(404);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(["status", "message"]);
      } catch (error) {
        throw error;
      }
    });

    it("user not exist with good uuid", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/users/${faker.random.uuid()}`);
        expect(res).have.status(404);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(["status", "message"]);
      } catch (error) {
        throw error;
      }
    });
  });

  describe("post a new user", () => {
    it("should post a new user", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/users")
          .send({
            name: faker.internet.userName(),
            password: `${faker.internet.password()}!`,
            email: faker.internet.email(),
            mobile: faker.phone.phoneNumber(),
          });
        expect(res).have.status(201);
      } catch (error) {
        throw error;
      }
    });

    it("failed to create a new user with name already taken", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/users")
          .send({
            name: userGood.name,
            password: `${faker.internet.password()}!`,
            email: faker.internet.email(),
            mobile: faker.phone.phoneNumber(),
          });
        expect(res).have.status(422);
        expect(res.body).to.be.a("object");
        expect(res.body).have.keys(["status", "message"]);
        expect(res.body.message).to.have.string('this name is already taken')
      } catch (error) {
        throw error;
      }
    });

    it("failed to create a new user with wrong format password", async () => {
        try {
          const res = await chai
            .request(server)
            .post("/users")
            .send({
              name: faker.internet.userName(),
              password: faker.internet.password(),
              email: faker.internet.email(),
              mobile: faker.phone.phoneNumber(),
            });
          expect(res).have.status(422);
          expect(res.body).to.be.a("object");
          expect(res.body).have.keys(["status", "message"]);
          expect(res.body.message).to.have.string('password is not strong')
        } catch (error) {
          throw error;
        }
      });

      it("failed to create a new user with wrong format email", async () => {
        try {
          const res = await chai
            .request(server)
            .post("/users")
            .send({
              name: faker.internet.userName(),
              password: faker.internet.password(),
              email: faker.random.words(),
              mobile: faker.phone.phoneNumber(),
            });
          expect(res).have.status(422);
          expect(res.body).to.be.a("object");
          expect(res.body).have.keys(["status", "message"]);
          expect(res.body.message).to.have.string('the email format is not correct')
        } catch (error) {
          throw error;
        }
      });

      it("failed to create a new user with wrong format mobile", async () => {
        try {
          const res = await chai
            .request(server)
            .post("/users")
            .send({
              name: faker.internet.userName(),
              password: faker.internet.password(),
              email: faker.random.words(),
              mobile: faker.random.number(),
            });
          expect(res).have.status(422);
          expect(res.body).to.be.a("object");
          expect(res.body).have.keys(["status", "message"]);
          expect(res.body.message).to.have.string('wrong format mobile')
        } catch (error) {
          throw error;
        }
      });

      it("failed to create a new user with email already taken", async () => {
        try {
          const res = await chai
            .request(server)
            .post("/users")
            .send({
              name: faker.internet.userName(),
              password: faker.internet.password(),
              email: userGood.email,
              mobile: faker.random.number(),
            });
          expect(res).have.status(422);
          expect(res.body).to.be.a("object");
          expect(res.body).have.keys(["status", "message"]);
          expect(res.body.message).to.have.string('an account already exists with this email')
        } catch (error) {
          throw error;
        }
      });
  });
});
