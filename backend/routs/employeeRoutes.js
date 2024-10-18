const express = require("express");
const router = express.Router();
const UnifiedModel = require("../models/UnifiedModel");

// Add a new employee
router.get("/count", async (req, res) => {
  try {
    const count = await UnifiedModel.countDocuments(); // Count all documents in the collection
    res.json({ count }); // Send the count as JSON response
  } catch (error) {
    res.status(500).json({ error: "Error fetching employee count" });
  }
});
// Add a new employee
router.post("/add", async (req, res) => {
  const { uniqueId, name, contact, jobRole, salary } = req.body;

  try {
    const existingEmployee = await UnifiedModel.findOne({ uniqueId });
    if (existingEmployee) {
      return res.status(400).json({ error: "Unique ID already exists" });
    }

    const employee = new UnifiedModel({ uniqueId, name, contact, jobRole, salary });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// List all employees
router.get("/list", async (req, res) => {
  try {
    const employees = await UnifiedModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// Delete employee by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const employee = await UnifiedModel.findOneAndDelete({ uniqueId: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting employee" });
  }
});

module.exports = router;
