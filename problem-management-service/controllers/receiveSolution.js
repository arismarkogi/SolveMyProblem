
const Problem = require('../models/problemModel');

const receiveSolution = async (msg) => {
    try {
        // Log the raw message received from the queue
        console.log('Raw message received from solver service:', msg);

        // Destructure the fields from the message
        const { problemId,correlationId,token, hasSolution, solution, maxRouteDistance, totalDistTravel, executionDuration } = msg;

        // Log each field to verify data integrity
        console.log('Problem ID:', problemId);
        console.log('Has Solution:', hasSolution);
        console.log('Solution:', solution);
        console.log('Max Route Distance:', maxRouteDistance);
        console.log('Total Distance Traveled:', totalDistTravel);
        console.log('Execution Duration:', executionDuration);

        // Ensure the problem ID is valid
        if (!problemId) {
            console.error('Problem ID is missing or invalid');
            return;
        }

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

        // Check if the update was successful
        if (!updatedProblem) {
            console.error(`Problem with ID ${problemId} not found in the database.`);
        } else {
            console.log('Problem updated successfully:', updatedProblem);
        }
    } catch (error) {
        console.error('Error occurred while receiving solution and updating problem:', error);
    }
};

module.exports = { receiveSolution };
