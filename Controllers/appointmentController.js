import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";

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
  try {
    const userId = req.user.id;

    //make sure user is student
    const student = await User.findById(userId);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access restricted to students" });
    }

    //find appontments of that student
    const appointments = await Appointment.find({ studentId: userId });

    res.status(200).json({ appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
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

//prof can cancle a appontment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    //find that appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    //check if the user is the prof for in this appointment
    if (appointment.professorId.toString() !== userId) {
      return res.status(403).json({
        message:
          "You are not a professor, You are not authorized to cancel this appointment",
      });
    }

    //delete the appointment
    await appointment.deleteOne();

    //resort the canceled slot into prof's availabilty section
    const availability = await Availability.findOne({ professorId: userId });
    if (availability) {
      availability.availableSlots.push({
        date: appointment.date,
        time: appointment.time,
      });
    }

    //sorting slots again so it looks in assending order (not needed just doing so it looks good in ui)
    availability.availableSlots.sort(
      (a, b) =>
        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );
    await availability.save();

    res
      .status(200)
      .json({ message: "Appointment canceled successfully by the professor" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

export {
  bookAppointment,
  getStudentAppointments,
  getProfessorAppointments,
  cancelAppointment,
};
