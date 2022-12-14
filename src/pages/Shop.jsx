import React, { useState,useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import { PencilAltIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { RiAddCircleLine } from 'react-icons/ri'
import { ButtonNormal} from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import TextInput from '../components/shared/TextInput'


const Shop = () => {
  const [data, setData] =useState([])
    
  useEffect( () => {
      async function fetchData() {
          try {
              const res = await axios.get('http://apidev.marriextransfer.com/v1/api/shop'); 
              setData(res.data);
          } catch (err) {
              console.log(err);
          }
      }
      fetchData();
  }, []);

  const [modal, setModal] = useState(false)
  
  
  const [formData, setFormData] = useState({
    shop_name:'',
    description:'',
    address_line1:'',
    address_line2:'',
    address_line3:'',
    state:'',
    city:'',
    postal_code:'',
    shop_unique_id:'',
    owner_name:'',
    status:'',
    logo_img:'',
    latitude:'',
    longitude:'',
    shop_category:'',
    is_online_selling:false,
    telephone:''

  })
  const handleChange = (e) => setValue(e.target.value);


  const toggleModal = () => {
    setModal(!modal)
  }
  var bodyFormData = new FormData();
  
  const setbodyFormData=()=>{
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
  bodyFormData.append('status', formData.status);
  bodyFormData.append('logo_img', formData.logo_img);
  bodyFormData.append('latitude', formData.latitude);
  bodyFormData.append('longitude', formData.longitude);
  bodyFormData.append('shop_category', formData.shop_category);
  bodyFormData.append('is_online_selling', formData.is_online_selling);
  bodyFormData.append('telephone', formData.telephone);

  }

  const onSave = () => {
    axios({
      method: "post",
      url: "http://apidev.marriextransfer.com/v1/api/shop",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      setResponse(response.data)
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
 });  }

  const onCancel = () => {
    alert('oncancel clicked')
  }
 const update = (name, e) => {
    setFormData(prevState => {return {...prevState, [name]: e.target.value }});
  }

  return (
    <div>
        <Sidebar />
        <Navbar />

        <Content>
        {modal && 
            <Modal 
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={onSave}
            title='Create Shop'
            width='w-1/2'
            > 
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Shop Name' 
                    border
                    value={formData.shop_name} onChange={(e) =>update("shop_name", e)}
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Region' 
                    border
                    value={formData.description} onChange={(e) =>update("description", e)}
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Telephone' 
                    border
                    value={formData.telephone} onChange={(e) =>update("telephone", e)}
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Province' 
                    border
                    borderColor='border-gray-600'
                    value={formData.state} onChange={(e) =>update("state", e)}

                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Address Line 1' 
                    value={formData.address_line1} onChange={(e) =>update("address_line1", e)}
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Initials' 
                    value={formData.address_line2} onChange={(e) =>update("address_line2", e)}
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Address Line 2' 
                    value={formData.address_line3} onChange={(e) =>update("address_line3", e)}
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Municipality' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='City' 
                    value={formData.city} onChange={(e) =>update("city", e)}
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    value={formData.shop_unique_id} onChange={(e) =>update("shop_unique_id", e)}
                    label='CAP' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Logo' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Does Online Selling' 
                    border
                    value={formData.is_online_selling} onChange={(e) =>update("is_online_selling", e)}
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    value={formData.latitude} onChange={(e) =>update("latitude", e)}
                    label='Google Map Latitude' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    value={formData.longitude} onChange={(e) =>update("longitude", e)}
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
                        { d._id }
                      </TD>

                      <TD>
                        { d.shop_name }
                      </TD>

                      <TD>
                        { d.telephone }
                      </TD>

                      <TD>
                        { d.address.address_line1 }
                        { d.address.address_line2 }
                        { d.address.address_line3 }
                        { d.address.state }
                        { d.address.city }

                      </TD>
                      <TD>
                        { d.status ? "true" :"false" }
                      </TD>
                      <TD>
                        { d.logo }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>
                          <FaTrash className='w-3 h-3 fill-red-500 cursor-pointer'/>
                          <PencilAltIcon className='w-4 h-4 fill-blue-500 cursor-pointer'/>
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