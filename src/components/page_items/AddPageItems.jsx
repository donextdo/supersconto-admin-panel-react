import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TextInput from '../shared/TextInput'
import Dropdown from '../shared/Dropdown'
import Textarea from '../shared/Textarea'

const Form = ({ pageItem, setPageItem }) => {

    const [selectedOption, setSelectedOption] = useState(null);

    const categories = [
        {
            label: 'Foods',
            value: 'foods'
        },
        {
            label: 'Clothes',
            value: 'clothes'
        },
        {
            label: 'Gifts',
            value: 'gifts',
        },
        {
            label: 'Electronics',
            value: 'electronics'
        }
    ]

    const handleChange = (e) => {
        setPageItem({
            ...pageItem,
            [e.target.name]: e.target.value
        })
    }

    const handleDropDownChange = (selectedOption) => {
        setPageItem({
            ...pageItem,
            product_category: selectedOption.value
        })
    }

    const handleCheck = (event) => {
        setPageItem({
            ...pageItem,
            online_sell: event.target.checked
        })
    }
    console.log("add", { pageItem })
    return (

        <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-4'>

                <TextInput
                    label='Product Name'
                    border
                    borderColor='border-gray-600'
                    name={'product_name'}
                    value={pageItem.product_name}
                    onChange={handleChange}
                />

                <Dropdown
                    label='Select category'
                    value={categories.find(cat => cat.value === pageItem.product_category)}
                    options={categories}
                    onChange={handleDropDownChange}
                />

                <Textarea
                    label='Description'
                    border
                    borderColor='border-gray-600'
                    name={'product_description'}
                    value={pageItem.product_description}
                    onChange={handleChange}
                />

                <TextInput
                    label='Quantity'
                    type={'number'}
                    border
                    borderColor='border-gray-600'
                    name={'quantity'}
                    value={pageItem.quantity}
                    onChange={handleChange}
                />

                <TextInput
                    label='Unit price'
                    type={'number'}
                    border
                    borderColor='border-gray-600'
                    name={'unit_price'}
                    value={pageItem.unit_price}
                    onChange={handleChange}
                />

         
                <TextInput
                    label='brand'
                    border
                    borderColor='border-gray-600'
                    name='brand'
                    value={pageItem.brand}
                    onChange={handleChange}
                />

                <TextInput
                    label='skuNumber'
                    border
                    borderColor='border-gray-600'
                    name='skuNumber'
                    value={pageItem.skuNumber}
                    onChange={handleChange}
                />

                <TextInput
                    label='type'
                    border
                    borderColor='border-gray-600'
                    name='type'
                    value={pageItem.type}
                    onChange={handleChange}
                />

                <TextInput
                    label='mfgDate'
                    border
                    borderColor='border-gray-600'
                    name='mfgDate'
                    value={pageItem.mfgDate}
                    onChange={handleChange}
                />

                <TextInput
                    label='expDate'
                    border
                    borderColor='border-gray-600'
                    name='expDate'
                    value={pageItem.expDate}
                    onChange={handleChange}
                />

                <TextInput
                    label='discount'
                    type='number'
                    border
                    borderColor='border-gray-600'
                    name='discount'
                    value={pageItem.discount}
                    onChange={handleChange}
                />

                <TextInput
                    label='review'
                    type='number'
                    border
                    borderColor='border-gray-600'
                    name='review'
                    value={pageItem.review}
                    onChange={handleChange}
                />

                <TextInput
                    label='life'
                    border
                    borderColor='border-gray-600'
                    name='life'
                    value={pageItem.life}
                    onChange={handleChange}
                />

                <TextInput
                    label='popularity'
                    type='number'
                    border
                    borderColor='border-gray-600'
                    name='popularity'
                    value={pageItem.popularity}
                    onChange={handleChange}
                />

                <div className='flex items-center justify-start gap-2'>

                    <label htmlFor="checkbox" className='text-sm font-medium text-gray-900'>Selling online</label>

                    <input
                        id='checkbox'
                        type="checkbox"
                        checked={pageItem.online_sell}
                        onChange={handleCheck}
                    />

                </div>

            </div>

            <div>
                <img src={pageItem.product_image} alt="" className='w-full h-full object-contain' />
            </div>
        </div>


    )
}

export default Form