module.exports = {
    rabbitMQURL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
    taskQueue: 'probMan-to-solver-queue',
    resultQueue: 'solver-to-probMan-queue'
};
