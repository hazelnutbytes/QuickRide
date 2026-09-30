const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vehicle: {
            type: String,
            required: true
        },
        vehicleNumber: {
            type: String,
            required: true
        },
        licenseNumber: {
            type: String,
            required: true
        },
        location: {
            latitude: {
                type: Number,
                default: 0
            },
            longitude: {
                type: Number,
                default: 0
            }
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        documents: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Driver", driverSchema);