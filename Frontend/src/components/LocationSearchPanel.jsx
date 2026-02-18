import React from 'react'

const LocationSearchPanel = (props) => {

const handleSuggestionClick = (suggestion) => {
        if (props.activeField === 'pickup') {
            props.setPickup(suggestion.display_name)
        } else if (props.activeField === 'destination') {
            props.setDestination(suggestion.display_name)
        }

        // AUTO-TRIGGER: If user just picked a destination, 
        // and pickup is already filled, calculate the fare.
        if (props.activeField === 'destination') {
             props.findTrip() 
        }
    }

    return (
        <div className='p-2'>
            {
                props.suggestions.map((elem, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleSuggestionClick(elem)} 
                        className='flex items-center my-2 gap-4 active:border-black border-2 border-white p-3 rounded-xl justify-start cursor-pointer'
                    >
                        <h2 className='bg-[#eee] h-10 flex items-center justify-center w-12 rounded-full'>
                            <i className="ri-map-pin-fill"></i>
                        </h2>
                        <h4 className='font-medium text-sm'>{elem.display_name}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel