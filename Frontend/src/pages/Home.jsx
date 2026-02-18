import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmedRide from '../components/ConfirmedRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import LiveTracking from '../components/LiveTracking' // Import the new Map component
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

let timeoutId;

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [ride, setRide] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    
    // State for live captain tracking
    const [captainLocation, setCaptainLocation] = useState(null)

    const navigate = useNavigate()

    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        if (user) {
            socket.emit("join", { userType: "user", userId: user._id })
        }
    }, [user, socket])

    useEffect(() => {
        socket.on('ride-confirmed', (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        })

        socket.on('ride-started', (ride) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } }) 
        })

        // NEW: Listener for live captain movement
        socket.on('captain-location-updated', (data) => {
            // Verify if the moving captain is the one assigned to our ride
            if (ride && data.captainId === ride.captain?._id) {
                setCaptainLocation(data.location)
            }
        })

        return () => {
            socket.off('ride-confirmed')
            socket.off('ride-started')
            socket.off('captain-location-updated')
        }
    }, [socket, navigate, ride])

    // ... handlePickupChange and handleDestinationChange remain the same ...
    const handlePickupChange = async (e) => {
        const value = e.target.value;
        setPickup(value);
        clearTimeout(timeoutId);
        if (value.length >= 3) {
            timeoutId = setTimeout(async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                        params: { input: value },
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setSuggestions(response.data);
                } catch (err) { console.log(err) }
            }, 300);
        } else { setSuggestions([]); }
    };

    const handleDestinationChange = async (e) => {
        const value = e.target.value;
        setDestination(value);
        clearTimeout(timeoutId);
        if (value.length >= 3) {
            timeoutId = setTimeout(async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                        params: { input: value },
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setSuggestions(response.data);
                } catch (err) { console.log(err) }
            }, 300);
        } else { setSuggestions([]); }
    };

    const findTrip = async () => {
        if (!pickup || !destination) {
            alert("Please select locations");
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFare(response.data);
            setVehiclePanelOpen(true);
            setPanelOpen(false);
        } catch (err) { console.error(err); }
    };

    // GSAP animations remain the same
    useGSAP(() => {
        gsap.to(panelRef.current, { height: panelOpen ? '70%' : '0%', padding: panelOpen ? 24 : 0 })
        gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0 })
    }, [panelOpen])

    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, { transform: vehiclePanelOpen ? 'translateY(0)' : 'translateY(100%)' })
    }, [vehiclePanelOpen])

    useGSAP(() => {
        gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [confirmRidePanel])

    useGSAP(() => {
        gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)' })
    }, [vehicleFound])

    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)' })
    }, [waitingForDriver])

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5 z-1000' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
            
            {/* UPDATED: Integrated LiveTracking Map */}
            <div className='h-screen w-screen z-0'>
                <LiveTracking captainLocation={captainLocation} />
            </div>

            <div className='flex flex-col justify-end h-screen absolute bottom-0 w-full z-1010 pointer-events-none'>
                <div className='h-[30%] p-6 bg-white relative pointer-events-auto'>
                    <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className='absolute opacity-0 right-6 top-6 text-2xl cursor-pointer'>
                        <i className="ri-arrow-down-s-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => e.preventDefault()}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-[50%] left-5 bg-gray-700 rounded-full"></div>
                        <input onClick={() => { setPanelOpen(true); setActiveField('pickup') }} value={pickup} onChange={handlePickupChange} className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5' type="text" placeholder='Add a pickup location' />
                        <input onClick={() => { setPanelOpen(true); setActiveField('destination') }} value={destination} onChange={handleDestinationChange} className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' type="text" placeholder='Enter your destination' />
                    </form>
                    <button onClick={findTrip} className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>Find Trip</button>
                </div>
                <div ref={panelRef} className='bg-white h-0 pointer-events-auto overflow-hidden'>
                    <LocationSearchPanel suggestions={suggestions} setPickup={setPickup} setDestination={setDestination} activeField={activeField} setPanelOpen={setPanelOpen} findTrip={findTrip} />
                </div>
            </div>

            {/* Panel Z-index adjustment to be above Leaflet (which uses 1000 range) */}
            <div ref={vehiclePanelRef} className='fixed w-full z-1100 bg-white bottom-0 translate-y-full px-3 py-10 pt-12 shadow-2xl'>
                <VehiclePanel fare={fare} selectVehicle={setVehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanelOpen={setVehiclePanelOpen} />
            </div>

            <div ref={confirmRidePanelRef} className='fixed w-full z-1100 bg-white bottom-0 translate-y-full px-3 py-10 pt-12 shadow-2xl'>
                <ConfirmedRide pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>

            <div ref={vehicleFoundRef} className='fixed w-full z-1100 bg-white bottom-0 translate-y-full px-3 py-10 pt-12 shadow-2xl'>
                <LookingForDriver pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-1100 bg-white bottom-0 translate-y-full px-3 py-10 pt-12 shadow-2xl'>
                <WaitingForDriver ride={ride} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home