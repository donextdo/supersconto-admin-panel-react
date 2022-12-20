import React, { useState,useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import { FaTrash } from 'react-icons/fa'
import { PencilAltIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { ButtonSuccess} from '../components/shared/Button'



const Order = () => {

  const [data, setData] =useState([])
    
  useEffect( () => {
      async function fetchData() {
          try {
              const res = await axios.get('http://localhost/orders.php'); 
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
          
          <Card>
            <div className='py-4'>
                <ButtonSuccess >
                 Print List
                </ButtonSuccess>
            </div>
             
            <Table>

              <THead>
                <TH title={'Id'}/>
                <TH title={'Amount'}/>
                <TH title={'Address'}/>
                <TH title={'Items'}/>
                <TH title={'Status'}/>
                <TH title={'Additional notes'}/>
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
                        { d.Amount }
                      </TD>
                      <TD>
                        { d.Address }
                      </TD>
                      <TD>
                        { d.items }
                      </TD>
                      <TD>
                        { d.Status }
                      </TD>
                      <TD>
                        { d.Additionalnotes }
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

export default Order