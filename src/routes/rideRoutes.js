const express = require("express");

const {
    createRide,
    getRide,
    acceptRide,
    completeRide,
    searchRides
} = require("../controllers/rideController");

const protect =
    require("../middleware/authMiddleware");

const {
    validateRide
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    validateRide,
    createRide
);

router.get(
    "/search",
    protect,
    searchRides
);

router.get(
    "/:id",
    protect,
    getRide
);

router.put(
    "/:id/accept",
    protect,
    acceptRide
);

router.put(
    "/:id/complete",
    protect,
    completeRide
);

module.exports = router;