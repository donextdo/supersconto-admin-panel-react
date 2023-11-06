import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TextInput from '../shared/TextInput'
import Dropdown from '../shared/Dropdown'
import Textarea from '../shared/Textarea'
import MySwitch from '../shared/Switch'
import baseUrl from '../../utils/baseUrl'

const Form = ({ catelog, setCatelog, children }) => {

    const [shops, setShops] = useState([])
    const [defaultValue, setDefaultValue] = useState(null)
    const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : null

    useEffect(() => {

        async function fetchData() {
            try {
                let res = []

                if (userData) {
                    if (userData?.userType === 0) {
                        res = await axios.get(`${baseUrl}/shop`);
                    } else {
                        res = await axios.get(`${baseUrl}/shop/by-vendor/${userData?._id}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Authorization': `Bearer ${token}`,
                                'Accept': "application/json"
                            }
                        });
                    }
                }
                const shopData = res.data.map(d => {
                    return {
                        value: d._id,
                        label: d.shop_name + ' - ' + d.address.address + ' ' + d.address.state + ' ' + d.address.postal_code,
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

    const handleTrueFlase = (e) => {
        setCatelog(prevCatelog => ({
            ...prevCatelog,
            flyer: !prevCatelog.flyer,
        }));
    }

    const activeTrueFlase = (e) => {
        setCatelog(prevCatelog => ({
            ...prevCatelog,
            active: !prevCatelog.active,
        }));
    }


    const handleDropDownChange = (selectedOption) => {
        setCatelog({
            ...catelog,
            shop_id: selectedOption.value
        })
    }

    return (
        <div className='flex flex-col gap-4'>

            {/*<Dropdown
                label='Select Shop *'
                value={shops.find(shop => shop.value === catelog.shop_id)}
                options={shops}
                onChange={handleDropDownChange}
            />*/}

            {children}

            <TextInput
                label='Title *'
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
                maxlength="200"
            />
                        <TextInput
                label='Start Date *'
                type={'date'}
                border
                borderColor='border-gray-600'
                name={'startdate'}
                value={catelog.startdate.substring(0, 10)}
                onChange={handleChange}
            />

            <TextInput
                label='Expire Date *'
                type={'date'}
                border
                borderColor='border-gray-600'
                name={'expiredate'}
                value={catelog.expiredate.substring(0, 10)}
                onChange={handleChange}
            />

            <MySwitch
                label="Featured Flyer"
                border
                value={catelog.flyer}
                onChange={handleTrueFlase}
                borderColor="border-gray-600"
            />

            <MySwitch
                label="Active"
                border
                value={catelog.active}
                onChange={activeTrueFlase}
                borderColor="border-gray-600"
            />


        </div>
    )
}

export default Form