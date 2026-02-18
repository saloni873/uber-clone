import React from 'react'
import axios from 'axios'

const RidePopUp = (props) => {

    // Function to confirm the ride in the backend (Accept button)
    const confirmRide = async () => {
        // Safety Check: Prevents the "reading _id of null" error
        if (!props.ride || !props.ride._id) {
            console.error("No ride data available to confirm.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: props.ride._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                // Successfully confirmed: switch to the OTP/Confirmation panel
                props.setConfirmRidePopupPanel(true)
                props.setRidePopupPanel(false)
            }
        } catch (err) {
            console.error("Error confirming ride:", err)
        }
    }

    return (
        <div>
            {/* Slide Down Handle */}
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => props.setRidePopupPanel(false)}>
                <i className='text-3xl text-gray-300 ri-arrow-down-wide-line'></i>
            </h5>
            
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!!</h3>
             
            {/* User Details Section */}
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-2'>
                <div className='flex items-center gap-3'>
    {/* DYNAMIC USER PROFILE PIC */}
    <img 
        className='h-12 w-12 rounded-full object-cover border-2 border-gray-100' 
        src={props.ride?.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
        alt="User Profile" 
    />
    
    <div className='flex flex-col'>
        <h2 className='text-lg font-medium capitalize leading-tight'>
            {props.ride?.user?.fullname ? 
                `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname}` 
                : "Passenger"}
        </h2>
        <p className='text-xs text-gray-500'>Passenger</p>
    </div>
</div>
                {/* Distance calculated from ride data */}
                <h5 className='text-lg font-semibold'>
                    {props.ride?.distance ? (props.ride.distance / 1000).toFixed(1) : "0"} KM
                </h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-2'>
                    {/* Pickup Information */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className='text-lg ri-map-pin-user-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>

                    {/* Destination Information */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className='text-lg ri-map-pin-2-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>

                    {/* Fare Information */}
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex w-full items-center justify-between gap-4 mt-5'>
                    <button 
                        onClick={confirmRide}
                        className='w-full bg-green-600 text-white font-semibold p-3 px-10 rounded-lg active:scale-95 transition-transform'
                    >
                        Accept
                    </button>
                    
                    <button 
                        onClick={() => {
                            // Close panel and clear ride state so the captain doesn't see "View Request" anymore
                            props.setRidePopupPanel(false);
                            if(props.setRide) props.setRide(null); 
                        }} 
                        className='w-full bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg active:scale-95 transition-transform'
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp