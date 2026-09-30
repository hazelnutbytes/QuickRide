const Fare = require("../models/Fare");
const calculateFare = require("../utils/fareCalculator");

const estimateFare = async (req, res) => {
    try {
        const distance = Number(req.query.distance);

        if (!distance || distance <= 0) {
            return res.status(400).json({
                message: "Valid distance is required"
            });
        }

        const fare = calculateFare(distance);

        const savedFare = await Fare.create({
            distance,
            ...fare
        });

        res.json({
            message: "Fare estimated successfully",
            fare: savedFare
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    estimateFare
};