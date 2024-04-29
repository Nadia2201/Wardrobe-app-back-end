const { GridFSBucket } = require("mongodb"); // Import the necessary module

let gfsBucket;

const initializeGridFSBucket = (dbConnection) => {

    console.log('gridfsbucket db name:', dbConnection.connection.db.databaseName)
    if (!dbConnection || !dbConnection.connection) {
        throw new Error("Database connection not established");
    }

  // Initialize GridFSBucket
    gfsBucket = new GridFSBucket(dbConnection.connection.db, {
        bucketName: "uploads", // Customize the bucket name as needed
    });

    console.log("GridFSBucket initialized");
};

const getGFSBucket = () => {
    if (!gfsBucket) {
        throw new Error("GridFSBucket not initialized. Ensure the database connection is established.");
    }
    return gfsBucket;
};

module.exports = { initializeGridFSBucket, getGFSBucket };
