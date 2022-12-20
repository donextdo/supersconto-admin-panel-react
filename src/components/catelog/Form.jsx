import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TextInput from '../shared/TextInput'
import Dropdown from '../shared/Dropdown'
import Textarea from '../shared/Textarea'

const Form = ({ catelog, setCatelog }) => {

const [shops, setShops] = useState([])
const [selectedOption, setSelectedOption] = useState(null);
const [defaultValue, setDefaultValue] = useState(null)

useEffect( () => {
    async function fetchData() {
        try {
            const res = await axios.get('http://apidev.marriextransfer.com/v1/api/shop'); 
            const shopData = res.data.map(d => {
              return {
                value: d._id,
                label: d.shop_name
              }
            })
            setShops(shopData);

            // if(catelog.shop_id) {
            //     const currentShop = shopData.filter(shop => {
            //         return shop.value == catelog.shop_id
            //     })

            //     console.log(currentShop[0])
            //     setDefaultValue(currentShop[0])
            // }

            // console.log(defaultValue)

        } catch (err) {
            console.log(err);
        }   
    }
    fetchData();
}, []);

// useEffect( () => {
//     setDefaultValue({
//         label:"Test Shop",
//         value:"63a1778a3e6401f7ab0396c3"
//     })
//     console.log(defaultValue)
// }, [])

const handleChange = (e) => {
    setCatelog({
        ...catelog,
        [e.target.name] : e.target.value
    })
}

const handleDropDownChange = (selectedOption) => {
    setCatelog({
        ...catelog,
        shop_id : selectedOption.value
    })
}

  return (
    <div className='flex flex-col gap-4'>

        <Dropdown
            label='Select Shop'
            value={selectedOption}
            // defaultValue={{
            //     label:"",
            //     value:"63a1778a3e6401f7ab0396c3"
            // }}
            options={shops}
            onChange={handleDropDownChange}
        />

        <TextInput 
            label='Title' 
            border
            borderColor='border-gray-600'
            name={'title'}
            value={catelog.title}
            onChange={handleChange}
        />

        <Textarea
            label='Description'
            border
            borderColor='border-gray-600'
            name={'description'}
            value={catelog.description}
            onChange={handleChange}
        />

        <TextInput 
            label='Expire Date' 
            type={'date'}
            border
            borderColor='border-gray-600'
            name={'expiredate'}
            value={catelog.expiredate}
            onChange={handleChange}
        />

    </div>
  )
}

export default Form