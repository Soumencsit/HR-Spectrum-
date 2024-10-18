const express = require("express");
const developmentRouter = express.Router();
const UnifiedModel = require("../models/UnifiedModel");


// Fetch all development plans for all employees
developmentRouter.get("/all", async (req, res) => {
  try {
    const employees = await UnifiedModel.find({}, { developmentPlans: 1, uniqueId: 1 });

    // Extract plans and map to include employee ID and relevant details
    const allPlans = employees.flatMap(employee => 
      employee.developmentPlans.map(plan => ({
        employeeId: employee.uniqueId, // Include the employee's unique ID
        skillsToDevelop: plan.skillsToDevelop,
        resources: plan.resources,
        timeline: plan.timeline,
      }))
    );

    res.json(allPlans); // Respond with the list of all development plans
  } catch (error) {
    res.status(500).json({ message: "Error fetching development plans" });
  }
});



// Fetch development plans for a specific employee
developmentRouter.get("/:uniqueId", async (req, res) => {
  try {
    const plans = await UnifiedModel.findOne({ uniqueId: req.params.uniqueId }, { developmentPlans: 1 });
    if (!plans) return res.status(404).json({ message: "Development plans not found" });
    res.json(plans.developmentPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new development plan
developmentRouter.post("/add", async (req, res) => {
  const { uniqueId } = req.body;
  const newPlan = req.body;

  try {
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.developmentPlans.push(newPlan);
    await employee.save();
    res.status(201).json(employee.developmentPlans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = developmentRouter;
