import React, { useState,useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { RiAddCircleLine } from 'react-icons/ri'
import { ButtonNormal} from '../components/shared/Button'
import Modal from '../components/shared/Modal'
import TextInput from '../components/shared/TextInput'
import baseUrl from '../utils/baseUrl'


const Category = () => {
  const [data, setData] =useState([])
    
  useEffect( () => {
      async function fetchData() {
          try {
              const res = await axios.get(baseUrl+'/category'); 
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
        <Sidebar />
        <Navbar />

        <Content>
        {modal && 
            <Modal 
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={onSave}
            title='Categories'
            width='w-1/2'
            > 
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Main Categories(English)' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Icon' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Category Name(English)' 
                    border
                    borderColor='border-gray-600'
                  />
                </div>
                <div className= 'flex-1'>
                  <TextInput 
                    label='Category Name(Italy)' 
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
                <TH title={'#'}/>
                <TH title={'View Order'}/>
                <TH title={'Name'}/>
                <TH title={'Sub Name(1) English'}/>
                <TH title={'Sub Name(2) English'}/>
                <TH title={'Sub Name(3) English'}/>
                <TH title={'Sub Name(1) Italy'}/>
                <TH title={'Sub Name(2) Italy'}/>
                <TH title={'Sub Name(3) Italy'}/>
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
                        { d.ViewOrder }
                      </TD>

                      <TD>
                        { d.Name }
                      </TD>
                      <TD>
                        { d.SubName1En }
                      </TD>
                      <TD>
                        { d.SubName2En }
                      </TD>
                      <TD>
                        { d.SubName3En }
                      </TD>
                      <TD>
                        { d.SubName1It }
                      </TD>
                      <TD>
                        { d.SubName2It }
                      </TD>
                      <TD>
                        { d.SubName3It }
                      </TD>
                      <TD>
                        <div className='w-full h-full flex items-center justify-center gap-4'>
                          <FaTrash className='w-3 h-3 fill-red-500 cursor-pointer'/>
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

export default Category