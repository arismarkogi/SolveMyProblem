const axios = require('axios');
const jwt = require('jsonwebtoken');

const getProblemById = async (req, res) => {
  const { problemId } = req.params;

  try {
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required' });
    }

    if (!req.token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    });

    message = {
      headers: {
        authorization: `Bearer ${req.token}`,
        origin: `Bearer ${jwt.sign({ origin: process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY) }`,
      },
      type: 'getProblem',
    };

    const apiResponse = await axios.get(`http://problem-management-service:5000/getProblem/${problemId}`, message);
    res.status(apiResponse.status).json(apiResponse.data);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getProblemById };
