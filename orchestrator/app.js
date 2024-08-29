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