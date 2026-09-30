const express = require("express");

const {
    getDrivers,
    updateLocation,
    uploadDocument
} = require("../controllers/driverController");

const protect =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    getDrivers
);

router.put(
    "/:id/location",
    protect,
    updateLocation
);

router.post(
    "/documents",
    protect,
    upload.single("document"),
    uploadDocument
);

module.exports = router;