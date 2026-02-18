import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.stockcake.com/public/0/8/8/088e973a-373f-4c60-899d-eb979cfb060f_large/busy-night-traffic-stockcake.jpg)] h-screen pt-8 flex justify-between flex-col w-full '>
        <img className='w-16 ml-8 ' src="https://www.edigitalagency.com.au/wp-content/uploads/new-Uber-logo-white-png-large-size.png" alt="" />
        <div className='bg-white pb-7 py-4 px-4'>
          <h2 className='text-2xl font-bold'>Get Started With Uber</h2>
          <Link to="/Userlogin" className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start 
