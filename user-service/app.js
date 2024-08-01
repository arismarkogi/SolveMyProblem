const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const logInController = require('./controllers/logIn');
const googleSignUpController = require('./controllers/googleSignUp');
const searchUsersController = require('./controllers/searchUsers');
const signUpController = require('./controllers/signUp');
const deleteUserController = require('./controllers/deleteUser');
const updateUserController = require('./controllers/updateUser');
const healthCheckController = require('./controllers/healthCheck');
const updateCreditController = require('./controllers/updateCredit');
const { connectRabbitMQ } = require('./utils/rabbitmq');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/', userRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const processMessage = async (msg) => {
        const message = JSON.parse(msg.content.toString());
        const {type, mes} = message;
        console.log('Received message:', mes);

        if(type === "login"){
            logInController.logIn(mes)
        }
        else if(type === "credit_update"){
            updateCreditController.updateCredit(mes);

        }
        else if(type === "search"){
            searchUsersController.searchUsers(mes);
        }
        else if(type === "google_signup"){
            googleSignUpController.googleSignUp(mes);
        }
        else if(type === "signup"){
            signUpController.signUp(mes);
        }
        
        else if(type === "update"){
            updateUserController.updateUser(mes);
        }
        else if(type === "delete"){
            deleteUserController.deleteUser(mes);
        }
        else if(type === "health_check"){  
            healthCheckController.healthCheck(mes);
        } 
        
    
        console.log('Received message:', message);
};
    
const main = async () => {
        const channel = await connectRabbitMQ();
    
        console.log('Waiting for messages in user-service-queue');
    
        channel.consume('user-service-queue', async (msg) => {
            if (msg !== null) {
                await processMessage(msg);
                channel.ack(msg);
            }
        });
    };
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        main().catch(console.error);
    });
    