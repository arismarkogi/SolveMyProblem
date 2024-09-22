/*const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const orchestrationRoutes = require('./routes/orchestrationRoutes');
const { connectRabbitMQ } = require('./utils/rabbitmq');

require('dotenv').config();


//than
const cors = require('cors');
app.use(cors());
//
app.use(express.json());
app.use('/', orchestrationRoutes);

const PORT = process.env.PORT || 5000;

connectRabbitMQ();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => {console.log('Server running on port ' + PORT)});
*/
///////////idk
/*
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const orchestrationRoutes = require('./routes/orchestrationRoutes');
const { connectRabbitMQ } = require('./utils/rabbitmq');

require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));

app.use(express.json());
app.use('/', orchestrationRoutes);

const PORT = process.env.PORT || 6900;

connectRabbitMQ();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => {console.log('Server running on port ' + PORT)});
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const orchestrationRoutes = require('./routes/orchestrationRoutes');
const { connectRabbitMQ } = require('./utils/rabbitmq');

require('dotenv').config();

// Middleware setup

// CORS setup: Allow requests from the frontend running on port 3000
app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
    credentials: true // Allow credentials if needed (e.g., for cookies, authentication headers)
}));

//app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware to parse the Authorization header
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        req.token = token;
    }
    next();
});

// Orchestration routes
app.use('/', orchestrationRoutes);

// Connect to RabbitMQ and start consuming messages
connectRabbitMQ();

// Start the Express server
const PORT = process.env.PORT || 6900;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
