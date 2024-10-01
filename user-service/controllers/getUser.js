const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id } = decoded;

    console.log(`User-service: Fetching profile for user ${id}`);
    const user = await User.findById(id).select('-password');

    if (!user) {
      console.log(`User-service: User ${id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User-service: Profile fetched successfully for user ${id}`);
    return res.status(200).json({
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        creditAmount: user.creditAmount
      }
    });

  } catch (error) {
    console.error('User-service: Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};