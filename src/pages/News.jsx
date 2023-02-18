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
import Textarea from '../components/shared/Textarea'
import Alert from '../components/shared/Alert' 
import Confirm from '../components/shared/Confirm'
import { ToastContainer, toast } from 'react-toastify';

const News = () => {
  const [confirm, setConfirm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    expiredDate: '',
    content:'',
    image:[],
   
  })

  const onDelete = (id) => {
    sessionStorage.setItem('id',id)
    setConfirm(true)
  }
  const [alertMessage, setAlertMessage] = useState(false)
    const [alertError, setAlertError] = useState(false)

  const [alertTitle, setAlertTitle] = useState(null)
  const toggleAlert = (title) => {

      setAlertTitle(title)
      setAlertMessage(!alertMessage)
      setTimeout(setAlertMessage, 1000, false)
  }
  const [isEdit,setIsEdit] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);
  const setbodyFormData = (formData) => {
    var bodyFormData = new FormData();
    if(formData.password && formData.password==formData.confirmpassword)
    {
      bodyFormData.append('password', formData.password);
    }
    bodyFormData.append('title',formData.title);
    bodyFormData.append('expiredDate', formData.expiredDate);
    bodyFormData.append('status', true);
    bodyFormData.append('description', formData.content);
    bodyFormData.append('images', formData.image);
    bodyFormData.append('created_at', new Date());
    bodyFormData.append('updated_at', new Date());


    return bodyFormData
  }  
  const [data, setData] =useState([])
  const [modal, setModal] = useState(false)
 
  async function fetchData() {
    try {
        const res = await axios.get(`${baseUrl}/news`);
        setData(res.data);
    } catch (err) {
        console.log(err);
    }
}

  const updateImg = (e) => {
    console.log(e.target.files[0])
    setFormData(prevState => {
        return {...prevState, 'image': e.target.files[0]}
    });

  }
  const update = (name, e) => {
    setFormData(prevState => {
        return {...prevState, [name]: e.target.value}
    });
  }
  
  const onSave = async () => {
    const bodyFormData=  setbodyFormData(formData)
    console.log(bodyFormData)
   await axios({
        method: "post",
        url: `${baseUrl}/news`,
        data: bodyFormData,
        headers: {"Content-Type": "multipart/form-data"},
    })
        .then((response) => {
            console.log(response.data)
            setAlertError(false)
            return toast.success('Data inserted Successfully')
            fetchData()
        })
        .catch(function (error) {
            console.log(error);
            setAlertError(true)
            console.log(error);
            return toast.error(error.message)
        });
    toggleModal()
//  toggleAlert('Data inserted Successfully')

}
const onUpdate = async () => {
  const bodyFormData=  setbodyFormData(formData)
  await axios({
      method: "patch",
      url: `${baseUrl}/news/${sessionStorage.getItem('id')}`,
      data: bodyFormData,
      headers: {"Content-Type": "multipart/form-data"},
  })
      .then((response) => {
          console.log(response.data)
          setAlertError(false)
         return  toast.success('Data Updated Successfully')
          fetchData()
      })
      .catch(function (error) {
          console.log(error);
          setAlertError(true)
          console.log(error);
          return toast.error('Something went Wrong')
      });
  toggleModal()
//  toggleAlert('Data inserted Successfully')

  }

const toDelete = async (id) => {
  await axios({
      method: "delete",
      url: `${baseUrl}/news/${sessionStorage.getItem('id')}`,
      headers: {"Content-Type": "multipart/form-data"},
  })
      .then((response) => {
          console.log(response.data)
          setAlertError(false)
          return toast.success('Data Deleted Successfully')
          fetchData()
      })
      .catch(function (error) {
          console.log(error);
          setAlertError(true)
          console.log(error);
          return toast.error(error.message)
      });
      setConfirm(false)

//  toggleAlert('Data inserted Successfully')

}
  const toggleModal = () => {
    setIsEdit(false)
    setFormData({})
    setModal(!modal)
  }
  const onCancel = () => {
    alert('oncancel clicked')
  }
  const toUpdate = (data) =>{
    setIsEdit(true)
    setFormData({
      'title':data.title,
      'expiredDate':data.expiredDate,
      'content':data.description,
      }
      
  );
  sessionStorage.setItem('id',data._id)
  setModal(!modal)
  
  }

  return (
    <div>
        {/* <Sidebar />
        <Navbar />

        <Content> */}
        <>
        <ToastContainer/>
        {confirm &&
        <Confirm
            onSave={toDelete}
            onCancel={()=>setConfirm(false)}
            onClose={()=>setConfirm(false)}

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
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={isEdit ? onUpdate : onSave}
            title='Add News'
            width='w-1/2'
            > 
               <div className='grid grid-rows-4 grid-flow-col gap-1'>
                  <TextInput 
                    label='News title' 
                    border
                    borderColor='border-gray-600'
                    value={formData.title} onChange={(e) => update("title", e)}

                  />
                  <TextInput 
                    label='Expired Date' 
                    border
                    type='date'
                    borderColor='border-gray-600'
                    value={formData.expiredDate} onChange={(e) => update("expiredDate", e)}

                  />
                    <Textarea 
                    label='Content' 
                    border
                    borderColor='border-gray-600'
                    value={formData.content} onChange={(e) => update("content", e)}

                  />
                  <Fileinput 
                    label='Image' 
                    border
                    borderColor='border-gray-600'
                    value={formData.image} onChange={(e) => updateImg(e)}

                  />
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
                <TH title={'Title'}/>
                <TH title={'Expired Date'}/>
                <TH title={'Description'}/>
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
                        { d.title }
                      </TD>

                      <TD>
                        { d.expiredDate }
                      </TD>
                      <TD>
                        { d.description }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>
                          <FaTrash onClick={() => onDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer'/>
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
        </>
        {/* </Content> */}
    </div>
  )
}

export default News