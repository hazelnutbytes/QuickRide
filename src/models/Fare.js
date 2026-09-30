const mongoose = require("mongoose");

const fareSchema = new mongoose.Schema(
    {
        distance: {
            type: Number,
            required: true
        },
        baseFare: {
            type: Number,
            required: true
        },
        farePerKm: {
            type: Number,
            required: true
        },
        surgeMultiplier: {
            type: Number,
            default: 1
        },
        totalFare: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Fare", fareSchema);