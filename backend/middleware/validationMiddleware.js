// Validate project creation/update data
exports.validateProject = (req, res, next) => {
  const { title, description, department, category, technologies, requiredSkills } = req.body;

  // Check required fields
  if (!title || !description || !department || !category) {
    return res.status(400).json({ 
      message: 'Please provide title, description, department, and category' 
    });
  }

  // Validate title length
  if (title.length < 5 || title.length > 200) {
    return res.status(400).json({ 
      message: 'Title must be between 5 and 200 characters' 
    });
  }

  // Validate description length
  if (description.length < 20) {
    return res.status(400).json({ 
      message: 'Description must be at least 20 characters' 
    });
  }

  // Validate category length
  if (category.length < 2 || category.length > 100) {
    return res.status(400).json({ 
      message: 'Category must be between 2 and 100 characters' 
    });
  }

  // Validate arrays
  if (technologies && !Array.isArray(technologies)) {
    return res.status(400).json({ 
      message: 'Technologies must be an array' 
    });
  }

  if (requiredSkills && !Array.isArray(requiredSkills)) {
    return res.status(400).json({ 
      message: 'Required skills must be an array' 
    });
  }

  next();
};

// Validate application data
exports.validateApplication = (req, res, next) => {
  const { coverLetter } = req.body;

  if (!coverLetter) {
    return res.status(400).json({ 
      message: 'Please provide a cover letter' 
    });
  }

  if (coverLetter.length < 50) {
    return res.status(400).json({ 
      message: 'Cover letter must be at least 50 characters' 
    });
  }

  next();
};