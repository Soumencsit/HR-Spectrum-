// routes/employeeRoutes.js
const express = require('express');
const multer = require('multer');
const Employee = require('../models/Employee');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Add a new employee
router.post('/add', async (req, res) => {
  const employee = new Employee(req.body);
  try {
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Upload employee documents
router.post('/upload/:id', upload.single('document'), async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employee = await Employee.findById(employeeId);
    employee.documents.push(req.file.path);  // Save file path to employee record
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
