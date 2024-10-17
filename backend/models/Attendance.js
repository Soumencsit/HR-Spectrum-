

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  date: { type: Date, required: true },
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  isWithinGeofence: { type: Boolean },
  overtimeHours: { type: Number, default: 0 },
});

// Ensure unique combination of uniqueId and checkInTime for multiple check-ins
attendanceSchema.index({ uniqueId: 1, checkInTime: 1 }, { unique: true });

const Attendance = mongoose.model.Attendance|| mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance; 
