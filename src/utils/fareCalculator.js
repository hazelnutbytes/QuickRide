const calculateFare = (distance) => {
    const baseFare = Number(process.env.BASE_FARE) || 50;
    const farePerKm = Number(process.env.FARE_PER_KM) || 15;
    const surgeMultiplier =
        Number(process.env.SURGE_MULTIPLIER) || 1;

    const totalFare =
        (baseFare + distance * farePerKm) * surgeMultiplier;

    return {
        baseFare,
        farePerKm,
        surgeMultiplier,
        totalFare: Number(totalFare.toFixed(2))
    };
};

module.exports = calculateFare;