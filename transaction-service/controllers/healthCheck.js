exports.healthCheck = async (req, res) => {
    try {
        const finalMessage = {
            status: 'OK',
            success: true,
            service: 'transaction-service'
        };
        await sendToQueue('trans_response_queue', finalMessage);
    } catch (error) {
        console.error('Error in healthcheck:', error);
        const finalMessage = {
            status: 'error',
            success: false,
            service: 'transaction-service'
        };
        await sendToQueue('trans_response_queue', finalMessage);
    }
}

