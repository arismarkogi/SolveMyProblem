const { connectRabbitMQ, sendToQueue, consumeQueue } = require('./utils/rabbitmq');
const { exec } = require('child_process');
const { taskQueue, resultQueue } = require('./config');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let isSolverBusy = false;

const processMessage = async (msg) => {
    
    isSolverBusy = true;
        
    const {problemId, numVehicles, depot, maxDistance, locationFileContent, locationFileName} = msg

    console.log('Received message:', msg);

    // Ensure the 'uploads' directory exists
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    // Save file lcoation file locally
    // This will be removed after docker
    const locationFilePath = path.join(uploadDir, locationFileName);
    fs.writeFileSync(locationFilePath, locationFileContent, 'utf-8');

    const command = `python3 vrpSolver.py ${locationFilePath} ${numVehicles} ${depot} ${maxDistance}`;

    const startTime = process.hrtime(); 

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing command:', error);
            isSolverBusy = false;
            return;
        }

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = seconds + nanoseconds / 1e9; // Convert to seconds

        if (stderr) {
            console.error('Solver stderr:', stderr);
            isSolverBusy = false;
            return;
        }

        let solution = '';
        let maxRouteDistance = 0;
        let totalDistTravel = 0;
        let hasSolution = false;

        if (stdout.trim() === 'No solution found !') {
            solution = 'No solution found !';
          
        } else {
            hasSolution = true;
            // Parse the stdout to extract solution, maxRouteDistance, and totalDistTravel.
            const stdoutLines = stdout.trim().split('\n');
            
            // Extract the solution string (everything but the totalDistTravel and maxRouteDistance)
            solution = stdoutLines.slice(1, -2).join('\n');
            
            // Extract totalDistTravel and maxRouteDistance
            const totalDistanceLine = stdoutLines.find(line => line.startsWith('Total distance traveled by all vehicles:'));
            if (totalDistanceLine) {
                totalDistTravel = parseInt(totalDistanceLine.match(/\d+/)[0]);
            }

            const maxDistanceLine = stdoutLines.find(line => line.startsWith('Maximum of the route distances:'));
            if (maxDistanceLine) {
                maxRouteDistance = parseInt(maxDistanceLine.match(/\d+/)[0]);
            }
        }

        console.log('Solver stdout:', stdout);
        console.log('Execution Duration: ', duration);
        
        // Construct the result message
        const resultMessage = {
            problemId: problemId,
            hasSolution: hasSolution,
            solution: solution,
            maxRouteDistance: maxRouteDistance,
            totalDistTravel: totalDistTravel,
            executionDuration: duration
        };
        console.log(resultMessage)
        
        sendToQueue(resultQueue, resultMessage);
        isSolverBusy = false;
    });
};

const main = async () => {
    await connectRabbitMQ();
    console.log('Waiting for messages in', taskQueue);
    await consumeQueue(taskQueue, processMessage)
};

main().catch(console.error);
