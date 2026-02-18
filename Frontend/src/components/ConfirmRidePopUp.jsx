import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                rideId: props.ride._id,
                otp: otp
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                // Redirect captain to the live tracking/riding page
                navigate('/captain-riding', { state: { ride: props.ride } }) 
            }
        } catch (err) {
            console.error("Error starting ride:", err);
            alert("Invalid OTP. Please try again.")
        }
    }

    return (
        <div>
            <h3 className='text-2xl font-semibold mb-5'>Enter OTP to Start Ride</h3>
            <form onSubmit={submitHandler}>
                <input 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text" 
                    placeholder='1234' 
                    className='bg-[#eee] px-6 py-4 text-lg font-mono tracking-widest rounded-lg w-full mt-3' 
                />
                <button className='w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>
                    Start Trip
                </button>
                <button 
                    type="button"
                    onClick={() => props.setConfirmRidePopupPanel(false)} 
                    className='w-full mt-2 bg-red-500 text-white font-semibold p-3 rounded-lg'
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp