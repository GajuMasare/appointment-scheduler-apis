const dotenv = require("dotenv");
const express = require("express");
const connectToMongoDB = require("./db/connetToMongoDB.js");
const authRoutes = require("./routes/auth.js");
const availabilityRoutes = require("./routes/availability.js");
const appointmentRoutes = require("./routes/appointment.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on http://localhost:${PORT}/`);
  });
}

module.exports = app;
