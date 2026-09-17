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

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      message: 'Invalid JSON request body.',
    });
  }

  console.error(`Application error: ${error.message}`);
  return res.status(500).json({
    message: 'An unexpected server error occurred.',
  });
});

module.exports = app;
