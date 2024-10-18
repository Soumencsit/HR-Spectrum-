const express = require("express");
const leaveRouter = express.Router();
const UnifiedModel = require("../models/UnifiedModel");

// Apply for leave
leaveRouter.post("/apply/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const newLeave = req.body;

  try {
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Set leave information
    employee.leave = newLeave; // Directly assign the leave object
    await employee.save();
    res.status(201).json({ message: "Leave applied successfully", leave: employee.leave });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all pending leaves
leaveRouter.get("/pending", async (req, res) => {
  try {
    const employees = await UnifiedModel.find({ "leave.status": "pending" }).select("uniqueId name leave");
    if (employees.length === 0) return res.status(404).json({ message: "No pending leaves found" });

    const pendingLeaves = employees.map(emp => ({
      uniqueId: emp.uniqueId,
      leaveType: emp.leave.leaveType,  // Make sure to map the leaveType
      startDate: emp.leave.startDate,
      endDate: emp.leave.endDate
    }));

    res.status(200).json(pendingLeaves); // Send just the array of pending leaves
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Check if an employee exists by uniqueId
leaveRouter.get("/check/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  try {
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee exists" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch the leave request (pending or approved)


// Update leave status
leaveRouter.put("/update/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const { status } = req.body;

  try {
    const employee = await UnifiedModel.findOne({ uniqueId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    if (!employee.leave) return res.status(404).json({ message: "Leave not found" });

    employee.leave.status = status; // Update status directly
    await employee.save();
    res.json({ message: "Leave status updated", leave: employee.leave });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// List all approved leaves
leaveRouter.get("/approved", async (req, res) => {
  try {
    const employees = await UnifiedModel.find({ "leave.status": "approved" }).select("uniqueId name leave");
    if (employees.length === 0) return res.status(404).json({ message: "No approved leaves found" });

    const approvedLeaves = employees.map(emp => ({
      uniqueId: emp.uniqueId,
      leaveType: emp.leave.leaveType,  // Make sure to map the leaveType
      startDate: emp.leave.startDate,
      endDate: emp.leave.endDate
      
    }));

    res.status(200).json({ approvedLeaves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = leaveRouter;
