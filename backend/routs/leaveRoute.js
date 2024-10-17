const express = require("express");
const Leave = require("../models/Leave");
const leaveRouter = express.Router();

// Apply for leave
leaveRouter.post("/apply", async (req, res) => {
  const { uniqueId, leaveType, startDate, endDate } = req.body;
  const leave = new Leave({ uniqueId, leaveType, startDate, endDate });
  try {
    await leave.save();
    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Update leave status using uniqueId
leaveRouter.put("/update/:uniqueId", async (req, res) => {
  const uniqueId = req.params.uniqueId;
  const { status } = req.body;

  try {
    const leave = await Leave.findOne({ uniqueId });
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    leave.status = status;
    await leave.save();
    res.status(200).json({ message: "Leave status updated", leave });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete leave by uniqueId
leaveRouter.delete("/delete/:uniqueId", async (req, res) => {
  const uniqueId = req.params.uniqueId;
  console.log(uniqueId);

  try {
    const leave = await Leave.findOneAndDelete({ uniqueId });
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

leaveRouter.get("/pending", async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "pending" });
    if (leaves.length === 0) {
      return res.status(404).json({ message: "No pending leaves found" });
    }
    res.status(200).json(leaves); // You can return just leaves instead of wrapping in another object
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

leaveRouter.get("/approved", async (req, res) => {
  try {
    const approvedLeaves = await Leave.find({ status: "approved" });
    if (approvedLeaves.length === 0) {
      return res.status(404).json({ message: "No approved leaves found" });
    }
    res.status(200).json(approvedLeaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

leaveRouter.get("/:uniqueId", async (req, res) => {
  res.json({ massage: "hello" });

  const uniqueId = req.params.uniqueId;

  try {
    const leave = await Leave.findOne({ uniqueId });
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json({ leave });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all approved leave requests

module.exports = leaveRouter;
