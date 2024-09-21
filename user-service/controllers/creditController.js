const { consumeQueue, sendToQueue } = require('../utils/rabbitmq');
const { MongoClient, ObjectId } = require('mongodb');

const checkAndDeductCredits = async (msg) => {
    const { userId, correlationId } = msg;

    console.log("Received userId:", userId);

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('user-service-db');
    const usersCollection = db.collection('users');

    try {
        // Find the user in the database by ObjectId
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        console.log("User data:", user);

        if (user && user.creditAmount > 0) {
            // Deduct one credit
            const updateResult = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $inc: { creditAmount: -1 } });

            console.log("Update Result:", updateResult);

            // Send a success response to the orchestrator
            await sendToQueue('user-service-credit-res', {
                correlationId,
                success: true,
                message: 'Credit deducted successfully',
            });
        } else {
            // Send a failure response to the orchestrator
            await sendToQueue('user-service-credit-res', {
                correlationId,
                success: false,
                message: 'Insufficient credits',
            });
        }
    } catch (error) {
        console.error('Error in checking and deducting credits:', error);
        await sendToQueue('user-service-credit-res', {
            correlationId,
            success: false,
            message: 'Error processing credit check',
        });
    } finally {
        await client.close();
    }
};

const initUserCreditQueueConsumer = async () => {
    await consumeQueue('user-service-credit-req', checkAndDeductCredits);
};

module.exports = { initUserCreditQueueConsumer };
