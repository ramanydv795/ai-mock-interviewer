require('dotenv').config();
const express = require('express');
const cors = require('cors');

const interviewRoute = require('./routes/interview');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', interviewRoute);

app.listen(5001, () => {
  console.log('Interview server running on port 5001');
});