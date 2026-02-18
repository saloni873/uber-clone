import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
    const navigate = useNavigate()

    const endRide = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                rideId: props.ride?._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                // After finishing, go back to Captain Home
                navigate('/captainHome')
            }
        } catch (err) {
            console.error("Error ending ride:", err)
            alert("Could not end ride. Please try again.")
        }
    }

    return (
        <div>
            {/* Close Panel Icon */}
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => props.setFinishRidePanel(false)}>
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>
            
            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
            
            {/* User Info & Fare Summary */}
           <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
    <div className='flex items-center gap-3 '>
        {/* DYNAMIC USER PHOTO */}
        <img 
            className='h-12 w-12 rounded-full object-cover border-2 border-gray-100' 
            src={props.ride?.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
            alt="User" 
        />
        <h2 className='text-lg font-medium capitalize'>
            {props.ride?.user.fullname.firstname}
        </h2>
    </div>
    <h5 className='text-lg font-semibold'>₹{props.ride?.fare}</h5>
</div>

            {/* Dynamic Location Details */}
            <div className='flex gap-2 justify-between flex-col items-center mt-5'>
                <div className='w-full'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className='text-lg ri-map-pin-2-fill text-green-600'></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm text-gray-600 truncate'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className='text-lg ri-currency-line'></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm text-gray-600'>Payment: Cash</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6 w-full'>
                <button
                    onClick={endRide}
                    className='w-full flex text-lg justify-center bg-green-600 text-white font-semibold p-4 rounded-lg active:scale-95 transition-transform'>
                    Complete Ride
                </button>
                <p className='text-xs text-gray-500 mt-2 text-center'>Clicking "Complete Ride" will finalize the payment and notify the user.</p>
            </div>
        </div>
    )
}

export default FinishRide