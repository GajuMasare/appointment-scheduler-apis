import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";

//To book appointment (only student can do this)
const bookAppointment = async (req, res) => {
  const { professorId, date, time } = req.body;

  //check that only student can do this
  if (req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "denied. only student can book appointment" });
  }

  try {
    //cheack if slot is available
    const availability = await Availability.findOne({ professorId });
    if (!availability) {
      return res
        .status(404)
        .json({ message: "No available slot from professor" });
    }

    const slotIndex = availability.availableSlots.findIndex(
      (slot) => slot.date === date && slot.time === time
    );

    if (slotIndex === -1) {
      return res
        .status(400)
        .json({ message: "Selected slot is not available" });
    }

    //to book slot
    const appointment = new Appointment({
      professorId,
      studentId: req.user.id,
      date,
      time,
    });

    await appointment.save();

    //remove slot from availability
    availability.availableSlots.splice(slotIndex, 1);
    await availability.save();

    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({
      message: "error while booking appointment",
      error: error.message,
    });
  }
};

//get thier specific appointment for a student
const getStudentAppointments = async (req, res) => {
  if (req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "denied, only student can view thier appointments" });
  }

  try {
    const appointments = await Appointment.find({
      studentId: req.user.id,
    }).populate("professorId", "name email");
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching appointments",
      error: error.message,
    });
  }
};

// get appointment with stduent for specific prof
const getProfessorAppointments = async (req, res) => {
  if (req.user.role !== "professor") {
    return res
      .status(403)
      .json({ message: "denied, Only professors can view thier appointments" });
  }

  try {
    const appointments = await Appointment.find({
      professorId: req.user.id,
    }).populate("studentId", "name email");
    res.status(200).json({ appointments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

export { bookAppointment, getStudentAppointments, getProfessorAppointments };
