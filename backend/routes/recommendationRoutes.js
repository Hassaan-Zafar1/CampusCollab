const express = require('express');
const router = express.Router();
const {
  getRecommendedProjectsForStudent,
  getTopProjectRecommendations,
  getRecommendedCandidates,
  getMatchDetails,
  getSkillGapAnalysis
} = require('../controllers/recommendationController');

const { protect, studentOnly, professorOnly } = require('../middleware/authMiddleware');

// Student routes
router.get('/projects', protect, studentOnly, getRecommendedProjectsForStudent);
router.get('/projects/top/:limit', protect, studentOnly, getTopProjectRecommendations);
router.get('/skills/gap/:projectId', protect, studentOnly, getSkillGapAnalysis);

// Professor routes
router.get('/candidates/:projectId', protect, professorOnly, getRecommendedCandidates);

// Match details (private)
router.get('/match/:applicationId', protect, getMatchDetails);

module.exports = router;