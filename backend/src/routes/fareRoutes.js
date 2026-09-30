const express = require("express");

const {
    estimateFare
} = require("../controllers/fareController");

const router = express.Router();

router.get(
    "/estimate",
    estimateFare
);

module.exports = router;