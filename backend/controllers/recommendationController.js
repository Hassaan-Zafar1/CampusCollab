const Project = require('../models/Project');
const Application = require('../models/Application');
const User = require('../models/User');
const { 
  calculateMatch, 
  getRecommendedProjects,
  rankCandidates,
  getTopRecommendations,
  getMatchingDetails
} = require('../utils/matchingAlgorithm');

// @desc    Get recommended projects for student
// @route   GET /api/recommendations/projects
// @access  Private/Student
exports.getRecommendedProjectsForStudent = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    if (!student.skills || student.skills.length === 0) {
      return res.json({
        success: true,
        message: 'Add skills to your profile to get recommendations',
        recommendations: []
      });
    }

    // Get all open projects
    const projects = await Project.find({ status: 'open' })
      .populate('supervisor', 'name email department');

    // Calculate match scores
    const projectsWithScores = projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      department: project.department,
      category: project.category,
      supervisor: project.supervisor,
      technologies: project.technologies,
      requiredSkills: project.requiredSkills,
      matchScore: calculateMatch(student.skills, project.requiredSkills),
      matchDetails: getMatchingDetails(student.skills, project.requiredSkills)
    }));

    // Sort by match score
    const sorted = projectsWithScores
      .filter(p => p.matchScore > 0) // Filter out 0% matches
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: sorted.length,
      recommendations: sorted
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top N recommendations for student
// @route   GET /api/recommendations/projects/top/:limit
// @access  Private/Student
exports.getTopProjectRecommendations = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const student = await User.findById(req.user._id);

    if (!student.skills || student.skills.length === 0) {
      return res.json({
        success: true,
        recommendations: []
      });
    }

    const projects = await Project.find({ status: 'open' })
      .populate('supervisor', 'name email department')
      .sort({ createdAt: -1 });

    const projectsWithScores = projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      department: project.department,
      category: project.category,
      supervisor: project.supervisor,
      technologies: project.technologies,
      requiredSkills: project.requiredSkills,
      maxInterns: project.maxInterns,
      currentInterns: project.currentInterns.length,
      matchScore: calculateMatch(student.skills, project.requiredSkills),
      matchDetails: getMatchingDetails(student.skills, project.requiredSkills)
    }));

    const top = projectsWithScores
      .filter(p => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    res.json({
      success: true,
      count: top.length,
      limit,
      recommendations: top
    });
  } catch (error) {
    console.error('Get top recommendations error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended candidates for a project
// @route   GET /api/recommendations/candidates/:projectId
// @access  Private/Professor
exports.getRecommendedCandidates = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.supervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to view recommendations for this project' 
      });
    }

    // Get all pending applications for this project
    const applications = await Application.find({ 
      project: req.params.projectId,
      status: 'pending'
    }).populate('student', 'name email skills department');

    if (applications.length === 0) {
      return res.json({
        success: true,
        message: 'No pending applications',
        candidates: []
      });
    }

    // Rank candidates by skill match
    const rankedCandidates = rankCandidates(applications, project.requiredSkills);

    const candidatesWithDetails = rankedCandidates.map(app => ({
      _id: app._id,
      student: app.student,
      coverLetter: app.coverLetter,
      appliedDate: app.appliedDate,
      documents: app.documents,
      matchScore: calculateMatch(app.student.skills, project.requiredSkills),
      matchDetails: getMatchingDetails(app.student.skills, project.requiredSkills)
    }));

    res.json({
      success: true,
      projectTitle: project.title,
      requiredSkills: project.requiredSkills,
      count: candidatesWithDetails.length,
      candidates: candidatesWithDetails
    });
  } catch (error) {
    console.error('Get recommended candidates error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate match details
// @route   GET /api/recommendations/match/:applicationId
// @access  Private
exports.getMatchDetails = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('student', 'name email skills department')
      .populate('project', 'title requiredSkills');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const matchDetails = getMatchingDetails(
      application.student.skills,
      application.project.requiredSkills
    );

    res.json({
      success: true,
      student: application.student.name,
      project: application.project.title,
      matchDetails
    });
  } catch (error) {
    console.error('Get match details error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get skill gap analysis
// @route   GET /api/recommendations/skills/gap/:projectId
// @access  Private/Student
exports.getSkillGapAnalysis = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const student = await User.findById(req.user._id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!student.skills) {
      return res.json({
        success: true,
        project: project.title,
        requiredSkills: project.requiredSkills,
        studentSkills: [],
        analysis: {
          matchPercentage: 0,
          matchingSkills: [],
          missingSkills: project.requiredSkills,
          recommendation: 'Add skills to improve match score'
        }
      });
    }

    const analysis = getMatchingDetails(student.skills, project.requiredSkills);

    res.json({
      success: true,
      project: project.title,
      requiredSkills: project.requiredSkills,
      studentSkills: student.skills,
      analysis
    });
  } catch (error) {
    console.error('Get skill gap error:', error);
    res.status(500).json({ message: error.message });
  }
};