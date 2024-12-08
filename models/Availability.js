import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  availableSlots: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
});

const Availability = mongoose.model("Availability", AvailabilitySchema);
export default Availability;
