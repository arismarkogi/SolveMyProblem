exports.healthCheck = async (req, res) => {
    try {
        const finalMessage = {
            status: 'OK',
            success: true,
            service: 'user-service'
        };
        await sendToQueue('user-service-queue-res', finalMessage);
    } catch (error) {
        console.error('Error in healthcheck:', error);
        const finalMessage = {
            status: 'error',
            success: false,
            service: 'user-service'
        };
        await sendToQueue('user-service-queue-res', finalMessage);
    }
}