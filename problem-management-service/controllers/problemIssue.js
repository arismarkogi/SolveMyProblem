const Problem = require('../models/problemModel');
const { sendToQueue } = require('../utils/rabbitmq');
const fs = require('fs');
const path = require('path');

const submitData = async (req, res) => {
    try {
        const { userId, numVehicles, depot, maxDistance } = req.body;
        const locationFilePath = req.files?.locationFile?.[0]?.path;

        if (!userId || !numVehicles || !depot || !maxDistance || !locationFilePath) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProblem = new Problem({
            userId,
            locationFile: locationFilePath,
            numVehicles,
            depot,
            maxDistance,
            status: 'pending',
        });

        const savedProblem = await newProblem.save();

        const message = {
            problemId: savedProblem._id.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent: fs.readFileSync(locationFilePath, 'utf-8'),
            locationFileName: path.basename(locationFilePath)
        };

        await sendToQueue('probMan-to-solver-queue', message);
        res.status(200).json({ message: 'Problem submitted successfully' });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { submitData };
