const Problem = require('../models/problemModel');
const { sendToQueue } = require('../utils/rabbitmq');

const getStats = async () => {
    try {
        console.log("Inside getStats");

        // Aggregate statistics
        const stats = {};

        // 1. Average Execution Duration
        const avgExecutionDurationResult = await Problem.aggregate([
            {
                $group: {
                    _id: null,
                    averageExecutionDuration: { $avg: "$executionDuration" }
                }
            }
        ]);
        stats.averageExecutionDuration = avgExecutionDurationResult[0]?.averageExecutionDuration || 0;

        // 2. Count of Problems by Status
        const statusCounts = await Problem.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        stats.statusCounts = statusCounts.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        // 3. Count of Problems with or without Solution
        const solutionCounts = await Problem.aggregate([
            {
                $match: { status: 'finished' }
            },
            {
                $group: {
                    _id: "$hasSolution",
                    count: { $sum: 1 }
                }
            }
        ]);
        stats.solutionCounts = solutionCounts.reduce((acc, { _id, count }) => {
            acc[_id ? 'hasSolution' : 'noSolution'] = count;
            return acc;
        }, {});

        // 4. Execution Time of the Last 20 finished Submissions
        const last20SubmissionsTime = await Problem.find({status: "finished"})
            .sort({ submissionDate: -1 })
            .limit(20)
            .select('submissionDate hasSolution executionDuration');
        stats.last20ExecutionTime = last20SubmissionsTime.map(submission => ({
            submissionDate: submission.submissionDate,
            hasSolution: submission.hasSolution,
            executionDuration: submission.executionDuration
        }));

        // 5. Total Distance Traveled, numVehicles, maxRouteDistance of the Last 10 Submissions which have feasible solution
        const last10Submissions = await Problem.find({hasSolution: true})
            .sort({ submissionDate: -1 })
            .limit(10)
            .select('numVehicles submissionDate maxRouteDistance totalDistTravel maxRouteDistance ');
        stats.last10Submissions = last10Submissions.map(submission => ({
            submissionDate: submission.submissionDate,
            totalDistTravel: submission.totalDistTravel,
            maxRotueDistance: submission.maxRouteDistance,
            numVehicles: submission.numVehicles
        }));

     
        console.log('Stats: ', stats);

        const message = {
            type: "stats",
            msg: stats
        };

        await sendToQueue('probMan-to-orch-queue', message);

    } catch (error) {
        console.error('Error finding solved problems:', error);
    }
};

module.exports = { getStats };
