module.exports = {
    //mongoURI: 'mongodb://localhost:27017/problem-issue-service-db',
    rabbitMQURL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
    userQueue: 'user_queue',
    userResponseQueue: 'user_response_queue'
};
