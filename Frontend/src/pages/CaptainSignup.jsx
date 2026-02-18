import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
const CaptainSignup = () => {
    const navigate = useNavigate();

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [firstName , setFirstName] = useState('');
    const [lastName , setLastName] = useState('');
    

    const [vehicleColor , setVehicleColor] = useState('');
    const [vehiclePlate , setVehiclePlate] = useState('');
    const [vehicleCapacity , setVehicleCapacity] = useState('');
    const [vehicleType , setVehicleType] = useState('');

    const {setCaptain} = React.useContext(CaptainDataContext);
  
    const submitHandler = async (e) => {
      e.preventDefault();

            const captainData = {
        fullname : {
          firstname :firstName,
          lastname : lastName,
        },
        email,
        password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType: vehicleType
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
      
      if(response.status === 201){
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/CaptainHome');
      }

      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setVehicleColor('');
      setVehiclePlate('');
      setVehicleCapacity('');
      setVehicleType('');

    }
  return(
      
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-base font-medium mb-2'>What's your name?</h3>
          <div className='flex gap-2 mb-5'>
            <input 
          className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-5m' 
          required 
          type="name" 
          placeholder='First Name'
          value={firstName} 
          onChange={(e)=>{
            setFirstName(e.target.value)
          }}/>
          <input 
          className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-5m' 
          type="name" 
          placeholder='Last Name'
           value={lastName} 
          onChange={(e)=>{
            setLastName(e.target.value)
          }} />
        </div>
  
          
  
          <h3 className='text-base font-medium mb-2'>What's your email?</h3>
          <input 
          className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-5m' 
          required 
          type="email" 
          placeholder='email@example.com'
          value={email} 
          onChange={(e)=>{
            setEmail(e.target.value)
          }} />
          
          <h3 
          className='text-base font-medium mb-2'>Enter Password</h3>
          
          <input 
          className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-5m' 
          required 
          type="password" 
          placeholder='Password'
          value={password} 
          onChange={(e)=>{
            setPassword(e.target.value)
          }}/>

          <h3 
          className='text-base font-medium mb-2'>Vehicle Information</h3>
          
          <div className='flex gap-4 mb-7'>
            <input
          className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-5m' 
          required 
          type="text" 
          placeholder='Vehicle Color'
          value={vehicleColor} 
          onChange={(e)=>{
            setVehicleColor(e.target.value)
          }}/>

          <input
          className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-5m' 
          required 
          type="text" 
          placeholder='Vehicle Plate'
          value={vehiclePlate} 
          onChange={(e)=>{
            setVehiclePlate(e.target.value)
          }}/>
    </div>

            
          <div className='flex gap-4 mb-7'>
            <input
          className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-5m' 
          required 
          type="number" 
          placeholder='Vehicle Capacity'
          value={vehicleCapacity} 
          onChange={(e)=>{
            setVehicleCapacity(e.target.value)
          }}/>

          <select 
          required
           className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-5m' 
           name="vehicleType" 
           id="vehicleType"
           value={vehicleType} 
           onChange={(e)=>{
            setVehicleType(e.target.value)
          }}>
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>

      </div>

          <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>Register</button>
  
        </form>
        <p className='text-center'>Already have an account ? <Link to='/Captainlogin' className='text-blue-600'>Login Here</Link></p>
        </div>
        
        
        
      </div>
    )
} 

export default CaptainSignup
