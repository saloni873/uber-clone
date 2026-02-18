const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service'); 
const { sendMessageToSocketId } = require('../socket'); 
const userModel = require('../models/user.model'); 
const captainModel = require('../models/captain.model'); // Added to query captains directly

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // 1. Create the ride (uses rideService for distance and fare)
        const ride = await rideService.createRide({
            user: req.user._id, 
            pickup,
            destination,
            vehicleType
        });

        // 2. Respond to the user IMMEDIATELY to prevent timeouts
        res.status(201).json(ride);

        // 3. Notify ALL online captains
        setTimeout(async () => {
            try {
                /**
                 * MODIFIED: Instead of finding captains in a radius, 
                 * we find ALL captains with an active socketId.
                 */
                const allOnlineCaptains = await captainModel.find({ 
                    socketId: { $exists: true, $ne: null } 
                });

                console.log(`Found ${allOnlineCaptains.length} online captains to notify.`);

                // Prepare ride data for socket broadcast
                ride.otp = ""; 
                const rideWithUser = await ride.populate('user');

                // Send the message to every online captain
                allOnlineCaptains.forEach(captain => {
                    sendMessageToSocketId(captain.socketId, {
                        event: 'new-ride',
                        data: rideWithUser
                    });
                });
                
                console.log("All online captains notified successfully");

            } catch (bgError) {
                console.error("Background Notification Error:", bgError.message);
            }
        }, 500); // Small delay to separate from the initial request

    } catch (err) {
        console.log("Creation Error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Add this to your ride.controller.js
// Add this function to your existing ride.controller.js
// Add this to the bottom of ride.controller.js
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.body;

    try {
        // This calls the service where we added the console.logs
        const ride = await rideService.startRide({ 
            rideId, 
            otp, 
            captain: req.captain 
        });

        // Notify the User that the trip has started
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.log("Start Ride Error:", err.message);
        return res.status(400).json({ message: err.message });
    }
};

// Also ensure confirmRide is present
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        // Notify the user that the ride has ended
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};