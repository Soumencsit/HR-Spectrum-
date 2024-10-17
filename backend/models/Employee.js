
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  jobRole: { type: String, required: true },
  salary: { type: Number, required: true },
  uniqueId: { type: String, required: true, unique: true }, // Add uniqueId field
  performanceHistory: [{ date: Date, review: String }],
  documents: [{ type: String }]  // Paths to uploaded files
});

// Ensure correct model creation
const employeeModel = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

module.exports = employeeModel;

