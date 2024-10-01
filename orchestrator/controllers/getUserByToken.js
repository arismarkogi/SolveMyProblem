const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.getUserByToken = async (req, res) => {
    try {
        
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

       
        const userServiceResponse = await axios.get('http://user-service:4217/get-user', {
            headers: {
              Authorization: `Bearer ${token}`,
              Origin: `Bearer ${jwt.sign({origin: process.env.ORIGIN}, process.env.JWT_SECRET_ORIGIN_KEY)}`
            }
          });
      
          // Forward the user service response to the client
          return res.status(userServiceResponse.status).json(userServiceResponse.data);

        } catch (error) {
            console.error('Error in getUserByToken:', error);
            if (error.response) {
              // Forward error from user service
              return res.status(error.response.status).json(error.response.data);
            }
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        };