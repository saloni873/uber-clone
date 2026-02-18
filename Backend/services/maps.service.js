const axios = require('axios');
const captainModel = require('../models/captain.model');

// TOOL 1: Get Coordinates using Nominatim (Free)
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp' } // Required by Nominatim policy
        });

        if (response.data && response.data.length > 0) {
            return {
                ltd: parseFloat(response.data[0].lat), 
                lng: parseFloat(response.data[0].lon)  
            };
        }
        throw new Error('Coordinates not found');
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        throw error;
    }
};

// TOOL 2: Get Distance and Time using OSRM (Free)
module.exports.getDistanceTime = async (origin, destination) => {
    try {
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destinationCoords = await module.exports.getAddressCoordinate(destination);

        // OSRM Public API (Free)
        const url = `http://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destinationCoords.lng},${destinationCoords.ltd}?overview=false`;
        
        const response = await axios.get(url);

        if (response.data && response.data.routes && response.data.routes.length > 0) {
            return {
                distance: response.data.routes[0].distance, // in meters
                duration: response.data.routes[0].duration, // in seconds
            };
        }
        
        throw new Error('Unable to fetch distance and time');
    } catch (err) {
        console.error("OSRM Error:", err.message);
        throw err;
    }
};

// TOOL 3: Get Autocomplete Suggestions using Nominatim (Free)
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) throw new Error('Input is required');
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1&limit=5`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp' }
        });

        return response.data.map(item => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon
        }));
    } catch (err) {
        console.error("Autocomplete Error:", err.message);
        throw err;
    }
};

// TOOL 4: Get Captains (Logic remains same, but ensure coordinates are numbers)
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius is in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ parseFloat(lng), parseFloat(ltd) ], radius / 6371 ]
            }
        }
    });

    return captains;
};