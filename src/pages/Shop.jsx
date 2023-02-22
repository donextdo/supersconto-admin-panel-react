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
import Alert from '../components/shared/Alert' 
import MySwitch from "../components/shared/Switch"
import Confirm from '../components/shared/Confirm'
import { ToastContainer, toast } from 'react-toastify';

const Shop = () => {
    const [confirm, setConfirm] = useState(false)
    const [data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [med, setMed] = useState('delete')

    const [isEdit,setIsEdit] = useState(false)
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

    const onDelete = (id) => {
        sessionStorage.setItem('id',id)
        setMed('delete')
        setConfirm(true)
      }
    const toggleModal = () => {
        setModal(!modal)
        setFormData({
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
    }
    const [alertTitle, setAlertTitle] = useState(null)
    const toggleAlert = (title) => {

        setAlertTitle(title)
        setAlertMessage(!alertMessage)
        setTimeout(setAlertMessage, 1000, false)
    }
    var bodyFormData = new FormData();

    const setbodyFormData = async (formDatas) => {
        bodyFormData.append('shop_name', formDatas.shop_name);
        bodyFormData.append('description', formDatas.description);
        bodyFormData.append('address[address_line1]', formDatas.address_line1);
        bodyFormData.append('address[address_line2]', formDatas.address_line2);
        bodyFormData.append('address[address_line3]', formDatas.address_line3);
        bodyFormData.append('address[state]', formDatas.state);
        bodyFormData.append('address[city]', formDatas.city);
        bodyFormData.append('address[postal_code]', formDatas.postal_code);
        bodyFormData.append('shop_unique_id', formDatas.shop_unique_id);
        bodyFormData.append('owner_name', formDatas.owner_name);
        bodyFormData.append('status', true);
        bodyFormData.append('logo_img', formDatas.logo_img);
        bodyFormData.append('latitude', formDatas.latitude);
        bodyFormData.append('longitude', formDatas.longitude);
        bodyFormData.append('shop_category', formDatas.shop_category);
        bodyFormData.append('is_online_selling', formDatas.is_online_selling);
        bodyFormData.append('telephone', formDatas.telephone);
        bodyFormData.append('region', formDatas.region);
    }

    const onSave = async () => {
        setbodyFormData(formData)
        console.log(bodyFormData)
        await  axios({
            method: "post",
            url: `${baseUrl}/shop`,
            data: bodyFormData,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then((response) => {
                setAlertError(false)

                console.log(response.data)
                fetchData()
                return toast.success('Data inserted successfully')
            })
            .catch(function (error) {
                console.log(error);
                return toast.error(error.message)

            });
        toggleModal()

    }

    const CurrentData = (data) => {
        setFormData(prevState => {
            return {...prevState, ['shop_name']: data.shop_name, ['update']: true, ['id']: data._id}
        });
    }
    const tryUpdate= () =>{
        setIsEdit(false)
        setModal(!modal)
        setMed('update')
        setConfirm(true)
    
    }

    const toUpdate = async (data) => {
           setIsEdit(true); 
           sessionStorage.setItem('id',data._id)       
           setFormData({
            'shop_name':data.shop_name,
            'description':data.description,
            'address_line1':data.address.address_line1,
            'address_line2':data.address.address_line2,
            'address_line3':data.address.address_line3,
            'state':data.address.state,
            'city':data.address.city,
            'postal_code':data.address.postal_code,
            'shop_unique_id':data.shop_unique_id,
            'owner_name':data.owner_name,
            'status':data.status,
            'logo_img':data.logo_img,
            'latitude':data.latitude,
            'longitude':data.longitude,
            'shop_category':data.shop_category,
             'is_online_selling':data.is_online_selling,
             'telephone':data.telephone
        })
       setModal(true)
    }

    const toDelete = async (id) => {
        // axios({
        //     method: "delete",
        //     url: `${baseUrl}/shop/${id}`,

        // })
        //     .then((response) => {
        //         console.log(response.data)
        //         toggleAlert('Data deleted Successfully')
        //         fetchData()

        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        try {

            const res = await axios.delete(`${baseUrl}/shop/${sessionStorage.getItem('id')}`)
            console.log(res.data)
            setAlertError(false)
            toast.success('Data Deleted Successfully')

            fetchData()
      
          } catch (error) {
            setAlertError(true)
            console.log(error);
            toast.error(error.message)
            console.log(error)
          }
          setConfirm(false)
    }
    const onClose = () => {
        toggleModal()
    }
    const onUpdate = async () => {
        console.log(formData)
        setbodyFormData(formData)
      await  axios({
            method: "patch",
            url: `${baseUrl}/shop/${sessionStorage.getItem('id')}`,
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then((response) => {
                setAlertError(false)
                fetchData()

                return toast.success('Data updated successfully')
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
                fetchData()
                return toast.error(error.message)
            });
            setConfirm(false)
    }

    const onCancel = () => {
        setModal(false)
    }
    const update = (name, e) => {
       if(name=='is_online_selling')
        {
            setFormData(prevState => {
                return {...prevState, [name]: !prevState.is_online_selling}
            });  
        }else
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
            {/* <Sidebar/>
            <Navbar/>

            <Content> */}
            <>  
            <ToastContainer/>
               {confirm &&
                <Confirm
                    onSave={med=='delete' ?toDelete:onUpdate}
                    onCancel={()=>setConfirm(false)}
                    onClose={()=>setConfirm(false)}
                    method={med}
                >
                </Confirm>}
                {alertMessage &&
                    <Alert
                        title={alertTitle}
                        error={alertError}
                        width='60%'

                    >
                    </Alert>}
                {modal &&
                    <Modal
                        onClose={onClose}
                        onCancel={onCancel}
                        onSave={isEdit ? tryUpdate : onSave}
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
                                    label='Address Line 2'
                                    value={formData.address_line2} onChange={(e) => update("address_line2", e)}
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <TextInput
                                    label='Address Line 3'
                                    value={formData.address_line3} onChange={(e) => update("address_line3", e)}
                                    border
                                    borderColor='border-gray-600'
                                />
                            </div>
                            <div className='flex-1'>
                                <TextInput
                                    label='Municipality'
                                    value={formData.postal_code} onChange={(e) => update("postal_code", e)}
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
                                    onChange={(e) => updateImg("logo_img", e)}
                                    value={formData.logo_img}
                                />
                            </div>
                            <div className='flex-1'>
                                <MySwitch
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
                                            {d.telephone}
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
                                           <img className='w-1/2 h-1/2' src={d.logo_img}></img>
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
            </>
            {/* </Content> */}
        </div>
    )
}

export default Shop