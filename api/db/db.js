const mongoose = require("mongoose");

let dbConnection; // Variable to store the Mongoose connection

const connectToDatabase = async () => {
  const mongoDbUrl = process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set. See the README for more details."
    );
    throw new Error("No connection string provided");
  }

  dbConnection = await mongoose.connect(mongoDbUrl);

  if (dbConnection.connection.readyState !== 1) { // 1 indicates a connected state
    throw new Error("Failed to establish a connection with MongoDB.");
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
  }

  console.log("Connected to MongoDB:", dbConnection.connection.db.databaseName);

  return dbConnection;
};

module.exports = { connectToDatabase };



// const connectToDatabase = async () => {
//   const mongoDbUrl = process.env.MONGODB_URL;

//   if (!mongoDbUrl) {
//     console.error(
//       "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set."
//     );
//     throw new Error("No connection string provided");
//   }

  // dbConnection = mongoose.createConnection(mongoDbUrl, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

//   dbConnection.once("open", () => {
//     gfs = Grid(dbConnection.db, mongoose.mongo); // Correctly initialize GridFS
//     gfs.collection("uploads"); // Set the GridFS collection
//     console.log("GridFS initialized");
//   });
//   // dbConnection = await mongoose.connect(mongoDbUrl, {
//   //   useNewUrlParser: true,
//   //   useUnifiedTopology: true,
//   // });

//   if (process.env.NODE_ENV !== "test") {
//     console.log("Successfully connected to MongoDB");
//   }
//  //dbName: 'wardrobe', url: 'mongodb://0.0.0.0/wardrobe',
//   // console.log(dbConnection.connection.db)

  

//   // Initialize GridFS once the connection is open
//   // gfs = Grid(dbConnection.connection.db, mongoose);
//   // gfs.collection("uploads"); // Set the GridFS collection name
//   // console.log('mongo db connected')

//     // var writestream = gfs.createWriteStream({
//     //   filename: 'my_file.txt'
//     // });
//   return dbConnection;
// };

// const getGFS = () => {
//   if (!gfs) {
//     console.log('gfs not initialized')
//     throw new Error("GridFS not initialized. Ensure that the database connection is established.");
//   }
//   console.log('gfs connected')
//   return gfs;
// };

// module.exports = { connectToDatabase, getGFS, dbConnection };


 // dbConnection = await mongoose.connect(mongoDbUrl, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });