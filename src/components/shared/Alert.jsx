import React from 'react'

const Alert = ({error,title,width}) => {
  return (

            <div className={`py-6 px-4 flex  gap-6 flex-col relative ${error ? 'text-white bg-red-500' : 'bg-lime-300 text-black'} overflow-y-scroll shadow-md rounded-md ${width ? width : 'w-96'}`}>

                <h4 className={`text-base w-full font-medium ${error ?'text-white':'text-gray-900'}`}>
                    { title }
                </h4>
              </div>
  )
}

export default Alert