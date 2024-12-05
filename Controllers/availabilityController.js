import Availability from "../models/Availability.js";
import User from "../models/User.js";

//To add Availability, prof only
const addAvailability = async (req, res) => {
  try {
    //check that the user is a prof
    if (req.user.role !== "professor") {
      return res
        .status(403)
        .json({ Message: "Only professprs can make a availabilty" });
    }

    const { date, slots } = req.body;

    //validate inputs
    if (!date || !slots || !Array.isArray(slots)) {
      return res
        .status(400)
        .json({ message: "Invalid input, Provid date and slots" });
    }

    //save avalable time to database
    const availability = new Availability({
      professor: req.user.id,
      date,
      slots,
    });

    await availability.save();
    res
      .status(201)
      .json({ message: "Availability added Successfully", availability });
  } catch (error) {
    res.status(500).json({
      message: "Error while adding availability",
      error: error.message,
    });
  }
};

//to get avalabale slote of a prof
const getAvailability = async (req, res) => {
  const { professorId } = req.params;

  try {
    const availabilty = await Availability.find({ professor: professorId });
    res.status(200).json({ availabilty });
  } catch (error) {
    res.status(500).json({
      message: "Error while finding availability",
      error: error.message,
    });
  }
};

export { addAvailability, getAvailability };
