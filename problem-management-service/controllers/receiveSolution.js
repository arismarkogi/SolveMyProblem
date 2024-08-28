const Problem = require('../models/problemModel');

const receiveSolution = async (msg) => {
    try {
        console.log('Received message:', msg);

        const {problemId, hasSolution, solution, maxRouteDistance, totalDistTravel, executionDuration } = msg;

        // Find the document by problemId and update it with the new values
        const updatedProblem = await Problem.findByIdAndUpdate(
            problemId, // The ID of the document to update
            {
                $set: {
                    status: 'finished',
                    hasSolution: hasSolution,
                    solution: solution,
                    maxRouteDistance: maxRouteDistance,
                    totalDistTravel: totalDistTravel,
                    executionDuration: executionDuration
                }
            },
            { new: true } // Option to return the updated document
        );

        if (!updatedProblem) {
            console.error(`Problem with ID ${problemId} not found.`);
        } else {
            console.log('Problem updated successfully:', updatedProblem);
        }
    } catch (error) {
        console.error('Error receiving solution :', error);
        res.status(500).json({ error: 'Error  receiveing Solution' });
    }
};

module.exports = {receiveSolution};