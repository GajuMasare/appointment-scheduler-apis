const request = require("supertest");
const app = require("../server.js");
const mongoose = require("mongoose");

jest.spyOn(console, "log").mockImplementation(() => {});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/auth/register", () => {
  it("should register a new student", async () => {
    const studentData = {
      name: "test student",
      email: "teststudent1@gmail.com",
      password: "password123",
      role: "student",
    };

    const responce = await request(app)
      .post("/api/auth/register")
      .send(studentData);

    expect(responce.status).toBe(201);
    expect(responce.body).toHaveProperty(
      "message",
      "User resgistered Successfully!"
    );
    expect(responce.body.user).toMatchObject({
      name: studentData.name,
      email: studentData.email,
      role: studentData.role,
    });
  });
});
