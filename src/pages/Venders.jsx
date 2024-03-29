
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
import Confirm from '../components/shared/Confirm'
import Alert from '../components/shared/Alert'
import { ToastContainer, toast } from 'react-toastify';
import CustomTooltip from '../components/shared/Tooltip'
import { MdArrowDropDown } from "react-icons/md";


const Vender = () => {
  const [alertTitle, setAlertTitle] = useState(null)
  const [alertMessage, setAlertMessage] = useState(false)
  const [alertError, setAlertError] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [med, setMed] = useState('delete')
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
    if(isEdit|| formData.password && formData.password==formData.confirmpassword)
      {
        bodyFormData.append('password', formData.password);
      
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
    } else{
      return toast.error('password and confirmation missmatch')       
    } 

  }
  const tryUpdate= () =>{
    setModal(!modal)
    setMed('update')
    setConfirm(true)

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
 
    
  useEffect(() => {
    fetchData();
  }, [page, search, itemsPerPage]);

      async function fetchData() {
          try {
            const res = await axios.get(`${baseUrl}/vendor/getall`,{
              params: {
                  page,
                  search,
                  itemsPerPage,
              },
          });
console.log(res)
              setData(res.data.venders);
            setTotalPages(res.data.totalPages)
          } catch (err) {
              console.log(err);
          }
      }
 
 
  
  const toggleAlert = (title) => {

    setAlertTitle(title)
    setAlertMessage(!alertMessage)
    setTimeout(setAlertMessage, 1000, false)
}
  
  const toggleModal = () => {
    setFormData({})
    setIsEdit(false)
    setModal(!modal)
  }
  const onCancel = () => {
    setModal(!modal)
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
          setAlertError(false)

            console.log(response.data)
            fetchData()
            return  toast.success('Data inserted Successfully')
        })
        .catch(function (error) {
          setAlertError(true)
          console.log(error);
         return toast.error(error.message)        });
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
setConfirm(false)
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
        setAlertError(false)
          console.log(response.data)
          fetchData()
          return toast.success('Data updated Successfully')
      })
      .catch(function (error) {
        setAlertError(true)
        console.log(error);
      return  toast.error(error.message)
      });
      setConfirm(false)
setFormData({})
      //  toggleAlert('Data inserted Successfully')

}
const onDelete = (id) => {
  sessionStorage.setItem('id',id)
  setMed('delete')
  setConfirm(true)
}
const toDelete = async () => {
  await axios({
      method: "delete",
      url: `${baseUrl}/vendor/${sessionStorage.getItem('id')}`,
      headers: {"Content-Type": "multipart/form-data"},
  })
      .then((response) => {
          console.log(response.data)
          console.log(response.data)
          fetchData()
          return toast.success('Data deleted Successfully')
      })
      .catch(function (error) {
        setAlertError(true)
        console.log(error);
         return  toast.error(error.message)
      });
      setConfirm(false)
//  toggleAlert('Data inserted Successfully')

}

const handleSearchChange = (event) => {
  setSearch(event.target.value);
};

const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
  }
};

const renderPageButtons = () => {
  const maxVisibleButtons = 5; // Adjust as needed
  const buttons = [];

  if (totalPages <= maxVisibleButtons) {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          buttons.push(
              <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`py-1 px-2 text-white  ${page === pageNum ? 'border-2 border-black bg-gray-400' : 'bg-gray-400 border'}`}
              >
                  {pageNum}
              </button>
          );
      }
  } else {
      const startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
      const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

      if (startPage > 1) {
          buttons.push(
              <button key="1" onClick={() => handlePageChange(1)}>
                  1
              </button>
          );
          if (startPage > 2) {
              buttons.push(<span key="ellipsis-start">...</span>);
          }
      }

      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
          buttons.push(
              <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`py-1 px-2 text-white  ${page === pageNum ? 'border-2 border-black bg-gray-400' : 'bg-gray-400 border'}`}

              >
                  {pageNum}
              </button>
          );
      }

      if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
              buttons.push(<span key="ellipsis-end">...</span>);
          }
          buttons.push(
              <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
              </button>
          );
      }
  }

  return buttons;
}

  return (

    <div>
        {/* <Sidebar />
        <Navbar />

        <Content> */}
        <ToastContainer/>
         {alertMessage &&
                    <Alert
                        title={alertTitle}
                        error={alertError}
                        width='60%'
                    >
                    </Alert>}
        {confirm &&
        <Confirm
        onSave={med=='delete' ?toDelete:onUpdate}
        onCancel={()=>setConfirm(false)}
        onClose={()=>setConfirm(false)}
        method={med}

        >
        </Confirm>}
        {modal && 
            <Modal 
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={isEdit ? tryUpdate : onSave}
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
          <div className="w-full py-4 flex justify-between items-center">
                        <div className="py-4 flex gap-6">
                            <ButtonNormal onClick={toggleModal}>
                                <RiAddCircleLine className="w-5 h-5" />
                                <span>Add</span>
                            </ButtonNormal>
                            <div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Search"
                                    className="border py-2 px-4 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                id="shop"
                                value={itemsPerPage}
                                onChange={(event) => setItemsPerPage(event.target.value)}
                                className="w-20 px-6 py-2 border bg-white border-slate-400 text-gray-600 text-sm font-semibold focus:outline-none appearance-none"
                            >

                                {[
                                    10,
                                    25,
                                    50,
                                    100,
                                ].map((option, index) => (
                                    <option key={index} value={option} className="text-sm font-semibold text-gray-500 appearance-none">
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <MdArrowDropDown className="text-gray-600 text-lg absolute right-4 top-0 bottom-0 my-auto cursor-pointer pointer-events-none" />
                        </div>

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
                <TH title={'Profile Picture'}/>
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
                        { d.address.postal_code !== "undefined" ? d.address.postal_code : 'N/A'}
                      </TD>
                      <TD>
                          <img className='w-1/2 h-1/2' src={d.profilePic}></img>
                      </TD>
                      <TD>
                      <div className='w-full h-full flex items-center justify-center gap-4'>
                        <CustomTooltip content="Delete">
                          <FaTrash onClick={() => onDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer' />
                        </CustomTooltip>
                        <CustomTooltip content="Edit">
                        <PencilAltIcon onClick={() => toUpdate(d)} className='w-4 h-4 fill-blue-500 cursor-pointer' />
                        </CustomTooltip>
                        </div>  
                      </TD>
                    </Row>
                  )
                })

                }

              </TBody>

            </Table>
            <div className="flex mt-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className={`py-1 px-2  text-white ${page === 1?"bg-black opacity-10 text-gray-100":"bg-green-900"}`}
                        >
                            Previous
                        </button>
                        {renderPageButtons()}
                        <button
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className={`py-1 px-2  text-white ${page === totalPages?"bg-black opacity-10 text-gray-100":"bg-green-900"}`}

                        >
                            Next
                        </button>
                    </div>

          </Card>

        {/* </Content> */}
    </div>
  )
}

export default Vender