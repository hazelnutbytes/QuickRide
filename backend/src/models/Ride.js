const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        rider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },
        pickup: {
            address: {
                type: String,
                required: true
            },
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        destination: {
            address: {
                type: String,
                required: true
            },
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        distance: {
            type: Number,
            required: true
        },
        fare: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Ride", rideSchema);