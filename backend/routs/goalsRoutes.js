const express = require("express");
const goalRouter = express.Router();
const UnifiedModel = require("../models/UnifiedModel");


// Fetch all goals for all employees
goalRouter.get("/all", async (req, res) => {
  try {
    // Fetch all employees and include only the goals array
    const employees = await UnifiedModel.find({}, { goals: 1, uniqueId: 1 });

    // Map through employees and their goals, including goal IDs and employee unique IDs
    const allGoals = employees.flatMap(employee => 
      employee.goals.map(goal => ({
        employeeId: employee.uniqueId, // Include the employee's unique ID
        goalId: goal._id,              // Include the goal's unique ID
        title: goal.title,
        description: goal.description,
        startDate: goal.startDate,
        endDate: goal.endDate,
        progress: goal.progress,
      }))
    );

    res.json(allGoals); // Respond with the list of all goals including their IDs and employee IDs
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add a new goal
goalRouter.post("/add/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const newGoal = req.body;

  try {
    // Check if the employee exists
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Add the goal to the employee's goals array
    employee.goals.push(newGoal);
    await employee.save();
    res.status(201).json({ message: "Goal added successfully", goal: newGoal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


goalRouter.post("/add/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const newGoal = req.body;

  try {
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.goals.push(newGoal);
    await employee.save();
    res.status(201).json(employee.goals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

goalRouter.get("/:uniqueId", async (req, res) => {
  try {
    const employee = await UnifiedModel.findOne({ uniqueId: req.params.uniqueId }, { goals: 1 });
    if (!employee) return res.status(404).json({ message: "Goals not found" });
    res.json(employee.goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = goalRouter;
