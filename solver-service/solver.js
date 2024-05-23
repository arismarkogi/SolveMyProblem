const { connectRabbitMQ, sendToQueue } = require('./utils/rabbitmq');
const { exec } = require('child_process');
const { taskQueue, resultQueue } = require('./config');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let isSolverBusy = false;

const processMessage = async (msg, connection) => {
    const message = JSON.parse(msg.content.toString());
    const { command, userId, locationFileContent, pythonFileContent, locationFileName, pythonFileName } = message;

    console.log('Received message:', message);

    // Ensure the 'uploads' directory exists
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }

    // Save files locally
    const locationFilePath = path.join(uploadDir, locationFileName);
    const pythonFilePath = path.join(uploadDir, pythonFileName);

    fs.writeFileSync(locationFilePath, locationFileContent, 'utf-8');
    fs.writeFileSync(pythonFilePath, pythonFileContent, 'utf-8');

    isSolverBusy = true;

    exec(command, { cwd: uploadDir }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing command:', error);
            isSolverBusy = false;
            return;
        }

        if (stderr) {
            console.error('Solver stderr:', stderr);
            isSolverBusy = false;
            return;
        }

        console.log('Solver stdout:', stdout);

        const resultMessage = {
            userId,
            result: stdout
        };

        sendToQueue(resultQueue, resultMessage, connection);
        isSolverBusy = false;
    });
};

const main = async () => {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    await channel.assertQueue(taskQueue);
    console.log('Waiting for messages in', taskQueue);

    channel.consume(taskQueue, async (msg) => {
        if (msg !== null && !isSolverBusy) {
            await processMessage(msg, connection);
            channel.ack(msg);
        } else if (msg !== null) {
            // Requeue the message
            setTimeout(() => channel.nack(msg), 1000);
        }
    });
};

main().catch(console.error);
