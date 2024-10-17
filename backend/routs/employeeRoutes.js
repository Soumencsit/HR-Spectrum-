// routes/employeeRoutes.js
const express = require("express");
const multer = require("multer");
const Employee = require("../models/Employee");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Delete employee by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const uniqueId = req.params;

    await Employee.findByIdAndDelete(uniqueId.id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting employee" });
  }
});

// Add a new employee
router.post("/add", async (req, res) => {
  const { uniqueId, name, contact, jobRole, salary } = req.body;

  // Check if uniqueId already exists
  const existingEmployee = await Employee.findOne({ uniqueId });
  if (existingEmployee) {
    return res.status(400).json({ error: "Unique ID already exists" });
  }

  // Create a new employee with the provided unique ID
  const employee = new Employee({
    uniqueId,
    name,
    contact,
    jobRole,
    salary,
  });

  try {
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Get employee count
router.get("/count", async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error counting employees" });
  }
});

// Upload employee documents
router.post("/upload/:id", upload.single("document"), async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.documents.push(req.file.path);
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// List all employees
router.get("/list", async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
});

module.exports = router;
