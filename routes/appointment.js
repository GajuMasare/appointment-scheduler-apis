import express from "express";
import {
  bookAppointment,
  getStudentAppointments,
  getProfessorAppointments,
  cancelAppointment,
} from "../Controllers/appointmentController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

//to book appointment
router.post("/book", authenticate, bookAppointment);

//to get professor appointment
router.get("/professor", authenticate, getProfessorAppointments);

//to cancle appointment from prof
router.delete("/cancel/:appointmentId", authenticate, cancelAppointment);

//get student appointment
router.get("/my-appointments", authenticate, getStudentAppointments);

export default router;
