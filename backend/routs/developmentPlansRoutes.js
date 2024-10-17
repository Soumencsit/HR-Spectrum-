const express = require("express");
const developmentRouter = express.Router();
const DevelopmentPlan = require("../models/DevelopmentPlan");

developmentRouter.get("/kk", (req, res) => {
  console.log("Hello jii");
});

// Fetch all development plans
developmentRouter.get("/all", async (req, res) => {
  try {
    const plans = await DevelopmentPlan.find();

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching development plans" });
  }
});

// Fetch all development plans for a specific employee
developmentRouter.get("/:uniqueId", async (req, res) => {
  console.log("hello ji");

  try {
    const plans = await DevelopmentPlan.find({ uniqueId: req.params.uniqueId });
    res.json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

// Add a new development plan
developmentRouter.post("/add", async (req, res) => {
  const developmentPlan = new DevelopmentPlan(req.body);
  try {
    const newPlan = await developmentPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    console.error("Error adding new plan:", err); // Log the error for debugging
    res.status(400).json({ message: err.message });
  }
});

module.exports = developmentRouter;
