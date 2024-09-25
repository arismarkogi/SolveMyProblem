const Problem = require('../models/problemModel');
const { sendToQueue } = require('../utils/rabbitmq');

const getStats = async (mes) => {
    try {
        console.log("Inside getStats");
        console.log(mes);
        const { correlationId } = mes;

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

        // 4. Average Submissions per Day
        const avgSubmissionsPerDayResult = await Problem.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$submissionDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    avgSubmissionsPerDay: { $avg: "$count" }
                }
            }
        ]);
        stats.averageSubmissionsPerDay = avgSubmissionsPerDayResult[0]?.avgSubmissionsPerDay || 0;

        // 5. Average Submissions per User
        const avgSubmissionsPerUserResult = await Problem.aggregate([
            {
                $group: {
                    _id: "$userId",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    avgSubmissionsPerUser: { $avg: "$count" }
                }
            }
        ]);
        stats.averageSubmissionsPerUser = avgSubmissionsPerUserResult[0]?.avgSubmissionsPerUser || 0;

        // 6. Execution Time, Total Distance Traveled, numVehicles, maxRouteDistance of the Last 20 Submissions which have feasible solution
        const last20Submissions = await Problem.find({ hasSolution: true })
            .sort({ submissionDate: -1 })
            .limit(20)
            .select('executionDuration numVehicles maxDistance submissionDate maxRouteDistance totalDistTravel');
        stats.last20Submissions = last20Submissions.map(submission => ({
            executionDuration: submission.executionDuration,
            submissionDate: submission.submissionDate,
            maxDistance: submission.maxDistance,
            totalDistTravel: submission.totalDistTravel,
            maxRotueDistance: submission.maxRouteDistance,
            numVehicles: submission.numVehicles
        }));

        console.log('Stats: ', stats);

        const message = {
            type: "getStats",
            correlationId: correlationId,
            status: 200,
            stats: stats
        };

        await sendToQueue('probMan-to-orch-queue', message);

    } catch (error) {
        console.error('Error finding solved problems:', error);
        const message = {
            type: "getStats",
            correlationId: correlationId,
            status: 500,
            message: 'Internal Server Error'
        };
        await sendToQueue('probMan-to-orch-queue', message);
    }
};

module.exports = { getStats };
