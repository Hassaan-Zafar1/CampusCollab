const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getRecentActivity,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  getAllProjectsAdmin,
  deleteProjectAdmin,
  getAllApplicationsAdmin,
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes require JWT + admin role
router.use(protect, adminOnly);

// Stats & activity
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Project management
router.get('/projects', getAllProjectsAdmin);
router.delete('/projects/:id', deleteProjectAdmin);

// Application management
router.get('/applications', getAllApplicationsAdmin);

module.exports = router;
