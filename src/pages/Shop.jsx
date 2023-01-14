import axios from 'axios'
import {RiAddCircleLine} from 'react-icons/ri'
import {ButtonNormal} from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import TextInput from '../components/shared/TextInput'
import React, {useEffect, useState} from 'react'
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import {Content, Card} from '../components/shared/Utils';
import Fileinput from '../components/shared/Fileinput'
import {Table, THead, TBody, TH, Row, TD} from '../components/shared/Table'
import {FaTrash} from 'react-icons/fa'
import {PencilAltIcon} from '@heroicons/react/solid'
import baseUrl from "../utils/baseUrl.js";
// import Alert from '../components/shared/Alert' 

const Shop = () => {
    const [data, setData] = useState([])

    async function fetchData() {
        try {
            const res = await axios.get(`${baseUrl}/shop`);
            setData(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [modal, setModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const [color, setColor] = useState('bg-lime-300 text-black')


    const [formData, setFormData] = useState({
        shop_name: '',
        description: '',
        address_line1: '',
        address_line2: '',
        address_line3: '',
        state: '',
        city: '',
        postal_code: '',
        shop_unique_id: '',
        owner_name: '',
        status: '',
        logo_img: null,
        latitude: '',
        longitude: '',
        shop_category: '',
        is_online_selling: false,
        province: '',
        municipality: '',
        region: '',
        telephone: ''
    })


    const toggleModal = () => {
        setModal(!modal)
    }
    const [alertTitle, setAlertTitle] = useState(null)
    const toggleAlert = (title) => {

        setAlertTitle(title)
        setAlertMessage(!alertMessage)
        setTimeout(setAlertMessage, 1000, false)
    }
    var bodyFormData = new FormData();

    const setbodyFormData = async () => {
        bodyFormData.append('shop_name', formData.shop_name);
        bodyFormData.append('description', formData.description);
        bodyFormData.append('address[address_line1]', formData.address_line1);
        bodyFormData.append('address[address_line2]', formData.address_line2);
        bodyFormData.append('address[address_line3]', formData.address_line3);
        bodyFormData.append('address[state]', formData.state);
        bodyFormData.append('address[city]', formData.city);
        bodyFormData.append('address[postal_code]', formData.shop_name);
        bodyFormData.append('shop_unique_id', formData.shop_unique_id);
        bodyFormData.append('owner_name', formData.owner_name);
        bodyFormData.append('status', true);
        bodyFormData.append('logo_img', formData.logo_img);
        bodyFormData.append('latitude', formData.latitude);
        bodyFormData.append('longitude', formData.longitude);
        bodyFormData.append('shop_category', formData.shop_category);
        bodyFormData.append('is_online_selling', formData.is_online_selling);
        bodyFormData.append('telephone', formData.telephone);
        bodyFormData.append('region', formData.region);

    }

    const onSave = async () => {
        setbodyFormData()
        console.log(bodyFormData)
        axios({
            method: "post",
            url: `${baseUrl}/shop`,
            data: bodyFormData,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then((response) => {
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        toggleModal()
//  toggleAlert('Data inserted Successfully')
        fetchData()
    }

    const CurrentData = (data) => {
        setFormData(prevState => {
            return {...prevState, ['shop_name']: data.shop_name, ['update']: true, ['id']: data._id}
        });
    }

    const toUpdate = (data) => {
        CurrentData(data)
        toggleModal()
        bodyFormData = new FormData();
    }

    const onDelete = (id) => {
        axios({
            method: "delete",
            url: `${baseUrl}/shop/${id}`,

        })
            .then((response) => {
                console.log(response.data)
                toggleAlert('Data deleted Successfully')
                fetchData()

            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const onClose = () => {
        setFormData({})
        toggleModal()
    }
    const onUpdate = async () => {
        setbodyFormData()
        axios({
            method: "patch",
            url: `${baseUrl}/shop/${formData.id}`,
            data: bodyFormData,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then((response) => {
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        toggleModal()
        fetchData()
    }

    const onCancel = () => {
        alert('oncancel clicked')
    }
    const update = (name, e) => {
        setFormData(prevState => {
            return {...prevState, [name]: e.target.value}
        });
    }
    const updateImg = (name, e) => {
        setFormData(prevState => {
            return {...prevState, [name]: e.target.files[0]}
        });
    }

    return (
        <div>
            <Sidebar/>
            <Navbar/>

            <Content>
                {alertMessage &&
                    <Alert
                        title={alertTitle}
                        color={color}
                        width='60%'
                    >
                    </Alert>}
                {modal &&
                    <Modal
                        onClose={onClose}
                        onCancel={onCancel}
                        onSave={onSave}
                        title='Create Shop'
                        width='w-1/2'
                    >
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    label='Shop Name'
                                    border
                                    value={formData.shop_name} onChange={(e) => update("shop_name", e)}
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    label='Region'
                                    border
                                    value={formData.description} onChange={(e) => update("description", e)}
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    label='Telephone'
                                    border
                                    value={formData.telephone} onChange={(e) => update("telephone", e)}
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    label='Province'
                                    border
                                    borderColor='border-gray-600'
                                    value={formData.state} onChange={(e) => update("state", e)}

                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    label='Address Line 1'
                                    value={formData.address_line1} onChange={(e) => update("address_line1", e)}
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    label='Initials'
                                    value={formData.address_line2} onChange={(e) => update("address_line2", e)}
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    label='Address Line 2'
                                    value={formData.address_line3} onChange={(e) => update("address_line3", e)}
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    label='Municipality'
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    label='City'
                                    value={formData.city} onChange={(e) => update("city", e)}
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    value={formData.shop_unique_id} onChange={(e) => update("shop_unique_id", e)}
                                    label='CAP'
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <Fileinput
                                    label={'Logo Image'}
                                    multiple
                                    onChange={(e) => updateImg("logo_img", e)}
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    label='Does Online Selling'
                                    border
                                    value={formData.is_online_selling} onChange={(e) => update("is_online_selling", e)}
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    value={formData.latitude} onChange={(e) => update("latitude", e)}
                                    label='Google Map Latitude'
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    value={formData.longitude} onChange={(e) => update("longitude", e)}
                                    label='Google Map Longitude'
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                    </Modal>
                }
                <Card>
                    <div className='w-full py-4 flex gap-6'>
                        <ButtonNormal onClick={toggleModal}>
                            <RiAddCircleLine className='w-5 h-5'/>
                            <span>Add</span>
                        </ButtonNormal>
                    </div>
                    <Table>

                        <THead>
                            <TH title={'Id'}/>
                            <TH title={'Shop Name'}/>
                            <TH title={'Contact'}/>
                            <TH title={'Address'}/>
                            <TH title={'Status'}/>
                            <TH title={'Logo'}/>
                            <TH title={'Actions'}/>
                        </THead>

                        <TBody>

                            {data.map(d => {
                                return (
                                    <Row key={d._id}>
                                        <TD>
                                            {d._id}
                                        </TD>

                                        <TD>
                                            {d.shop_name}
                                        </TD>

                                        <TD>

                                        </TD>

                                        <TD>
                                            {d.address.address_line1}
                                            {d.address.address_line2}
                                            {d.address.address_line3}
                                            {d.address.state}
                                            {d.address.city}

                                        </TD>
                                        <TD>
                                            {d.status ? "true" : "false"}
                                        </TD>
                                        <TD>
                                            {d.logo}
                                        </TD>
                                        <TD>
                                            <div className='w-full h-full flex items-center justify-center gap-4'>
                                                <FaTrash onClick={() => onDelete(d._id)}
                                                         className='w-3 h-3 fill-red-500 cursor-pointer'/>
                                                <PencilAltIcon onClick={() => toUpdate(d)}
                                                               className='w-4 h-4 fill-blue-500 cursor-pointer'/>
                                            </div>
                                        </TD>
                                    </Row>
                                )
                            })

                            }

                        </TBody>

                    </Table>

                </Card>

            </Content>
        </div>
    )
}

export default Shop