const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getAllProjects, 
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getProjectsByCategory,
  getProjectsByDepartment,
  getProjectStats,
  applyToProject
} = require('../controllers/projectController');

const { protect, professorOnly, studentOnly } = require('../middleware/authMiddleware');
const { isProjectOwner, projectExists } = require('../middleware/projectMiddleware');
const { validateProject } = require('../middleware/validationMiddleware');

// Public routes - specific routes BEFORE dynamic routes
router.get('/stats/overview', getProjectStats);
router.get('/category/:category', getProjectsByCategory);
router.get('/department/:department', getProjectsByDepartment);

// Protected routes - Professor only (MUST be before /:id)
router.get('/my/projects', protect, professorOnly, getMyProjects);
router.post('/', protect, professorOnly, validateProject, createProject);

// Public route - get all projects with filters
router.get('/', getAllProjects);

// Dynamic routes (MUST be after specific routes)
router.get('/:id', getProjectById);
router.put('/:id', protect, professorOnly, projectExists, isProjectOwner, validateProject, updateProject);
router.delete('/:id', protect, professorOnly, projectExists, isProjectOwner, deleteProject);

// Protected routes - Student only
router.post('/:id/apply', protect, studentOnly, applyToProject);

module.exports = router;