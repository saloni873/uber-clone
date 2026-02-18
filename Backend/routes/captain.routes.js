const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post('/register' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 characters long'),
    body('vehicle.color').isString().withMessage('Vehicle color is required'),
    body('vehicle.plate').isString().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isNumeric().withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car' , 'moto' , 'auto']).withMessage('Invalid vehicle type'),
],
    captainController.registerCaptain
)


router.post('/login' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be 6 characters long'),
],
    captainController.loginCaptain
)

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

router.get('/earnings', authMiddleware.authCaptain, captainController.getEarnings);
    module.exports = router;