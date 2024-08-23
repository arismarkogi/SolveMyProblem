module.exports = {
    rabbitMQURL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
    taskQueue: 'problem-issue-req-queue',
    resultQueue: 'problem-issue-res-queue'
};
