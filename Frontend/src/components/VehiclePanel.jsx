import React from 'react'

const VehiclePanel = (props) => {
    // Assuming props.fare directly contains { auto, car, moto }
    // If your backend also sends distance/duration in the same object:
    const durationInMinutes = props.fare?.duration ? Math.round(props.fare.duration / 60) : 5;

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => props.setVehiclePanelOpen(false)}>
                <i className='text-3xl text-gray-300 ri-arrow-down-wide-line'></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Choose a vehicle</h3>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-12' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n" alt="Car" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-sm'>UberGo <span><i className='ri-user-3-fill'></i>4</span></h4>
                    <h5 className='font-medium text-sm'>{durationInMinutes} min away</h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                </div>
                {/* FIXED: Removed .fares nesting */}
                <h2 className='text-lg font-semibold'>₹{props.fare?.car || 0}</h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-12' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mY2RkZWNhYS0yZWVlLTQ4ZmUtODdmMC02MTRhYTdjZWU3ZDMucG5n" alt="Moto" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-sm'>Moto <span><i className='ri-user-3-fill'></i>1</span></h4>
                    <h5 className='font-medium text-sm'>{durationInMinutes + 2} min away</h5>
                    <p className='font-normal text-xs text-gray-600'>Quick and cheap bike rides</p>
                </div>
                {/* FIXED: Removed .fares nesting */}
                <h2 className='text-lg font-semibold'>₹{props.fare?.moto || 0}</h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-12' src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n" alt="Auto" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-sm'>UberAuto <span><i className='ri-user-3-fill'></i>3</span></h4>
                    <h5 className='font-medium text-sm'>{durationInMinutes + 1} min away</h5>
                    <p className='font-normal text-xs text-gray-600'>No-bargain auto rides</p>
                </div>
                {/* FIXED: Removed .fares nesting */}
                <h2 className='text-lg font-semibold'>₹{props.fare?.auto || 0}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel