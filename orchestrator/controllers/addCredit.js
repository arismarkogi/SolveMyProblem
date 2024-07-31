const { json } = require('express');
const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');

exports.addCredit = async (req, res) => {//μπορει να πρεπει να παει μεσα στο addCredit με await
    try {
    const { userId, creditAmount,form } = JSON.parse(msg.content.toString());
    message_user ={
        type : "credit_update", 
        mes : {
        userId,
        creditAmount},
    }  
    
    await sendToQueue('user-service-queue', message_user);
    await receiveFromQueue('user-service-queue-res', async (msg) => {
        if (!msg.success) {
           res.status(500).json({ error: 'Internal Error-credit update' });
        }
        else{
            message_trans ={
                type : "new", 
                mes : {
                userId,
                creditAmount,
                form},
            }  
            await sendToQueue('trans_queue', message_trans);
            await receiveFromQueue('trans_response_queue', async (msg) => {
                if (!msg.success) {
                    res.status(500).json({ error: 'Internal Error-transaction creation' });
                }
            }
            ); 
        }
    });
    res.status(200).json({ message: 'Credit Added Succesfully' });
    }
    catch (error) {
        // Not sure if this the one chief - Fix if necessary
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};
