import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    const [ captainLocation, setCaptainLocation ] = useState(null)
    const [ rideFinished, setRideFinished ] = useState(false) 

    useEffect(() => {
        socket.on('captain-location-updated', (data) => {
            if (ride && data.captainId === ride.captain?._id) {
                setCaptainLocation(data.location)
            }
        })

       
        socket.on('ride-ended', () => {
            setRideFinished(true) 
            
            
            setTimeout(() => {
                navigate('/home')
            }, 3000)
        })

        return () => {
            socket.off('captain-location-updated')
            socket.off('ride-ended')
        }
    }, [ socket, ride, navigate ])

    return (
        <div className='h-screen overflow-hidden'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-1000 shadow-lg'>
                <i className="text-xl font-medium ri-home-4-fill"></i>
            </Link>

            <div className='h-1/2 w-full relative z-0'>
                <LiveTracking captainLocation={captainLocation} />
            </div>

            <div className='h-1/2 p-4 bg-white relative z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]'>
                {rideFinished ? (
                    // SHOW WHEN RIDE IS DONE
                    <div className='flex flex-col items-center justify-center h-full text-center'>
                        <i className="ri-checkbox-circle-fill text-7xl text-green-500"></i>
                        <h2 className='text-2xl font-bold mt-4'>Ride Completed!</h2>
                        <p className='text-gray-600 mt-2'>Hope you had a great trip with {ride?.captain.fullname.firstname}.</p>
                        <p className='text-sm text-gray-400 mt-4'>Redirecting to home...</p>
                    </div>
                ) : (
                    // NORMAL VIEW DURING RIDE
                    <>
                        <div className='flex items-center justify-between'>
                            <img className='h-12' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82NDkzYzI1NS04N2M4LTRlMmUtOTQyOS1jZjcwOWJmMWI4MzgucG5n" alt="" />
                            <div className='text-right'>
                                <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                                <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicles.plate}</h4>
                                <p className='text-sm font-semibold text-gray-500 capitalize'>{ride?.captain.vehicles.vehicleType}</p>
                            </div>
                        </div>

                        <div className='flex gap-2 justify-between flex-col items-center mt-2'>
                            <div className='w-full'>
                                <div className='flex items-center gap-5 p-3 border-b-2'>
                                    <i className='text-lg ri-map-pin-2-fill text-green-600'></i>
                                    <div>
                                        <h3 className='text-lg font-medium'>Destination</h3>
                                        <p className='text-base text-gray-600'>{ride?.destination}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 p-3'>
                                    <i className='text-lg ri-currency-line text-gray-700'></i>
                                    <div>
                                        <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                                        <p className='text-base text-gray-600'>Payment Method: Cash</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <button className='w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>
                            Make a Payment
                        </button> */}
                    </>
                )}
            </div>
        </div>
    )
}

export default Riding