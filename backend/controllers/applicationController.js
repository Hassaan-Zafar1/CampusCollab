const Application = require('../models/Application');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Submit application to project
// @route   POST /api/applications
// @access  Private/Student
exports.submitApplication = async (req, res) => {
  try {
    const { projectId, coverLetter, documents } = req.body;

    // Validate fields
    if (!projectId || !coverLetter) {
      return res.status(400).json({ 
        message: 'Please provide projectId and coverLetter' 
      });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      student: req.user._id,
      project: projectId
    });

    if (existingApp) {
      return res.status(400).json({ 
        message: 'You have already applied to this project' 
      });
    }

    // Create application
    const application = await Application.create({
      student: req.user._id,
      project: projectId,
      coverLetter,
      documents: documents || []
    });

    // Populate references
    await application.populate('student', 'name email skills department');
    await application.populate('project', 'title department');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit application with file uploads
// @route   POST /api/applications/upload/documents
// @access  Private/Student
exports.submitApplicationWithFiles = async (req, res) => {
  try {
    const { projectId, coverLetter } = req.body;

    if (!projectId || !coverLetter) {
      return res.status(400).json({ 
        message: 'Please provide projectId and coverLetter' 
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get uploaded file paths
    const documents = req.files ? req.files.map(file => file.path) : [];

    const application = await Application.create({
      student: req.user._id,
      project: projectId,
      coverLetter,
      documents: documents
    });

    await application.populate('student', 'name email skills');
    await application.populate('project', 'title');

    res.status(201).json({
      success: true,
      message: 'Application submitted with documents',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (for student)
// @route   GET /api/applications/my/applications
// @access  Private/Student
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('project', 'title department category status')
      .populate('reviewedBy', 'name email')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for professor's projects
// @route   GET /api/applications/professor/projects
// @access  Private/Professor
exports.getApplicationsForProjects = async (req, res) => {
  try {
    // Find all projects by this professor
    const projects = await Project.find({ supervisor: req.user._id });
    const projectIds = projects.map(p => p._id);

    // Find all applications for these projects
    const applications = await Application.find({ project: { $in: projectIds } })
      .populate('student', 'name email skills department')
      .populate('project', 'title department')
      .populate('reviewedBy', 'name email')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student', 'name email skills department')
      .populate('project', 'title description department supervisor')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve application
// @route   PUT /api/applications/:id/approve
// @access  Private/Professor
exports.approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if professor is supervisor of the project
    const project = await Project.findById(application.project);
    if (project.supervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to approve this application' 
      });
    }

    // Update application
    application.status = 'approved';
    application.reviewedBy = req.user._id;
    application.reviewDate = Date.now();
    await application.save();

    // Add student to project's interns
    if (!project.currentInterns.includes(application.student)) {
      project.currentInterns.push(application.student);
      await project.save();
    }

    // Remove from applicants
    project.applicants = project.applicants.filter(
      id => id.toString() !== application.student.toString()
    );
    await project.save();

    await application.populate('student', 'name email');
    await application.populate('project', 'title');

    res.json({
      success: true,
      message: 'Application approved successfully',
      application
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject application
// @route   PUT /api/applications/:id/reject
// @access  Private/Professor
exports.rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if professor is supervisor
    const project = await Project.findById(application.project);
    if (project.supervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to reject this application' 
      });
    }

    // Update application
    application.status = 'rejected';
    application.reviewedBy = req.user._id;
    application.reviewDate = Date.now();
    await application.save();

    // Remove from applicants
    project.applicants = project.applicants.filter(
      id => id.toString() !== application.student.toString()
    );
    await project.save();

    await application.populate('student', 'name email');

    res.json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application (student can only delete pending)
// @route   DELETE /api/applications/:id
// @access  Private/Student
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only student can delete their own pending application
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this application' 
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Can only delete pending applications' 
      });
    }

    await application.deleteOne();

    // Remove from project applicants
    const project = await Project.findById(application.project);
    project.applicants = project.applicants.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await project.save();

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectApplicationStats = async (req, res) => {
  try {
    const projects = await Project.find({ supervisor: req.user._id });

    const stats = {
      totalProjects: projects.length,
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      totalInterns: 0
    };

    for (const project of projects) {
      stats.totalInterns += project.currentInterns.length;
    }

    const applications = await Application.find({
      project: { $in: projects.map(p => p._id) }
    });

    stats.totalApplications = applications.length;
    stats.pendingApplications = applications.filter(a => a.status === 'pending').length;
    stats.approvedApplications = applications.filter(a => a.status === 'approved').length;
    stats.rejectedApplications = applications.filter(a => a.status === 'rejected').length;

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationStats = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id });

    const stats = {
      totalApplications: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    res.json({
      success: true,
      stats,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};