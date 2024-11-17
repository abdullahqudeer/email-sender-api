const express = require('express');
const emailController = require('./contactController');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors()); 
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api', emailController);

module.exports = (req, res) => {
  app(req, res);
};
