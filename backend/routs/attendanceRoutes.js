const express = require("express");
const geoip = require("geoip-lite");
const Attendance = require("../models/Attendance");
const attendanceRouter = express.Router();

// Define geofence (office location)
const OFFICE_LOCATION = {
  latitude: 27.21606,
  longitude: 75.7,
};

// Helper to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // km
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

attendanceRouter.post("/checkin", async (req, res) => {
  const { uniqueId } = req.body;

  const ip = "14.195.19.210";
  const location = geoip.lookup(ip);

  if (!location || !location.ll) {
    return res
      .status(400)
      .json({ error: "Could not determine location from IP" });
  }

  const [latitude, longitude] = location.ll;
  const distance = getDistance(
    OFFICE_LOCATION.latitude,
    OFFICE_LOCATION.longitude,
    latitude,
    longitude
  );
  const isWithinGeofence = distance < 1;

  const attendanceRecord = new Attendance({
    uniqueId,
    date: new Date(),
    checkInTime: new Date(),
    location: { latitude, longitude },
    isWithinGeofence,
  });

  try {
    await attendanceRecord.save();
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

attendanceRouter.post("/checkout", async (req, res) => {
  const { uniqueId } = req.body;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const attendance = await Attendance.findOne({
      uniqueId,
      checkOutTime: null, // Find the latest check-in that has not been checked out yet
      date: { $gte: startOfDay, $lt: endOfDay }, // For today
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No open check-in found for today" });
    }

    const checkOutTime = new Date();
    const totalHoursWorked =
      (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);
    const overtimeHours = totalHoursWorked > 8 ? totalHoursWorked - 8 : 0;

    attendance.checkOutTime = checkOutTime;
    attendance.overtimeHours = overtimeHours;

    await attendance.save();
    res
      .status(200)
      .json({ message: "Checked out successfully", overtimeHours });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = attendanceRouter;
