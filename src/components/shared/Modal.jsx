
import React from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import { Button, ButtonNormal, ButtonSave } from './Button'

const Modal = ({children, onClose, onCancel, onSave, title,height,width}) => {
  return (
    
        <div className='fixed overlay inset-0  z-50 grid place-items-center bg-slate-900 bg-opacity-10 '>
           <div className='h-3/4 w-full flex  justify-center h-screen '>
            <div className={`py-6 px-4 flex  gap-6 flex-col relative bg-white overflow-y-auto shadow-md rounded-md ${height && height } ${width ? width : 'w-96'}`}>

                <h4 className='text-base w-full font-medium text-gray-900'>
                    { title }
                </h4>

                <Button 
                onClick={onClose}
                styleClass='absolute top-2 right-2'>
                    <FaTimes className='fill-red-700 w-5 h-5'/>
                </Button>   

                {children}

                <div className='flex items-center justify-end self-end gap-4'>
                    {onCancel && <ButtonNormal
                        onClick={onCancel}>
                        Cancel
                    </ButtonNormal>}

                    {onSave && <ButtonSave
                        onClick={onSave}>
                        <FaSave/>
                        <span>Save</span>
                    </ButtonSave>}
                </div>
                </div> 
            </div>
        </div>
  )
}

export default Modal