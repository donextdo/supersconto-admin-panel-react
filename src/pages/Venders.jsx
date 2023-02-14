
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
import Fileinput from '../components/shared/Fileinput'
import baseUrl from '../utils/baseUrl'

const Vender = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password:'',
    confirmpassword:'',
    profilepic:[],
    email:'',
    address_line1: '',
    address_line2: '',
    address_line3: '',
    state: '',
    city: '',
    postal_code: ''
   
  })
  const [data, setData] =useState([])
  const [modal, setModal] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  let id=null;
  const setbodyFormData = (formData) => {
    var bodyFormData = new FormData();
    if(formData.password && formData.password==formData.confirmpassword)
    {
      bodyFormData.append('password', formData.password);
    }
    bodyFormData.append('fullName',formData.fullName);
    bodyFormData.append('username', formData.username);
    bodyFormData.append('profile_pic', formData.profilepic);
    bodyFormData.append('mobile', formData.mobile);
    bodyFormData.append('email', formData.email);
    bodyFormData.append('address[address_line1]', formData.address_line1);
    bodyFormData.append('address[address_line2]', formData.address_line2);
    bodyFormData.append('address[address_line3]', formData.address_line3);
    bodyFormData.append('address[state]', formData.state);
    bodyFormData.append('address[city]', formData.city);
    bodyFormData.append('address[postal_code]', formData.postal_code);
    return bodyFormData
  }  

  const updateImg = (e) => {
    console.log(e.target.files[0])
    setFormData(prevState => {
        return {...prevState, 'profilepic': e.target.files[0]}
    });

  }
  const update = (name, e) => {
    setFormData(prevState => {
        return {...prevState, [name]: e.target.value}
    });
  }
 
    

      async function fetchData() {
          try {
            const res = await axios.get(`${baseUrl}/vendor`);
console.log(res)
              setData(res.data);
          } catch (err) {
              console.log(err);
          }
      }
 
  useEffect(() => {
    fetchData();
  }, []);
  
  
  
  const toggleModal = () => {
    setFormData({})
    setIsEdit(false)
    setModal(!modal)
  }
  const onCancel = () => {
    alert('oncancel clicked')
  }
  const onSave = async () => {
    const bodyFormData=  setbodyFormData(formData)
    console.log(bodyFormData)
   await axios({
        method: "post",
        url: `${baseUrl}/vendor`,
        data: bodyFormData,
        headers: {"Content-Type": "multipart/form-data"},
    })
        .then((response) => {
            console.log(response.data)
            fetchData()
        })
        .catch(function (error) {
            console.log(error);
        });
    toggleModal()
//  toggleAlert('Data inserted Successfully')

}

const toUpdate = (data) =>{
  setIsEdit(true)
  setFormData({
     'fullName':data.fullName,
     'username':data.username,
     'mobile':data.mobile,
     'email':data.email,
     'address_line1':data.address.address_line1,
     'address_line2':data.address.address_line2,
     'address_line3':data.address.address_line3,
     'state':data.address.state,
     'city':data.address.city, 
     'postal_code':data.address.postal_code,
    }
    
);
sessionStorage.setItem('id',data._id)
setModal(!modal)

}

const onUpdate = async () => {
  const bodyFormData=  setbodyFormData(formData)
  await axios({
      method: "patch",
      url: `${baseUrl}/vendor/${sessionStorage.getItem('id')}`,
      data: bodyFormData,
      headers: {"Content-Type": "multipart/form-data"},
  })
      .then((response) => {
          console.log(response.data)
          fetchData()
      })
      .catch(function (error) {
          console.log(error);
      });
  toggleModal()
//  toggleAlert('Data inserted Successfully')

}

const toDelete = async (id) => {
  await axios({
      method: "delete",
      url: `${baseUrl}/vendor/${id}`,
      headers: {"Content-Type": "multipart/form-data"},
  })
      .then((response) => {
          console.log(response.data)
          fetchData()
      })
      .catch(function (error) {
          console.log(error);
      });
//  toggleAlert('Data inserted Successfully')

}

  return (

    <div>
        {/* <Sidebar />
        <Navbar />

        <Content> */}
        {modal && 
            <Modal 
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={isEdit ? onUpdate : onSave}
            title='Create Vendor'
            width='w-1/2'
            > 
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Full Name' 
                    border
                    borderColor='border-gray-600'
                    value={formData.fullName} onChange={(e) => update("fullName", e)}
                  />
                 </div>
               </div>  
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='User Name' 
                    border
                    borderColor='border-gray-600'
                    value={formData.username} onChange={(e) => update("username", e)}
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Mobile' 
                    border
                    borderColor='border-gray-600'
                    value={formData.mobile} onChange={(e) => update("mobile", e)}
                  />
                </div>
               </div> 
               <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Address Line 1' 
                    border
                    borderColor='border-gray-600'
                    value={formData.address_line1} onChange={(e) => update("address_line1", e)}
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Address Line 2' 
                    border
                    borderColor='border-gray-600'
                    value={formData.address_line2} onChange={(e) => update("address_line2", e)}
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Address Line 3' 
                    border
                    borderColor='border-gray-600'
                    value={formData.address_line3} onChange={(e) => update("address_line3", e)}
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='City' 
                    border
                    borderColor='border-gray-600'
                    value={formData.city} onChange={(e) => update("city", e)}
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='State' 
                    border
                    borderColor='border-gray-600'
                    value={formData.state} onChange={(e) => update("state", e)}
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Postal code' 
                    border
                    borderColor='border-gray-600'
                    value={formData.postal_code} onChange={(e) => update("postal_code", e)}
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Password' 
                    border
                    borderColor='border-gray-600'
                    type="password"
                    value={formData.password} onChange={(e) => update("password", e)}
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Password Confirmation' 
                    border
                    type="password"
                    borderColor='border-gray-600'
                    value={formData.confirmpassword} onChange={(e) => update("confirmpassword", e)}
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <Fileinput
                    label={'Profile Picture'}
                    multiple
                    onChange={(e) => updateImg(e)}

                   />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Email' 
                    border
                    borderColor='border-gray-600'
                    value={formData.email} onChange={(e) => update("email", e)}

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
                <TH title={'Full Name'}/>
                <TH title={'User Name'}/>
                <TH title={'Email'}/>
                <TH title={'Mobile'}/>
                <TH title={'Address'}/>
                <TH title={'State'}/>
                <TH title={'City'}/>
                <TH title={'Postal Code'}/>
                <TH title={'Actions'}/>
              </THead>

              <TBody>

                {data.map(d => {
                  return (
                    <Row key={d._id}>
                      <TD>
                        { d.fullName }
                      </TD>
                      <TD>
                        { d.username }
                      </TD>
                      <TD>
                        { d.email }
                      </TD>
                      <TD>
                        { d.mobile }
                      </TD>
                      <TD>
                        { d.address.address_line1 +','+d.address.address_line2+','+d.address.address_line3}
                      </TD>
                      <TD>
                        { d.address.state }
                      </TD>
                      <TD>
                        { d.address.city }
                      </TD>
                      <TD>
                        { d.address.postal_code }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>
                          <FaTrash onClick={() => toDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer'/>
                          <PencilAltIcon onClick={() => toUpdate(d)} className='w-4 h-4 fill-blue-500 cursor-pointer'/>
                        </div>  
                      </TD>
                    </Row>
                  )
                })

                }

              </TBody>

            </Table>

          </Card>

        {/* </Content> */}
    </div>
  )
}

export default Vender