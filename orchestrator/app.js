const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const orchestrationRoutes = require('./routes/orchestrationRoutes');

require('dotenv').config();

app.use(express.json());
app.use('/', orchestrationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {console.log('Server running on port ' + PORT)});