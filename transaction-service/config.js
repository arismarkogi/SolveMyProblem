module.exports = {
    mongoURI: 'mongodb://localhost:27017/transaction-service-db',
    rabbitMQURL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/',
    transQueue: 'trans_queue',
    transResponseQueue: 'trans_response_queue'
};
