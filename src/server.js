require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/db');

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDatabase();
    } else {
      console.warn('MONGODB_URI is not set. Starting server without a database connection.');
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server.');
    process.exit(1);
  }
};

startServer();
