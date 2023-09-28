
import React from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import { Button, ButtonNormal, ButtonSave } from './Button'

const Confirm = ({ onClose, onCancel,method, onSave,width}) => {
  return (
    
        <div className='fixed overlay inset-0  z-49 grid place-items-center bg-slate-900 bg-opacity-10 '>
           <div className='h-1/4 w-full flex  justify-center h-screen '>
            <div className={`py-6 px-6 flex  gap-6 flex-col relative bg-white overflow-y-auto shadow-md rounded-md w-1/3`}>

                <h1 className='font-bold w-full text-lg text-gray-900'>
                  Confirm the action
                </h1>

                <Button 
                onClick={onClose}
                styleClass='absolute top-2 right-2'>
                    <FaTimes className='mt-3 fill-gray-500 w-5 h-5'/>
                </Button>   

                <h5>Do you really want to {method}?</h5>

                <div className='flex items-center justify-end self-end gap-4'>
                    {onCancel &&<button onClick={onCancel} className="bg-white  text-black hover:bg-gray-400  border  shadow  py-1 px-4 rounded">
                        Cancel
                    </button>}

                    {onSave && <button onClick={onSave} className="bg-red-500 hover:bg-red-700 text-white shadow  py-1 px-4 rounded">
                        Confirm
                    </button>}
                </div>
                </div> 
            </div>
        </div>
  )
}

export default Confirm