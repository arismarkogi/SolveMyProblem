exports.healthCheck = async (req, res) => {
    try {
        res.status(200).json({ status: 'OK', service: 'problem-issue-service' });
    } catch (error) {
        console.error('Error in healthcheck:', error);
        res.status(500).json({ status: 'error', service: 'problem-issue-service'});
    }
}