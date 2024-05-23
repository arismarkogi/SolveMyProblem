module.exports = {
    rabbitMQURL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
    taskQueue: 'task_queue',
    resultQueue: 'result_queue'
};
