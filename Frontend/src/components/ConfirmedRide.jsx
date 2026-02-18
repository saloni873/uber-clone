
import React from 'react'
import axios from 'axios'

const ConfirmedRide = (props) => {

    // Dynamic images based on the vehicle selected
    const vehicleImages = {
        car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n",
        moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mY2RkZWNhYS0yZWVlLTQ4ZmUtODdmMC02MTRhYTdjZWU3ZDMucG5n",
        auto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
    }

    // FUNCTION TO CREATE RIDE IN BACKEND
    const createRide = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup: props.pickup,
                destination: props.destination,
                vehicleType: props.vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            // On success, switch panels
            props.setVehicleFound(true)
            props.setConfirmRidePanel(false)

        } catch (error) {
            console.error("Ride Creation Error:", error)
            alert("Something went wrong. Could not create ride.")
        }
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' 
                onClick={() => props.setConfirmRidePanel(false)}>
                <i className='text-3xl text-gray-300 ri-arrow-down-wide-line'></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5'>Confirm your ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src={vehicleImages[props.vehicleType] || vehicleImages.car} alt="Vehicle" />

                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className='text-lg ri-map-pin-user-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className='text-lg ri-map-pin-2-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3'>
                        <i className='ri-currency-line'></i>
                        <div>
                            {/* Safety check for fare access */}
                            <h3 className='text-lg font-medium'>
                                ₹{props.fare && props.vehicleType ? props.fare[props.vehicleType] : '0'}
                            </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash/Online Payment</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={createRide} 
                    className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg text-lg'>
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default ConfirmedRide