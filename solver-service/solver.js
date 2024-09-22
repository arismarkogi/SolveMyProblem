const { connectRabbitMQ, sendToQueue, consumeQueue } = require('./utils/rabbitmq');
const { exec } = require('child_process');
const { taskQueue, resultQueue } = require('./config');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let isSolverBusy = false;

const processMessage = async (msg) => {
    console.log('Received message from probMan-to-solver-queue:', msg);

    // Destructure message fields and check if they are correct
    const { problemId,correlationId,token, numVehicles, depot, maxDistance, locationFileContent, locationFileName } = msg;

    if (typeof problemId === undefined || typeof numVehicles === undefined || typeof depot === undefined ||typeof maxDistance === undefined || typeof locationFileContent === undefined) {
        console.error('Missing required fields in the message:', msg);
        sendToQueue(resultQueue, {
            problemId,
            correlationId,
            token,
            status: 400,
            message: 'Missing required fields'
        });
        return;
    }

    // Log message content to ensure it's received properly
    console.log('Processing problem:', {
        problemId,
        numVehicles,
        depot,
        maxDistance,
        locationFileName,
        locationFileContent,
    });

    try {
        // Ensure the 'uploads' directory exists
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)){
            console.log('Creating upload directory at', uploadDir);
            fs.mkdirSync(uploadDir);
        }

        // Save location file locally for processing
        const locationFilePath = path.join(uploadDir, locationFileName || `location_${problemId}.json`);
        console.log('Saving location file to:', locationFilePath);

        fs.writeFileSync(locationFilePath, JSON.stringify(locationFileContent), 'utf-8');
        console.log('Location file saved successfully.');

        // Log the command that will be executed
        const command = `python3 vrpSolver.py ${locationFilePath} ${numVehicles} ${depot} ${maxDistance}`;
        console.log('Executing command:', command);

        const startTime = process.hrtime();

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing command:', error);
                isSolverBusy = false;
                sendToQueue(resultQueue, {
                    problemId,
                    correlationId,
                    token,
                    status: 500,
                    message: 'Internal server error'
                });
                return;
            }

            const [seconds, nanoseconds] = process.hrtime(startTime);
            const duration = seconds + nanoseconds / 1e9; // Convert to seconds

            if (stderr) {
                console.error('Solver stderr:', stderr);
                isSolverBusy = false;
                sendToQueue(resultQueue, {
                    problemId,
                    correlationId,
                    token,
                    status: 500,
                    message: 'Internal server error'
                });
                return;
            }

            console.log('Solver stdout:', stdout);
            console.log('Execution Duration: ', duration);

            // Process solution and log details
            let solution = '';
            let maxRouteDistance = 0;
            let totalDistTravel = 0;
            let hasSolution = false;

            if (stdout.trim() === 'No solution found !') {
                solution = 'No solution found !';
                console.log('Solver found no solution.');
            } else {
                hasSolution = true;
                const stdoutLines = stdout.trim().split('\n');
                solution = stdoutLines.slice(1, -2).join('\n');

                const totalDistanceLine = stdoutLines.find(line => line.startsWith('Total distance traveled by all vehicles:'));
                if (totalDistanceLine) {
                    totalDistTravel = parseInt(totalDistanceLine.match(/\d+/)[0]);
                    console.log('Total Distance Traveled:', totalDistTravel);
                }

                const maxDistanceLine = stdoutLines.find(line => line.startsWith('Maximum of the route distances:'));
                if (maxDistanceLine) {
                    maxRouteDistance = parseInt(maxDistanceLine.match(/\d+/)[0]);
                    console.log('Max Route Distance:', maxRouteDistance);
                }
            }

            const resultMessage = {
                problemId: problemId,
                correlationId: correlationId,
                token:token,
                hasSolution: hasSolution,
                solution: solution,
                maxRouteDistance: maxRouteDistance,
                totalDistTravel: totalDistTravel,
                executionDuration: duration
            };
            
            // Log the result message before sending it
            console.log('Sending result message to solver-to-probMan-queue:', resultMessage);
            
            // Send result to problem-management service queue
            sendToQueue(resultQueue, resultMessage);
            
            console.log('Result successfully sent to solver-to-probMan-queue');
            isSolverBusy = false;
        });
    } catch (error) {
        console.error('Error processing message in solver-service:', error);
        isSolverBusy = false;
        sendToQueue(resultQueue, {
            problemId,
            correlationId,
            token,
            status: 500,
            message: 'Internal server error'
        });
    }
};

const main = async () => {
    await connectRabbitMQ();
    console.log('Waiting for messages in', taskQueue);
    await consumeQueue(taskQueue, processMessage)
};

main().catch(console.error);
