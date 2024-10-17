// routes/goals.js
const express = require("express");
const goalRouter = express.Router();
const Goal = require("../models/Goal");

goalRouter.get("/all", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Other existing routes...

// Update progress for a specific goal by unique ID
goalRouter.put("/update/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { progress } = req.body;

    // Find the goal by uniqueId
    const goal = await Goal.findOne({ uniqueId });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update progress
    goal.progress = progress;
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = goalRouter;

// Fetch all goals for a specific employee
goalRouter.get("/:uniqueId", async (req, res) => {
  try {
    const goals = await Goal.find({ uniqueId: req.params.uniqueId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new goal
goalRouter.post("/add", async (req, res) => {
  const goal = new Goal(req.body);
  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = goalRouter;
