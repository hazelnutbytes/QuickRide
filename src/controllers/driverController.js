const Driver = require("../models/Driver");
const { bucket } = require("../config/firebase");

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
        if (!bucket) {
            return res.status(500).json({
                message: "Firebase Storage is not configured"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            });
        }

        const fileName =
            `driver-documents/${Date.now()}-${req.file.originalname}`;

        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
            metadata: {
                contentType: req.file.mimetype
            }
        });

        const driver =
            await Driver.findOneAndUpdate(
                {
                    user: req.user.id
                },
                {
                    documents: fileName
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
};

module.exports = {
    getDrivers,
    updateLocation,
    uploadDocument
};