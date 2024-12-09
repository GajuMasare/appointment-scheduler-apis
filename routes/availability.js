const express = require("express");
const authenticate = require("../middlewares/authMiddleware.js");
const {
  addAvailability,
  getAvailability,
} = require("../Controllers/availabilityController.js");

const router = express.Router();

//to add avaliabilty, this if for prof only
router.post("/add", authenticate, addAvailability);

//to get avaliabilty of a specific prof
router.get("/:professorId", authenticate, getAvailability);

module.exports = router;
