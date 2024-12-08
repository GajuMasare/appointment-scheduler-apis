import dotenv from "dotenv";
import express from "express";
import connectToMongoDB from "./db/connetToMongoDB.js";
import authRoutes from "./routes/auth.js";
import availabilityRoutes from "./routes/availability.js";
import appointmentRoutes from "./routes/appointment.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.post("/test", async (req, res) => {
//   try {
//     const user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       role: req.body.role,
//     });

//     await user.save();
//     res.status(201).json({ message: "User created", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server running on http://localhost:${PORT}/`);
});
