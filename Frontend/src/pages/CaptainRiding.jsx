import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link, useLocation} from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import { SocketContext } from '../context/SocketContext'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    
    
   
    const rideData = location.state?.ride 
    
    const { socket } = useContext(SocketContext)
    const [currentLocation, setCurrentLocation] = useState(null)

    // 1. Track Captain's location and emit to User via Socket
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLocation = { ltd: latitude, lng: longitude };
                
                setCurrentLocation(newLocation);

                
                socket.emit('update-location-captain', {
                    userId: rideData?.captain._id || rideData?.captain,
                    location: newLocation
                });
            },
            (error) => console.error("Geolocation Error:", error),
            { 
                enableHighAccuracy: true, 
                distanceFilter: 10 
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [socket, rideData]);

    
    useGSAP(function () {
        gsap.to(finishRidePanelRef.current, {
            transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)',
            duration: 0.5,
            ease: "power2.inOut"
        })
    }, [finishRidePanel])

    return (
        <div className='h-screen relative flex flex-col justify-end overflow-hidden'>
            
            {/* Header: Displays Passenger Info to Captain */}
            <div className='fixed top-0 left-0 w-full p-5 z-1000 flex items-center justify-between pointer-events-none'>
                <div className='flex items-center gap-3 bg-white/90 p-2 px-4 rounded-full shadow-md pointer-events-auto'>
                    <img 
                        className='h-10 w-10 rounded-full object-cover border-2 border-yellow-400' 
                        src={rideData?.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                        alt="User" 
                    />
                    <h2 className='text-sm font-semibold capitalize'>
                        {rideData?.user?.fullname?.firstname || "Passenger"}
                    </h2>
                </div>
                
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md pointer-events-auto'>
                    <i className="text-lg font-medium ri-home-4-line"></i>
                </Link>
            </div>

            {/* Live Map Background */}
            <div className='h-screen absolute top-0 w-full z-0'>
                <LiveTracking captainLocation={currentLocation} />
            </div>

            {/* Trip Action Bar (Yellow) */}
            <div 
                className='h-[20%] p-6 flex items-center justify-between relative bg-yellow-400 pt-10 z-10 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)]'
                onClick={() => setFinishRidePanel(true)}
            >
                <h5 className='p-1 text-center w-full absolute top-0'>
                    <i className="text-3xl text-yellow-800 ri-arrow-up-wide-line"></i>
                </h5>
                <div className='flex flex-col'>
                    <h4 className='text-xl font-bold'>4 KM Away</h4>
                    <p className='text-sm text-yellow-900 font-medium truncate w-40'>
                        To: {rideData?.destination}
                    </p>
                </div>
                <button className='bg-black text-white font-semibold p-3 px-8 rounded-xl'>
                    Complete Ride
                </button>
            </div>

            {/* Finish Ride Sliding Panel */}
            <div ref={finishRidePanelRef} className='fixed w-full z-1010 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-2xl rounded-t-3xl'>
                <FinishRide 
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} 
                />
            </div>
        </div>
    )
}

export default CaptainRiding