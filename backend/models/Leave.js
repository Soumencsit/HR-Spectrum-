const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  
  uniqueId: { type: String, required: true }, // Removed the `unique: true`
  leaveType: { type: String, enum: ['vacation', 'sick', 'personal'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

const leaveModel = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

module.exports = leaveModel;
