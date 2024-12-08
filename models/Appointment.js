import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "confirmed" },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
