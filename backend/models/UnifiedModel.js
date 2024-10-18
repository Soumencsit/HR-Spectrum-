


const mongoose = require('mongoose');

// Define the unified schema
const unifiedSchema = new mongoose.Schema({
  // Employee Information
  uniqueId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  jobRole: { type: String, required: true },
  salary: { type: Number, required: true },

  // Performance and Documents
  performanceHistory: [{ date: Date, review: String }],
  documents: [{ type: String }], // Paths to uploaded files

  // Attendance Information
  attendance: [{
    date: { type: Date, required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    isWithinGeofence: { type: Boolean },
    overtimeHours: { type: Number, default: 0 },
  }],

  // Development Plan
  developmentPlans: [{
    skillsToDevelop: { type: String, required: true },
    resources: { type: String, required: true },
    timeline: { type: String, required: true },
  }],

  // Goals
  goals: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    progress: { type: Number, default: 0 },
  }],

  // Leave Information (Optional)
  leave: {
    leaveType: { type: String, enum: ['vacation', 'sick', 'personal'] },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
  },

  // Reviews
  reviews: [{
    reviewPeriod: { type: String, required: true },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },
  }],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Ensure correct model creation or reuse
const UnifiedModel = mongoose.models.Unified || mongoose.model("Unified", unifiedSchema);

module.exports = UnifiedModel;
