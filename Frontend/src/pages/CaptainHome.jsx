import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import LiveTracking from '../components/LiveTracking'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainHome = () => {
    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride, setRide] = useState(null)
    
    // State to track captain's own location for the map
    const [currentLocation, setCurrentLocation] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    // 1. Join Socket Room & Start Location Updates
    useEffect(() => {
        if (captain) {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            })

            // Real-time location tracking using Browser API
            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const locationData = {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                        
                        setCurrentLocation(locationData)

                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: locationData
                        })
                    })
                }
            }

            // Update location every 10 seconds
            const locationInterval = setInterval(updateLocation, 10000)
            updateLocation() // Initial call

            return () => clearInterval(locationInterval)
        }
    }, [captain, socket])

    // 2. Listen for New Ride & Cancellations
    useEffect(() => {
        socket.on('new-ride', (data) => {
            setRide(data)
            setRidePopupPanel(true)
        })

        socket.on('ride-cancelled', () => {
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(false)
            setRide(null)
        })

        return () => {
            socket.off('new-ride')
            socket.off('ride-cancelled')
        }
    }, [socket])

    // Animations
    useGSAP(function () {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)'
        })
    }, [ridePopupPanel])

    useGSAP(function () {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)'
        })
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen overflow-hidden'>
            {/* Header */}
            <div className='fixed top-0 left-0 w-full p-5 z-1000 pointer-events-none flex items-center justify-between'>
                <img className='w-16 pointer-events-auto' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
                <Link to='/captain-login' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-1000 pointer-events-auto'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {/* UPDATED: Map Section */}
            <div className='h-3/5 w-full z-0'>
                <LiveTracking captainLocation={currentLocation} />
            </div>

            {/* Captain UI Section */}
            <div className='h-2/5 p-6 bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] relative z-10'>
                <CaptainDetails />
                <button 
                    onClick={() => setRidePopupPanel(true)} 
                    disabled={!ride} 
                    className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl mt-3 font-semibold transition-transform active:scale-95 ${!ride ? 'bg-gray-200 text-gray-400' : 'bg-black text-white'}`}
                >
                    <i className="ri-list-check"></i>
                    {ride ? "View New Ride Request" : "Waiting for Requests..."}
                </button>
            </div>

            {/* PANEL 1: New Ride Arrival */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-1100 bg-white bottom-0 translate-y-full px-3 py-10 pt-12 shadow-2xl rounded-t-3xl'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                />
            </div>

            {/* PANEL 2: Final Confirmation (OTP) */}
            <div ref={confirmRidePopupPanelRef} className='fixed w-full z-1100 bg-white bottom-0 translate-y-full px-3 py-10 pt-12 shadow-2xl rounded-t-3xl'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome