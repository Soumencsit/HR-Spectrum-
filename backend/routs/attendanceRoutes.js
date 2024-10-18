const express = require("express");
const geoip = require("geoip-lite");
const UnifiedModel = require("../models/UnifiedModel");
const attendanceRouter = express.Router();

// Define geofence (office location)
const OFFICE_LOCATION = {
  latitude: 27.21606,
  longitude: 75.7,
};

// Helper to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check-in route
attendanceRouter.post("/checkin", async (req, res) => {
  const { uniqueId } = req.body;

  // Mock IP (you might replace this with `req.ip`)
  const ip = "14.195.19.210";
  const location = geoip.lookup(ip);

  if (!location || !location.ll) {
    return res.status(400).json({ error: "Could not determine location from IP" });
  }

  const [latitude, longitude] = location.ll;
  const distance = getDistance(
    OFFICE_LOCATION.latitude,
    OFFICE_LOCATION.longitude,
    latitude,
    longitude
  );
  const isWithinGeofence = distance < 1;

  // Find employee by uniqueId
  const employee = await UnifiedModel.findOne({ uniqueId });

  if (!employee) {
    return res.status(404).json({ error: "Invalid Employee ID" }); // Updated error message
  }

  // Add attendance entry to employee's attendance array
  const attendanceRecord = {
    date: new Date(),
    checkInTime: new Date(),
    location: { latitude, longitude },
    isWithinGeofence,
  };

  try {
    employee.attendance.push(attendanceRecord);
    await employee.save();

    res.status(201).json({
      message: isWithinGeofence
        ? "Checked in within geofence"
        : "Outside geofence",
      attendance: attendanceRecord,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Checkout route
attendanceRouter.post("/checkout", async (req, res) => {
  const { uniqueId } = req.body;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Find the employee by uniqueId
    const employee = await UnifiedModel.findOne({ uniqueId });

    if (!employee) {
      return res.status(404).json({ error: "Invalid Employee ID" }); // Updated error message
    }

    // Find today's check-in that has no check-out time yet
    const attendance = employee.attendance.find(
      (record) =>
        record.date >= startOfDay &&
        record.date < endOfDay &&
        !record.checkOutTime
    );

    if (!attendance) {
      return res.status(404).json({ error: "No open check-in found for today" });
    }

    // Calculate check-out time and overtime hours
    const checkOutTime = new Date();
    const totalHoursWorked =
      (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60); // Convert milliseconds to hours
    const overtimeHours = totalHoursWorked > 8 ? totalHoursWorked - 8 : 0;

    // Update the attendance entry with checkout information
    attendance.checkOutTime = checkOutTime;
    attendance.overtimeHours = overtimeHours;

    // Save the updated employee record
    await employee.save();

    res
      .status(200)
      .json({ message: "Checked out successfully", overtimeHours });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = attendanceRouter;
