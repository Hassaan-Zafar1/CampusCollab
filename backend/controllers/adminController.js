const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');

// ─────────────────────────────────────────────
// @desc    Platform-wide statistics
// @route   GET /api/admin/stats
// @access  Admin
// ─────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalProfessors,
      totalProjects,
      openProjects,
      inProgressProjects,
      closedProjects,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'professor' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'open' }),
      Project.countDocuments({ status: 'in-progress' }),
      Project.countDocuments({ status: 'closed' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
    ]);

    return res.json({
      success: true,
      stats: {
        users: { total: totalUsers, students: totalStudents, professors: totalProfessors },
        projects: { total: totalProjects, open: openProjects, inProgress: inProgressProjects, closed: closedProjects },
        applications: { total: totalApplications, pending: pendingApplications, approved: approvedApplications, rejected: rejectedApplications },
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Recent activity feed
// @route   GET /api/admin/activity
// @access  Admin
// ─────────────────────────────────────────────
exports.getRecentActivity = async (req, res) => {
  try {
    const [recentUsers, recentProjects, recentApplications] = await Promise.all([
      User.find({ role: { $ne: 'admin' } })
        .select('name email role department createdAt isVerified')
        .sort({ createdAt: -1 })
        .limit(8),
      Project.find()
        .populate('supervisor', 'name email')
        .select('title department category status createdAt')
        .sort({ createdAt: -1 })
        .limit(8),
      Application.find()
        .populate('student', 'name email')
        .populate('project', 'title')
        .select('status appliedDate')
        .sort({ appliedDate: -1 })
        .limit(8),
    ]);

    return res.json({
      success: true,
      recentUsers,
      recentProjects,
      recentApplications,
    });
  } catch (error) {
    console.error('Admin activity error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all users (paginated, filterable)
// @route   GET /api/admin/users
// @access  Admin
// ─────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 15 } = req.query;

    const query = { role: { $ne: 'admin' } };

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      User.countDocuments(query),
    ]);

    return res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
// ─────────────────────────────────────────────
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch their projects or applications based on role
    let extra = {};
    if (user.role === 'professor') {
      extra.projects = await Project.find({ supervisor: user._id })
        .select('title status category createdAt')
        .sort({ createdAt: -1 });
    } else if (user.role === 'student') {
      extra.applications = await Application.find({ student: user._id })
        .populate('project', 'title category')
        .select('status appliedDate')
        .sort({ appliedDate: -1 });
    }

    return res.json({ success: true, user, ...extra });
  } catch (error) {
    console.error('Admin get user error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
// ─────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cascade: remove their applications / projects
    if (user.role === 'student') {
      await Application.deleteMany({ student: user._id });
    } else if (user.role === 'professor') {
      // Delete all projects by this professor and their applications
      const projects = await Project.find({ supervisor: user._id });
      const projectIds = projects.map(p => p._id);
      await Application.deleteMany({ project: { $in: projectIds } });
      await Project.deleteMany({ supervisor: user._id });
    }

    await user.deleteOne();

    return res.json({ success: true, message: 'User and associated data deleted.' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
// ─────────────────────────────────────────────
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['student', 'professor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be student or professor.' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own admin role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ success: true, message: `Role updated to ${role}`, user });
  } catch (error) {
    console.error('Admin update role error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all projects (admin view)
// @route   GET /api/admin/projects
// @access  Admin
// ─────────────────────────────────────────────
exports.getAllProjectsAdmin = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('supervisor', 'name email department')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Project.countDocuments(query),
    ]);

    return res.json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    console.error('Admin get projects error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Force-delete any project
// @route   DELETE /api/admin/projects/:id
// @access  Admin
// ─────────────────────────────────────────────
exports.deleteProjectAdmin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove linked applications
    await Application.deleteMany({ project: project._id });
    await project.deleteOne();

    return res.json({ success: true, message: 'Project and its applications deleted.' });
  } catch (error) {
    console.error('Admin delete project error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all applications (admin view)
// @route   GET /api/admin/applications
// @access  Admin
// ─────────────────────────────────────────────
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('student', 'name email department')
        .populate('project', 'title category department')
        .populate('reviewedBy', 'name email')
        .sort({ appliedDate: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Application.countDocuments(query),
    ]);

    return res.json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      applications,
    });
  } catch (error) {
    console.error('Admin get applications error:', error);
    return res.status(500).json({ message: error.message });
  }
};
