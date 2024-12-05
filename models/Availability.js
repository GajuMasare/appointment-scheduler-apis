import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slots: [{ type: Date, required: true }],
});

const Availability = mongoose.model("Availability", AvailabilitySchema);
export default Availability;
