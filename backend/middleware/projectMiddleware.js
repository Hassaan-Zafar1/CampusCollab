const Project = require('../models/Project');

// Check if user is the supervisor/owner of the project
exports.isProjectOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if current user is the supervisor
    if (project.supervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You are not the supervisor of this project.' 
      });
    }

    // Attach project to request for use in controller
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if project exists
exports.projectExists = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Attach project to request
    req.project = project;
    next();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid project ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};