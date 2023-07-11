import React, { useState, useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import { PencilAltIcon } from '@heroicons/react/solid'
import { MdPreview } from "react-icons/md";
import axios from 'axios'
import { ButtonSuccess } from '../components/shared/Button'
import { RiAddCircleLine, RiPagesFill } from 'react-icons/ri'
import Modal from '../components/shared/Modal'
import Form from '../components/catelog/Form'
import { normalizeDate } from '../utils/functions'
import { Link } from 'react-router-dom'
import baseUrl, {clientAppUrl} from '../utils/baseUrl'
import { ToastContainer, toast } from 'react-toastify';
const Catalog = () => {

  const [data, setData] =useState([])
  const [modal, setModal] = useState(false)
  const [updateMode, setUpdateMode] = useState(false)
  const [catelog, setCatelog] = useState({
    _id: '',
    shop_id: '',
    title: '',
    description: '',
    expiredate: '',
    flyer: false,
  })
  const [formError, setFormError] = useState('');

    
  useEffect( () => {
      fetchData();
  }, []);

  async function fetchData() {
    try {
        const res = await axios.get(`${baseUrl}/catelog/book`); 
        setData(res.data);
    } catch (err) {
        console.log(err);
    }
  }
  
  const toggleModal = () => {
    setModal(!modal)
    setCatelog({
      _id: '',
      shop_id: '',
      title: '',
      description: '',
      expiredate: '',
      flyer: false

    })
    setUpdateMode(false)
  }

  const onSave = async () => {
    console.log(catelog)
    if (catelog.shop_id=="" || catelog.title =='' ) {
      setFormError('Please fill in the required field marked with an asterisk (*).');
  }else{
    
    setFormError('');

    try {

      const { _id, ...catalogData } = catelog

      if(!updateMode) {
        await axios.post(`${baseUrl}/catelog/book`, catalogData)
      }
      else {
        await axios.patch(`${baseUrl}/catelog/book/${catelog._id}`, catalogData)
      }
      
      fetchData()

      setCatelog({
        _id: '',
        shop_id: '',
        title: '',
        description: '',
        expiredate: '',
        flyer: false

      })

      setModal(!modal)
      return toast.success('Data saved successfully')

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
    
   
  }

  const onCancel = () => {
    toggleModal()
  }

  const onDelete = async (id) => {
    try {

      const res = await axios.delete(`${baseUrl}/catelog/book/${id}`)
      console.log(res.data)

      fetchData()
      return toast.success('Data deleted successfully')


    } catch (error) {
      toast.error(error.message)
    }
  }

  const onUpdate = async (d) => {
    setModal(true)
    setCatelog({
      _id: d._id,
      shop_id: d.shop_id._id,
      title: d.title,
      description: d.description,
      expiredate: d.expiredate
    })
    setUpdateMode(true)
    console.log(d)
    console.log(catelog)
  }
  

  return (
    <div>
        {/* <Sidebar />
        <Navbar />

        <Content> */}
        <>

        <ToastContainer/>
        {modal && 
            <Modal 
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={onSave}
            title='Add catelog'> 
              
              <Form 
                catelog={catelog}
                setCatelog={setCatelog}
              />
                                        {formError && <div className='text-red-500'>{formError}</div>}

            </Modal>
          }
          
          <Card>
            
            <div className='w-full py-4 flex gap-6'>

              <ButtonSuccess onClick={toggleModal}>
                <RiAddCircleLine className='w-5 h-5'/>
                <span>Add Catelog</span>
              </ButtonSuccess>

            </div>

            <Table>

              <THead>
                <TH title={'Id'}/>
                <TH title={'Title'}/>
                <TH title={'Expired Date'}/>
                <TH title={'Actions'}/>
              </THead>

              <TBody>

                {data.map(d => {
                  return (
                    <Row key={d?._id}>
                      <TD>
                        { d?._id }
                      </TD>
                      <TD>
                        { d.title }
                      </TD>

                      <TD>
                        { normalizeDate(d.expiredate) }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>

                          <Link to={{ pathname: '/catelog/pages', search: `shop=${d.shop_id?._id}&catelog=${d?._id}` }}>
                            <RiPagesFill className='w-4 h-4 fill-emerald-500 cursor-pointer'/>
                          </Link>
                          <a href={`${clientAppUrl}/catalog-preview/${d?._id}`} target="_blank" rel="noopener noreferrer">
                            <MdPreview className='w-4 h-4 fill-green-500 cursor-pointer'/>
                          </a>
                          <FaTrash onClick={() => onDelete(d?._id)} className='w-3 h-3 fill-red-500 cursor-pointer'/>
                          <PencilAltIcon onClick={() => onUpdate(d)} className='w-4 h-4 fill-blue-500 cursor-pointer'/>

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

export default Catalog