const express = require('express');
const bodyParser = require('body-parser');
const emailController = require('./contactController');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(bodyParser.json());

app.use('/api', emailController);

// Start the server
app.listen(port, () => {
  console.log(`Email service running on port ${port}`);
});
