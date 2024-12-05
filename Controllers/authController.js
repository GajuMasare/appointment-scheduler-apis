import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

//To register new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User resgistered Successfully!", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while registering user", error: error.message });
  }
};

//To login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Incorrect Password" });

    if (!SECRET_KEY) {
      return res.status(500).json({ message: "JWT_SECRET not defined" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY, // Ensure this is passed correctly
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged in successfully!", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while logging in", error: error.message });
  }
};

export { registerUser, loginUser };
