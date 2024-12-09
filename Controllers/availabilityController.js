const Availability = require("../models/Availability.js");
const User = require("../models/User.js");

//To add Availability, prof only
const addAvailability = async (req, res) => {
  const { availableSlots } = req.body;

  //only prof can add avaialbe time
  if (req.user.role !== "professor") {
    return res
      .status(403)
      .json({ message: "Denied. Only prof can add availability" });
  }

  try {
    let availability = await Availability.findOne({ professorId: req.user.id });

    if (availability) {
      //add this new slot to prev one since it was created before too
      availability.availableSlots = [
        ...availability.availableSlots,
        ...availableSlots,
      ];
    } else {
      availability = new Availability({
        professorId: req.user.id,
        availableSlots,
      });
    }

    await availability.save();
    res
      .status(200)
      .json({ message: "Availability added successfully!", availability });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding availability", error: error.message });
  }
};

//to get avalabale slote of a prof
const getAvailability = async (req, res) => {
  const { professorId } = req.params;

  try {
    const availability = await Availability.findOne({ professorId }).populate(
      "professorId",
      "name email"
    );

    if (!availability) {
      return res
        .status(404)
        .json({ message: "No availability found for this professor" });
    }

    res.status(200).json({ availability });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching availability", error: error.message });
  }
};

module.exports = { addAvailability, getAvailability };
