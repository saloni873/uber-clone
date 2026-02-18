const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

/**
 * Calculates fares for all vehicle types based on pickup and destination.
 * This is used for the "Fare Estimate" screen.
 */
async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // Single call to get distance and time
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const distanceInMeters = distanceTime.distance; 
    const durationInSeconds = distanceTime.duration; 

    // Pricing configuration
    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    const fares = {
        auto: Math.round(baseFare.auto + ((distanceInMeters / 1000) * perKmRate.auto) + ((durationInSeconds / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceInMeters / 1000) * perKmRate.car) + ((durationInSeconds / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceInMeters / 1000) * perKmRate.moto) + ((durationInSeconds / 60) * perMinuteRate.moto))
    };

    return fares;
}

/**
 * Generates a numeric OTP for ride verification.
 */
function getOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
}

/**
 * Optimized createRide: Minimizes API calls to avoid "Rate Limited" (429) errors.
 */
async function createRide({ user, pickup, destination, vehicleType }) {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // 1. Fetch distance and duration from Map Service (1 API call)
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    // 2. Local Pricing Logic (No extra API calls)
    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    const fareValue = Math.round(
        baseFare[vehicleType] + 
        ((distanceTime.distance / 1000) * perKmRate[vehicleType]) + 
        ((distanceTime.duration / 60) * perMinuteRate[vehicleType])
    );

    // 3. Create the Ride in Database
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fareValue, 
        duration: distanceTime.duration,
        distance: distanceTime.distance
    });

    return ride;
}

/**
 * Confirms a ride: assigns a captain and updates status.
 */
async function confirmRide({ rideId, captain }) {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    // Update the ride in the database
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    });

    // Retrieve the updated ride with populated details to notify the user
    // We select '+otp' because usually OTP is hidden, but the user needs it now
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}

/**
 * Verifies OTP and starts the ride.
 */
async function startRide({ rideId, otp, captain }) {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    // Find the ride and include the hidden OTP field for verification
    const ride = await rideModel.findOne({
    _id: rideId
}).populate('user').populate('captain').select('+otp'); 

console.log("OTP from DB:", ride.otp); 
console.log("OTP from Captain:", otp);

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp.toString() !== otp.toString()) {
    throw new Error('Invalid OTP');
}

    // Update status to 'ongoing'
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    });

    return ride;
}

// Add to ride.service.js
async function endRide({ rideId, captain }) {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOneAndUpdate({
        _id: rideId,
        captain: captain._id // Security check: Ensure only the assigned captain can end it
    }, {
        status: 'completed'
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}
// Don't forget to update your exports!
module.exports = { 
    getFare, 
    getOtp, 
    createRide,
    confirmRide,
    startRide,
    endRide
};
