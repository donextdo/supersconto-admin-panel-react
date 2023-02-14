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



const Vender = () => {

  const [data, setData] =useState([])
    
  useEffect( () => {
      async function fetchData() {
          try {
              const res = await axios.get('http://localhost/vender.php'); 
              setData(res.data);
          } catch (err) {
              console.log(err);
          }
      }
      fetchData();
  }, []);

  const [modal, setModal] = useState(false)
  
  const toggleModal = () => {
    setModal(!modal)
  }

  const onSave = () => {
    alert('onsave clicked')
  }

  const onCancel = () => {
    alert('oncancel clicked')
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
            onSave={onSave}
            title='Create Shop'
            width='w-1/2'
            > 
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='First Name' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Last Name' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Shop Name' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Email' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Telephone 1' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='User Name' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Telephone 2' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Password' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Personal Address' 
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
                <TH title={'Vender Name'}/>
                <TH title={'Shop Name'}/>
                <TH title={'Addresse'}/>
                <TH title={'Email'}/>
                <TH title={'Phone 1'}/>
                <TH title={'Phone 2'}/>
                <TH title={'Actions'}/>
              </THead>

              <TBody>

                {data.map(d => {
                  return (
                    <Row key={d.id}>
                     <TD>
                        { d.id }
                      </TD>   
                      <TD>
                        { d.vendername }
                      </TD>
                      <TD>
                        { d.shopname }
                      </TD>
                      <TD>
                        { d.address }
                      </TD>
                      <TD>
                        { d.email }
                      </TD>
                      <TD>
                        { d.mobile1 }
                      </TD>
                      <TD>
                        { d.mobile2 }
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

        {/* </Content> */}
    </div>
  )
}

export default Vender