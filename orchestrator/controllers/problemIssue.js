const multer = require('multer');
const upload = multer(); // For parsing multipart form data
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { sendToQueue, responseMap } = require('../utils/rabbitmq');

exports.problemIssue = [
    upload.none(),
    async (req, res) => {
        try {
            const correlationId = uuidv4();
            console.log(req.body)
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Missing token' });
            }
           
            console.log("Full request body:", JSON.stringify(req.body, null, 2));

            const message_user = {
                headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },
                type: "credit_update",
                mes: {
                    creditAmount:-1,
                    form:"spend",
                    correlationId,
                    ...req.body,

                }
            };
            responseMap.set(correlationId, res);
            console.log(`Sending credit update request to user-service, correlationId: ${correlationId}`);

            await sendToQueue('user-service-queue', message_user);

        }catch (error) {
                console.error('Internal Error in addCredit:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
}];
