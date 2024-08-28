var ObjectId = require('mongoose').Types.ObjectId;
const Problem = require('../models/problemModel');
const {sendToQueue} = require('../utils/rabbitmq');


/*
Sample message

{
   "type": "getProblems",
   "mes": {
       "userId": "66c324419a65cc7ffb62e48c", // valid userId format for MongoDB
       "isAdmin": false   // true or false
       }
}

*/


const getProblems = async (msg) => {
    try {
        console.log('Received message:', msg);

        const { userId, isAdmin } = msg;
    
        var problems = []

        if(isAdmin === true){
            problems = await Problem.find().select('-_id -__v').exec();
        } else if (isAdmin === false) {
            problems = await Problem.find({userId: new ObjectId(userId)}).select('-_id -__v').exec();
        } else {
            // Throw an error if isAdmin is neither true nor false
            throw new Error('Invalid value for isAdmin');
        }
        
        
        console.log('Problems Found:', problems);

        const message = {
            type: "getProblems",
            msg: problems
        };
        console.log(message)

        await sendToQueue('probMan-to-orch-queue', message);


    } catch (error) {
        console.error('Error finding solved problems:', error);
    }
};

module.exports = { getProblems };
