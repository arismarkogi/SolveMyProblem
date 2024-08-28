const Problem = require('../models/problemModel');
const {sendToQueue} = require('../utils/rabbitmq');
const fs = require('fs');
const path = require('path');




/* Sample Message
{
    "type": "problemIssue",
    "mes": {
        "locationFilePath": "uploads/locations_20.json",    // something from the directory problem-management-service/uploads
        "numVehicles": 5, // integer
        "depot": 17,      // integer less than #locations
        "maxDistance": 100000, // integer
        "userId": "66c324419a65cc7ffb62e48c" // correct  format for MongoDB
    }
}

*/


const submitData = async (msg) => {
    try {

        console.log(msg);
        const { locationFilePath, numVehicles, depot, maxDistance, userId } = msg;


        const newProblem = new Problem({
            userId: userId,               
            locationFile: locationFilePath,    
            numVehicles: numVehicles,                   
            depot: depot,                         
            maxDistance: maxDistance,                
            status: 'pending',                
        });

        // Save the new problem and get its ID
        const savedProblem = await newProblem.save();
        const problemId = savedProblem._id;
        console.log("SavedProblem:", savedProblem)

        // Verify that files exist before reading them
        if (!fs.existsSync(locationFilePath)) {
            return res.status(500).json({ error: 'File upload failed' });
        }

        const message = {
            problemId: problemId.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent: fs.readFileSync(locationFilePath, 'utf-8'), // this will be removed after docker
            locationFileName: path.basename(locationFilePath)
        };

        await sendToQueue('probMan-to-solver-queue', message);

        
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};

module.exports = { submitData };


/*
const submitData = async (req, res) => {
    try {
        const { numVehicles, depot, maxDistance, userId } = req.body;
        const locationFile = req.files['location'][0].path;
        const pythonFile = req.files['python'][0].path;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.creditAmount <= 0) {
            return res.status(400).json({ error: 'Insufficient credits' });
        }

        const command = `python3 ${pythonFile} ${locationFile} ${numVehicles} ${depot} ${maxDistance}`;
        
        // Deduct one credit from the user
        user.creditAmount -= 1;
        await user.save();

        const newData = new Data({
            userId,
            command,
            locationFile,
            pythonFile
        });

        await newData.save();

        // Verify that files exist before reading them
        if (!fs.existsSync(locationFile) || !fs.existsSync(pythonFile)) {
            return res.status(500).json({ error: 'File upload failed' });
        }

        const message = {
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFile: fs.readFileSync(locationFile, 'utf-8'),
            pythonFile: fs.readFileSync(pythonFile, 'utf-8'),
            command
        };

        await sendToQueue('task_queue', message);

        res.status(200).json({ message: 'Data submitted and sent to queue' });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ error: 'Error submitting data' });
    }
};

module.exports = { submitData };
*/

