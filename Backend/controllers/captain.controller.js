const captainModel = require('../models/captain.model');
const {validationResult} = require('express-validator');
const captainService = require('../services/captain.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
const rideModel = require('../models/ride.model');
module
.exports.registerCaptain = async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {fullname , email , password , vehicle} = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({email}); 
    if(isCaptainAlreadyExist){
        return res.status(400).json({message:'Captain with this email already exists'});
    }
    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    }); 

    const token = captain.generateAuthToken();
    res.status(201).json({token , captain});


}  

module.exports.loginCaptain = async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    console.log("Login attempt for:", req.body.email);
    const {email , password} = req.body;
    const captain = await captainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(404).json({message:"Captain not found"});
    }
    const isPasswordValid = await captain.comparePassword(password);
    if(!isPasswordValid){
        return res.status(401).json({message:"Invalid password"});
    }   
    const token = captain.generateAuthToken();
    res.cookie('token' , token);
    res.status(200).json({token , captain});
}

module.exports.getCaptainProfile = async (req , res) => {
    res.status(200).json({captain:req.captain});
}

module.exports.logoutCaptain = async (req , res) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports.getEarnings = async (req, res) => {
    try {
        const rides = await rideModel.find({
            captain: req.captain._id,
            status: 'completed'
        });

        const totalEarnings = rides.reduce((acc, ride) => acc + ride.fare, 0);
        const totalRides = rides.length;

        res.status(200).json({
            totalEarnings,
            totalRides,
            rides // optional: send recent rides list
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};