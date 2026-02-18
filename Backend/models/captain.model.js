const mongoose = require('mongoose');
const { collection } = require('./user.model');
const jwt =  require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3 , 'First name must be at least 3 characters long'],
        },
        lastname:{
            type:String,
            minlength:[3 , 'First name must be at least 3 characters long'],
        }
    },
    email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            match:[/\S+@\S+\.\S+/ , 'Invalid Email'],
            minlength:[5 , 'Email must be at least 5 characters long'],
        },
    
    profilePanel: {
        type: String,
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
    },
    password:{
            type:String,
            required:true,
            select:false,
        
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum:['available' , 'unavailable'],
        default:'unavailable'
    },
    vehicles:{
        color: {
        type: String,
        required:true,
        },
        plate:{
            type:String,
            required:true,
        },
        capacity:{
            type:Number,
            required:true,
            min:[1 , 'Capacity must be at least 1'],
        },
        vehicleType:{
        type:String,
        enum:[ 'car' , 'moto' , 'auto'],
        required:true,
       }
    },
    location: {
    type: {
        type: String,
        enum: ['Point'], // Must be 'Point'
        default: 'Point'
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
    }
}
    
    
})

captainSchema.index({ location: '2dsphere' });

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id} , process.env.JWT_SECRET , {expiresIn:'24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password , 10);
}

const captainModel = mongoose.model('captain' , captainSchema);

module.exports = captainModel;