import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  slots: [{ type: [String], required: true }],
});

const Availability = mongoose.model("Availability", AvailabilitySchema);
export default Availability;
