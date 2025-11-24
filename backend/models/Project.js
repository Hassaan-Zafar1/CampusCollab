const mongoose = require('mongoose');

   const projectSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, required: true },
     supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     department: { type: String, required: true },
     category: { type: String, required: true },
     technologies: [{ type: String }],
     requiredSkills: [{ type: String }],
     status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
     maxInterns: { type: Number, default: 3 },
     currentInterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
   }, { timestamps: true });

   module.exports = mongoose.model('Project', projectSchema);