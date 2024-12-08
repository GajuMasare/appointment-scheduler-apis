import express from "express";
import {
  bookAppointment,
  getStudentAppointments,
  getProfessorAppointments,
} from "../Controllers/appointmentController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

//to book appointment
router.post("/book", authenticate, bookAppointment);

//get student appointment
router.get("/student", authenticate, getStudentAppointments);

//to get professor appointment
router.get("/professor", authenticate, getProfessorAppointments);

export default router;
