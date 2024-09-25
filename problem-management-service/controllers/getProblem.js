const Problem = require('../models/problemModel');

const getProblemById = async (req, res) => {
  const { problemId } = req.params;

  try {
    const problem = await Problem.findById(problemId).select('-userId -locationFile -pythonFile');  // Exclude sensitive fields
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getProblemById };
