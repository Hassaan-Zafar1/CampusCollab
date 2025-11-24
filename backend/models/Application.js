const mongoose = require('mongoose');

   const applicationSchema = new mongoose.Schema({
     student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
     coverLetter: { type: String, required: true },
     documents: [{ type: String }], // URLs to uploaded files
     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
     appliedDate: { type: Date, default: Date.now },
     reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     reviewDate: { type: Date }
   }, { timestamps: true });

   module.exports = mongoose.model('Application', applicationSchema);