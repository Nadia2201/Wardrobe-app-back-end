// docs: https://github.com/motdotla/dotenv#%EF%B8%8F-usage
require("dotenv").config();

const express = require("express");
const { connectToDatabase } = require("../api/db/db.js");
const { initializeGridFSBucket } = require("../api/models/gridfsbucket.js");
const app = require("./app.js");
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    const connection = await connectToDatabase(); // Wait for the MongoDB connection to establish

    if (!connection || connection.connection.readyState !== 1) { // Check if the connection is established
      throw new Error("Database connection not established in startServer");
    }

    console.log("Database connected in startServer:");

    // Initialize GridFSBucket after MongoDB connection is established
    initializeGridFSBucket(connection);

    // Define your routes and middleware here
    app.use(express.json()); // Middleware to parse JSON bodies

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer(); // Start the server asynchronously

// const listenForRequests = () => {
  
//   app.listen(port, () => {
//     console.log("Now listening on port", port);
//   });
// };

// connectToDatabase().then(() => {
//   initializeGridFSBucket();
//   listenForRequests();
// });
