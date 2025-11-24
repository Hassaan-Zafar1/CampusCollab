/**
 * Calculate match percentage between student skills and project skills
 * @param {Array} studentSkills - Array of student skill strings
 * @param {Array} projectSkills - Array of required project skills
 * @returns {Number} Match percentage (0-100)
 */
exports.calculateMatch = (studentSkills, projectSkills) => {
  // Handle edge cases
  if (!projectSkills || projectSkills.length === 0) {
    return 100; // No required skills = 100% match
  }

  if (!studentSkills || studentSkills.length === 0) {
    return 0; // No student skills = 0% match
  }

  // Convert to lowercase for case-insensitive comparison
  const normalizedStudentSkills = studentSkills.map(skill => 
    skill.toLowerCase().trim()
  );

  // Find matching skills
  const matches = projectSkills.filter(projectSkill => 
    normalizedStudentSkills.some(studentSkill => 
      studentSkill === projectSkill.toLowerCase().trim()
    )
  );

  // Calculate percentage
  const matchPercentage = (matches.length / projectSkills.length) * 100;
  
  return Math.round(matchPercentage);
};

/**
 * Get recommended projects for a student
 * @param {Array} studentSkills - Student's skills
 * @param {Array} projects - Array of project objects
 * @returns {Array} Projects sorted by match percentage
 */
exports.getRecommendedProjects = (studentSkills, projects) => {
  const projectsWithScores = projects.map(project => ({
    ...project,
    matchScore: exports.calculateMatch(studentSkills, project.requiredSkills)
  }));

  // Sort by match score descending
  return projectsWithScores.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Get recommended candidates for a project
 * @param {Array} applications - Array of applications
 * @param {Array} requiredSkills - Project's required skills
 * @returns {Array} Candidates sorted by match score
 */
exports.rankCandidates = (applications, requiredSkills) => {
  const candidatesWithScores = applications
    .filter(app => app.status === 'pending') // Only pending applications
    .map(app => ({
      ...app,
      matchScore: exports.calculateMatch(app.student.skills, requiredSkills)
    }));

  // Sort by match score descending
  return candidatesWithScores.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Get top N recommended projects
 * @param {Array} studentSkills - Student's skills
 * @param {Array} projects - Array of projects
 * @param {Number} limit - Number of recommendations (default 5)
 * @returns {Array} Top N recommended projects
 */
exports.getTopRecommendations = (studentSkills, projects, limit = 5) => {
  const recommended = exports.getRecommendedProjects(studentSkills, projects);
  
  // Filter to only open projects with match score > 0
  return recommended
    .filter(p => p.status === 'open' && p.matchScore > 0)
    .slice(0, limit);
};

/**
 * Get matching skills between student and project
 * @param {Array} studentSkills - Student's skills
 * @param {Array} projectSkills - Project's required skills
 * @returns {Object} Matching and missing skills
 */
exports.getMatchingDetails = (studentSkills, projectSkills) => {
  const normalizedStudentSkills = studentSkills.map(skill => 
    skill.toLowerCase().trim()
  );

  const matching = projectSkills.filter(projectSkill =>
    normalizedStudentSkills.includes(projectSkill.toLowerCase().trim())
  );

  const missing = projectSkills.filter(projectSkill =>
    !normalizedStudentSkills.includes(projectSkill.toLowerCase().trim())
  );

  return {
    matchingSkills: matching,
    missingSkills: missing,
    matchPercentage: exports.calculateMatch(studentSkills, projectSkills)
  };
};