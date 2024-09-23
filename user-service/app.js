const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const { connectRabbitMQ, consumeQueue } = require('./utils/rabbitmq');

// Import controllers individually
const logInController = require('./controllers/logIn');
const updateCreditController = require('./controllers/updateCredit');
const searchUsersController = require('./controllers/searchUsers');
const googleSignUpController = require('./controllers/googleSignUp');
const signUpController = require('./controllers/signUp');
const updateUserController = require('./controllers/updateUser');
const deleteUserController = require('./controllers/deleteUser');
const healthCheckController = require('./controllers/healthCheck');
const getUserProfileController = require('./controllers/getUserProfile');
const getUserController = require('./controllers/getUser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/', userRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const processMessage = async (message) => {
    const { type, mes } = message;
    //console.log('Received message:', mes);

    switch(type) {
        case "login": await logInController.logIn(mes); return;
        case "credit_update": await updateCreditController.updateCredit(mes); return;
        case "search": await searchUsersController.searchUsers(mes); return;
        case "google_signup": await googleSignUpController.googleSignUp(mes); return;
        case "signup": await signUpController.signUp(mes); return;
        case "update": await updateUserController.updateUser(mes); return;
        case "delete": await deleteUserController.deleteUser(mes); return;
        case "health_check": await healthCheckController.healthCheck(mes); return;
        case "get_user_profile": await getUserProfileController.getUserProfile(mes); return;
        case "get_user_by_token": await getUserController.getUser(mes); return;
        default: console.log('Unknown message type:', type);
    }
};

const main = async () => {
    await connectRabbitMQ();
    await consumeQueue('user-service-queue', processMessage);
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    main().catch(console.error);
});
