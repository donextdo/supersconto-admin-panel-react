import React, {useEffect, useState} from 'react'
import axios from 'axios'
import TextInput from '../shared/TextInput'
import Dropdown from '../shared/Dropdown'
import Textarea from '../shared/Textarea'
import baseUrl from '../../utils/baseUrl'

const Form = ({catelog, setCatelog}) => {

    const [shops, setShops] = useState([])
    const [defaultValue, setDefaultValue] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`${baseUrl}/shop`);
                const shopData = res.data.map(d => {
                    return {
                        value: d._id,
                        label: d.shop_name+' - '+d.address.address_line1+' '+d.address.address_line2+' '+d.address.address_line3+
                        ' '+d.address.city+' '+d.address.postal_code
                    }
                })
                setShops(shopData);

            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);

    const handleChange = (e) => {
        setCatelog({
            ...catelog,
            [e.target.name]: e.target.value
        })
    }

    const handleDropDownChange = (selectedOption) => {
        setCatelog({
            ...catelog,
            shop_id: selectedOption.value
        })
    }
    console.log(shops)
    return (
        <div className='flex flex-col gap-4'>

            <Dropdown
                label='Select Shop'
                value={shops.find(shop => shop.value === catelog.shop_id)}
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