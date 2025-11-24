exports.buildProjectQuery = (filters) => {
  const query = {};

  if (filters.department) {
    query.department = { $regex: filters.department, $options: 'i' };
  }

  if (filters.category) {
    query.category = { $regex: filters.category, $options: 'i' };
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.skills && filters.skills.length > 0) {
    query.requiredSkills = { $in: filters.skills };
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } }
    ];
  }

  return query;
};

exports.buildApplicationQuery = (filters) => {
  const query = {};

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.studentId) {
    query.student = filters.studentId;
  }

  if (filters.dateFrom) {
    query.appliedDate = { $gte: new Date(filters.dateFrom) };
  }

  if (filters.dateTo) {
    if (!query.appliedDate) query.appliedDate = {};
    query.appliedDate.$lte = new Date(filters.dateTo);
  }

  return query;
};