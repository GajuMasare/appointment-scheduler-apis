const request = require("supertest");
const app = require("../server.js");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("End-to-End User Flow", () => {
  let studentA1Token, studentA2Token, professorP1Token;
  let timeSlotT1, timeSlotT2;
  let professorP1Id;
  let appointmentA1, appointmentA2;

  it("Student A1 authenticates to access the system.", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "studentA1@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    studentA1Token = response.body.token;
  });

  it("Professor P1 authenticates to access the system", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "professorP1@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    professorP1Token = response.body.token;
  });

  it("Professor P1 specifies which time slots he is free for appointments", async () => {
    const response = await request(app)
      .post("/api/availability/add")
      .set("Authorization", `Bearer ${professorP1Token}`)
      .send({
        availableSlots: [
          { date: "2024-12-10", time: "10:00" },
          { date: "2024-12-10", time: "14:00" },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("availability");
    timeSlotT1 = response.body.availability.availableSlots[0];
    timeSlotT2 = response.body.availability.availableSlots[1];
    professorP1Id = response.body.availability.professorId;
  });

  it("Student A1 views available time slots for Professor P1", async () => {
    const response = await request(app)
      .get(`/api/availability/${professorP1Id}`)
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("availability");
    expect(response.body.availability.availableSlots).toContainEqual(
      expect.objectContaining({ _id: timeSlotT1._id })
    );
  });

  it("Student A1 books an appointment with Professor P1 for time T1", async () => {
    const response = await request(app)
      .post("/api/appointments/book")
      .set("Authorization", `Bearer ${studentA1Token}`)
      .send({
        professorId: professorP1Id,
        date: timeSlotT1.date,
        time: timeSlotT1.time,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("appointment");
    appointmentA1 = response.body.appointment;
  });

  it("Student A2 authenticates to access the system", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "studentA2@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    studentA2Token = response.body.token;
  });

  it("Student A2 books an appointment with Professor P1 for time T2", async () => {
    const response = await request(app)
      .post("/api/appointments/book")
      .set("Authorization", `Bearer ${studentA2Token}`)
      .send({
        professorId: professorP1Id,
        date: timeSlotT2.date,
        time: timeSlotT2.time,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("appointment");
    appointmentA2 = response.body.appointment;
  });

  it("Professor P1 cancels the appointment with Student A1", async () => {
    const response = await request(app)
      .delete(`/api/appointments/cancel/${appointmentA1._id}`)
      .set("Authorization", `Bearer ${professorP1Token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Appointment canceled successfully by the professor"
    );
  });

  it("Student A1 checks their appointments and realizes they do not have any pending appointments", async () => {
    const response = await request(app)
      .get("/api/appointments/my-appointments")
      .set("Authorization", `Bearer ${studentA1Token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("appointments");

    const thatAppointmentExists = response.body.appointments.some(
      (appointment) => appointment._id === appointmentA1._id
    );

    expect(thatAppointmentExists).toBe(false);
  });
});
