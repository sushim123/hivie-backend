import mongoose from 'mongoose';

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME // Specify the database name to connect to
  })
  .then(() => {
    // Log a message to the console when the connection is successful
    console.log('Mongodb is ready.');
  })
  .catch((err) => {
    // Log any connection errors to the console
    console.log(err.message,);
  });

// Listen for the 'connected' event, which indicates a successful connection to the database
// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to db');
// });

// Listen for the 'error' event and log any connection errors
mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

// Listen for the 'disconnected' event, which indicates the connection to the database has been closed
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.');
});

// Handle the 'SIGINT' signal (sent when the process is interrupted, e.g., Ctrl+C)
// Gracefully close the MongoDB connection before exiting the process
process.on('SIGINT', async () => {
  await mongoose.connection.close(); // Close the connection
  process.exit(0); // Exit the process with a status code of 0 (success)
});
