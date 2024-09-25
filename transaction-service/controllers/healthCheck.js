exports.healthCheck = async (req, res) => {
    try {
        const finalMessage = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            status: 'OK',
            success: true,
            service: 'transaction-service'
        };
        await sendToQueue('trans_response_queue', finalMessage);
    } catch (error) {
        console.error('Error in healthcheck:', error);
        const finalMessage = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            status: 'error',
            success: false,
            service: 'transaction-service'
        };
        await sendToQueue('trans_response_queue', finalMessage);
    }
}

