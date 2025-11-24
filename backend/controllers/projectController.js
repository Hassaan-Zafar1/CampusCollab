const Project = require('../models/Project');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Professor
exports.createProject = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      department,
      category,
      technologies, 
      requiredSkills,
      maxInterns 
    } = req.body;

    // Validate category is provided
    if (!category) {
      return res.status(400).json({ message: 'Please provide a project category' });
    }

    const project = await Project.create({
      title,
      description,
      supervisor: req.user._id,
      department,
      category,
      technologies: technologies || [],
      requiredSkills: requiredSkills || [],
      maxInterns: maxInterns || 3,
      status: 'open'
    });

    // Populate supervisor info
    await project.populate('supervisor', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Public
exports.getAllProjects = async (req, res) => {
  try {
    const { 
      department, 
      category,
      skills, 
      status, 
      search,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    let query = {};

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by skills (match any skill in array)
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.requiredSkills = { $in: skillsArray };
    }

    // Search in title, description, and category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const projects = await Project.find(query)
      .populate('supervisor', 'name email department')
      .populate('currentInterns', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      projects
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('supervisor', 'name email department')
      .populate('currentInterns', 'name email skills department')
      .populate('applicants', 'name email skills department');

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid project ID format' 
      });
    }
    console.error('Get project by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Professor (owner only)
exports.updateProject = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      department,
      category,
      technologies, 
      requiredSkills,
      maxInterns,
      status 
    } = req.body;

    // req.project is already attached by middleware
    const project = req.project;

    // Update fields if provided
    if (title) project.title = title;
    if (description) project.description = description;
    if (department) project.department = department;
    if (category) project.category = category;
    if (technologies) project.technologies = technologies;
    if (requiredSkills) project.requiredSkills = requiredSkills;
    if (maxInterns) project.maxInterns = maxInterns;
    if (status) project.status = status;

    await project.save();
    await project.populate('supervisor', 'name email department');

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Professor (owner only)
exports.deleteProject = async (req, res) => {
  try {
    // req.project is already attached by middleware
    await req.project.deleteOne();

    res.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get professor's own projects
// @route   GET /api/projects/my/projects
// @access  Private/Professor
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ supervisor: req.user._id })
      .populate('currentInterns', 'name email skills')
      .populate('applicants', 'name email skills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
exports.getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const projects = await Project.find({ 
      category: { $regex: category, $options: 'i' },
      status: 'open'
    })
      .populate('supervisor', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      category,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get projects by category error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get projects by department
// @route   GET /api/projects/department/:department
// @access  Public
exports.getProjectsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const projects = await Project.find({ 
      department: { $regex: department, $options: 'i' }
    })
      .populate('supervisor', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      department,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get projects by department error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats/overview
// @access  Public
exports.getProjectStats = async (req, res) => {
  try {
    // Total projects
    const totalProjects = await Project.countDocuments();
    
    // Projects by status
    const openProjects = await Project.countDocuments({ status: 'open' });
    const inProgressProjects = await Project.countDocuments({ status: 'in-progress' });
    const closedProjects = await Project.countDocuments({ status: 'closed' });

    // Projects by category
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Projects by department
    const departmentStats = await Project.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Most required skills
    const skillStats = await Project.aggregate([
      {
        $unwind: '$requiredSkills'
      },
      {
        $group: {
          _id: '$requiredSkills',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalProjects,
        byStatus: {
          open: openProjects,
          inProgress: inProgressProjects,
          closed: closedProjects
        },
        byCategory: categoryStats,
        byDepartment: departmentStats,
        topSkills: skillStats
      }
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Add applicant to project
// @route   POST /api/projects/:id/apply
// @access  Private/Student
exports.applyToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    // Check if project is open
    if (project.status !== 'open') {
      return res.status(400).json({ 
        success: false,
        message: 'This project is not accepting applications' 
      });
    }

    // Check if already applied
    if (project.applicants.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already applied to this project' 
      });
    }

    // Check if already an intern
    if (project.currentInterns.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false,
        message: 'You are already an intern on this project' 
      });
    }

    // Add to applicants
    project.applicants.push(req.user._id);
    await project.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      project
    });
  } catch (error) {
    console.error('Apply to project error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const { buildProjectQuery } = require('../utils/filterBuilder');

exports.filterProjects = async (req, res) => {
  try {
    const { department, category, status, skills, search, page = 1, limit = 10 } = req.query;

    const filters = {
      department,
      category,
      status,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      search
    };

    const query = buildProjectQuery(filters);
    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate('supervisor', 'name email department')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      filters,
      count: projects.length,
      total,
      pages: Math.ceil(total / limit),
      projects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};