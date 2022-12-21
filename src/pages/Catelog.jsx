import React, { useState, useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
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

const Catalog = () => {

  const [data, setData] =useState([])
  const [modal, setModal] = useState(false)
  const [catelog, setCatelog] = useState({
    shop_id: '',
    title: '',
    description: '',
    expiredate: ''
  })
    
  useEffect( () => {
      fetchData();
  }, []);

  async function fetchData() {
    try {
        const res = await axios.get('http://apidev.marriextransfer.com/v1/api/catelog/book'); 
        setData(res.data);
    } catch (err) {
        console.log(err);
    }
  }
  
  const toggleModal = () => {
    setModal(!modal)
  }

  const onSave = async () => {
    try {

      const res = await axios.post('http://apidev.marriextransfer.com/v1/api/catelog/book', catelog)
      console.log(res.data)

      fetchData()

      setCatelog({
        shop_id: '',
        title: '',
        description: '',
        expiredate: ''
      })

      setModal(!modal)

    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    toggleModal()
  }

  const onDelete = async (id) => {
    try {

      const res = await axios.delete(`http://apidev.marriextransfer.com/v1/api/catelog/book/${id}`)
      console.log(res.data)

      fetchData()

    } catch (error) {
      console.log(error)
    }
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
            title='Add catelog'> 
              
              <Form 
                catelog={catelog}
                setCatelog={setCatelog}
              />

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
                    <Row key={d._id}>
                      <TD>
                        { d._id }
                      </TD>
                      <TD>
                        { d.title }
                      </TD>

                      <TD>
                        { normalizeDate(d.expiredate) }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>

                          <Link to={{ pathname: '/catelog/pages', search: `shop=${d.shop_id}&catelog=${d._id}` }}>
                            <RiPagesFill className='w-4 h-4 fill-emerald-500 cursor-pointer'/>
                          </Link>
                          <MdPreview className='w-4 h-4 fill-green-500 cursor-pointer'/>
                          <FaTrash onClick={() => onDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer'/>
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

export default Catalog