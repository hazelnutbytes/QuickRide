const Ride = require("../models/Ride");
const Driver = require("../models/Driver");

const calculateFare = require("../utils/fareCalculator");

const createRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            distance
        } = req.body;

        const fareDetails =
            calculateFare(distance);

        const ride = await Ride.create({
            rider: req.user.id,
            pickup,
            destination,
            distance,
            fare: fareDetails.totalFare
        });

        res.status(201).json({
            message: "Ride created successfully",
            ride
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getRide = async (req, res) => {
    try {
        const ride =
            await Ride.findById(req.params.id)
                .populate(
                    "rider",
                    "name email phone"
                )
                .populate({
                    path: "driver",
                    populate: {
                        path: "user",
                        select: "name email phone"
                    }
                });

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found"
            });
        }

        res.json(ride);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const acceptRide = async (req, res) => {
    try {
        const ride =
            await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found"
            });
        }

        if (ride.status !== "pending") {
            return res.status(400).json({
                message: "Ride is no longer available"
            });
        }

        const driver =
            await Driver.findOne({
                user: req.user.id
            });

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        if (!driver.isAvailable) {
            return res.status(400).json({
                message: "Driver is not available"
            });
        }

        ride.driver = driver._id;
        ride.status = "accepted";

        driver.isAvailable = false;

        await ride.save();
        await driver.save();

        res.json({
            message: "Ride accepted",
            ride
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const completeRide = async (req, res) => {
    try {
        const ride =
            await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found"
            });
        }

        if (ride.status !== "accepted") {
            return res.status(400).json({
                message: "Ride cannot be completed"
            });
        }

        ride.status = "completed";

        await ride.save();

        if (ride.driver) {
            await Driver.findByIdAndUpdate(
                ride.driver,
                {
                    isAvailable: true
                }
            );
        }

        res.json({
            message: "Ride completed",
            ride
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const searchRides = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        const rides =
            await Ride.find(filter)
                .populate(
                    "rider",
                    "name email phone"
                )
                .populate({
                    path: "driver",
                    populate: {
                        path: "user",
                        select: "name email phone"
                    }
                });

        res.json(rides);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createRide,
    getRide,
    acceptRide,
    completeRide,
    searchRides
};