const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api', registrationRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Event Registration System API is running.',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

module.exports = app;
