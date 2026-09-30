const mongoose = require("mongoose");

let gridfsBucket;

const initializeGridFS = () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        {
            bucketName: "driverDocuments"
        }
    );

    console.log("GridFS initialized");
};

const getGridFS = () => {
    return gridfsBucket;
};

module.exports = {
    initializeGridFS,
    getGridFS
};