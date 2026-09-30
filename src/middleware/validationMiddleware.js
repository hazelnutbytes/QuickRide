const validateRide = (req, res, next) => {
    const {
        pickup,
        destination,
        distance
    } = req.body;

    if (!pickup || !destination || distance === undefined) {
        return res.status(400).json({
            message: "Pickup, destination and distance are required"
        });
    }

    if (distance <= 0) {
        return res.status(400).json({
            message: "Distance must be greater than 0"
        });
    }

    next();
};

module.exports = {
    validateRide
};