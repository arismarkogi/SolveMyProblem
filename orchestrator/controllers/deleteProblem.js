const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');

exports.deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.token;
        console.log(token);
        if(!token) {
            return res.status(400).json({ error: 'Missing token' });
        }


        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            console.error('Invalid token', err);
            return res.status(401).json({ error: 'Invalid token' });
        }

        if(!id) {
            return res.status(400).json({ error: 'Missing id' });
        }

        const correlationId = uuidv4();


        const message = {
            headers: {
                authorization: `Bearer ${token}`,
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                correlationId,
                id
            },
            type: "update",
        };
        responseMap.set(correlationId, res);

        const apiResponse = await axios.delete(`http://problem-management-service:5000/deleteProblem/${id}`, message);
        responseMap.delete(correlationId);
        return res.status(apiResponse.status).json(apiResponse.data);

        
        
    } catch (error) {
        console.error('Internal Error', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
};

