const express = require("express");
const {
  bookAppointment,
  getStudentAppointments,
  getProfessorAppointments,
  cancelAppointment,
} = require("../Controllers/appointmentController.js");
const authenticate = require("../middlewares/authMiddleware.js");

const router = express.Router();

//to book appointment
router.post("/book", authenticate, bookAppointment);

//to get professor appointment
router.get("/professor", authenticate, getProfessorAppointments);

//to cancle appointment from prof
router.delete("/cancel/:appointmentId", authenticate, cancelAppointment);

//get student appointment
router.get("/my-appointments", authenticate, getStudentAppointments);

module.exports = router;
