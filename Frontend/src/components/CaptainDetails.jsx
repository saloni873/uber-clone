import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)
    const [earningsData, setEarningsData] = useState({ totalEarnings: 0, totalRides: 0 })

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/earnings`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEarningsData(response.data);
            } catch (err) {
                console.error("Error fetching earnings:", err);
            }
        };

        fetchEarnings();
    }, []);

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-gray-200' src={captain?.profilePanel} alt="" />
                    <div>
                        <h4 className='text-lg font-medium capitalize'>{captain?.fullname.firstname} {captain?.fullname.lastname}</h4>
                        <p className='text-sm text-gray-600'>Level 1 Captain</p>
                    </div>
                </div>
                <div className='text-right'>
                    {/* DYNAMIC EARNINGS */}
                    <h4 className='text-xl font-bold'>₹{earningsData.totalEarnings.toFixed(2)}</h4>
                    <p className='text-sm text-gray-600'>Total Earned</p>
                </div>
            </div>

            <div className='flex p-4 mt-8 bg-gray-50 rounded-2xl justify-around items-center shadow-sm'>
                <div className='text-center'>
                    <i className="text-2xl mb-2 ri-booklet-line text-blue-600"></i>
                    <h5 className='text-lg font-semibold'>{earningsData.totalRides}</h5>
                    <p className='text-xs text-gray-500 uppercase'>Rides</p>
                </div>
                <div className='text-center border-x px-8'>
                    <i className="text-2xl mb-2 ri-timer-2-line text-green-600"></i>
                    <h5 className='text-lg font-semibold'>12.5</h5>
                    <p className='text-xs text-gray-500 uppercase'>Hours</p>
                </div>
                <div className='text-center'>
                    <i className="text-2xl mb-2 ri-star-line text-yellow-500"></i>
                    <h5 className='text-lg font-semibold'>4.8</h5>
                    <p className='text-xs text-gray-500 uppercase'>Rating</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails