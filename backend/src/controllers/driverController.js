const Driver = require("../models/Driver");
const { getGridFS } = require("../config/gridfs");

const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate("user", "name email phone");

        res.json(drivers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateLocation = async (req, res) => {
    try {
        const {
            latitude,
            longitude
        } = req.body;

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const driver =
            await Driver.findByIdAndUpdate(
                req.params.id,
                {
                    location: {
                        latitude,
                        longitude
                    }
                },
                {
                    new: true
                }
            );

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        res.json({
            message: "Driver location updated",
            driver
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            });
        }

        const gridfsBucket = getGridFS();

        const fileName =
            `${Date.now()}-${req.file.originalname}`;

        const uploadStream =
            gridfsBucket.openUploadStream(
                fileName,
                {
                    contentType: req.file.mimetype
                }
            );

        uploadStream.end(req.file.buffer);

        uploadStream.on("finish", async () => {
            try {
                const driver =
                    await Driver.findOneAndUpdate(
                        {
                            user: req.user.id
                        },
                        {
                            documents: {
                                fileId: uploadStream.id,
                                fileName: fileName
                            }
                        },
                        {
                            new: true
                        }
                    );

                if (!driver) {
                    return res.status(404).json({
                        message: "Driver profile not found"
                    });
                }

                res.json({
                    message: "Document uploaded successfully",
                    driver
                });
            } catch (error) {
                res.status(500).json({
                    message: error.message
                });
            }
        });

        uploadStream.on("error", (error) => {
            res.status(500).json({
                message: error.message
            });
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getDrivers,
    updateLocation,
    uploadDocument
};