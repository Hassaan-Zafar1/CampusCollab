const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  submitApplication,
  submitApplicationWithFiles,
  getMyApplications,
  getApplicationsForProjects,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication
} = require('../controllers/applicationController');

const { protect, studentOnly, professorOnly } = require('../middleware/authMiddleware');

// Student routes
router.post('/', protect, studentOnly, submitApplication);
router.get('/my/applications', protect, studentOnly, getMyApplications);
router.delete('/:id', protect, studentOnly, deleteApplication);

// Professor routes
router.get('/professor/projects', protect, professorOnly, getApplicationsForProjects);
router.put('/:id/approve', protect, professorOnly, approveApplication);
router.put('/:id/reject', protect, professorOnly, rejectApplication);

// Get specific application (private)
router.get('/:id', protect, getApplicationById);

// File upload route
router.post('/upload/documents', protect, studentOnly, upload.array('documents', 5), submitApplicationWithFiles);

module.exports = router;