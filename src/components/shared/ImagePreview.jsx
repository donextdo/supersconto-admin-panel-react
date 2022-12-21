import React from 'react'
import { FaTimes, FaUpload, FaTrash } from 'react-icons/fa'
import { Button, ButtonNormal, ButtonSave } from './Button'

const Modal = ({onClose, onCancel, onUpload, width, image, images, setImagePreviews}) => {

const onDelete = (imgUrl) => {
    const newImages = images.filter(img => (
        img !== imgUrl
    ))

    setImagePreviews(newImages)
}

  return (
    <div className='fixed inset-0 z-50 py-20 overflow-y-scroll grid place-items-center bg-slate-900 bg-opacity-10'>
        
        <div className={`py-8 px-6 flex gap-6 flex-col relative bg-white shadow-md rounded-md ${width ? width : 'w-[70vw]'}`}>

            <Button 
            onClick={onClose}
            styleClass='absolute top-2 right-2'>
                <FaTimes className='fill-red-700 w-5 h-5'/>
            </Button>   

            {image && 
                <div className='w-full h-[70vh] bg-gray-200'>
                    <img src={image} alt="image" className='w-full h-full object-contain' />
                </div>  
            }

            {images && 
                <div className='w-full grid grid-cols-3 gap-2'>
                    {
                        images.map((img, index) => (
                            <div key={index} className='w-full aspect-square bg-gray-200 relative'>
                                <img src={img} alt="image" className='w-full h-full object-contain' />
                                <FaTrash onClick={() => onDelete(img)} className='w-3 h-3 fill-red-500 cursor-pointer absolute top-4 right-4'/>
                            </div>
                        ))
                    }
                </div>  
            }

            <div className='flex items-center justify-end self-end gap-4'>
                <ButtonNormal
                onClick={onCancel}>
                    Cancel
                </ButtonNormal>

                <ButtonSave
                onClick={onUpload}>
                    <FaUpload />
                    <span>Upload</span>
                </ButtonSave>
            </div>

        </div>

    </div>
  )
}

export default Modal