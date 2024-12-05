import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import {
  addAvailability,
  getAvailability,
} from "../Controllers/availabilityController.js";

const router = express.Router();

//to add avaliabilty, this if for prof only
router.post("/", authenticate, addAvailability);

//to get avaliabilty of a specific prof
router.get("/:professorId", authenticate, getAvailability);

export default router;
