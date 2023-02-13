import React, { useState, useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import axios from 'axios'
import { ButtonSuccess } from '../components/shared/Button'
import { RiAddCircleLine,} from 'react-icons/ri'
import Modal from '../components/shared/Modal'



const Stocks = () => {

  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost/stock.php');
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  

  const toggleModal = () => {
    setModal(!modal)
  }

  const onSave = () => {
    alert('onsave clicked')
  }

  const onCancel = () => {
    setModal(false)
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
              

            </Modal>
          }
        <Card>

          <div className='w-full py-4 flex gap-6'>

            <ButtonSuccess onClick={toggleModal}>
              <RiAddCircleLine className='w-5 h-5' />
              <span>Add Stock</span>
            </ButtonSuccess>

          </div>

          <Table>

            <THead>
              <TH title={'ID'} />
              <TH title={'Item Name'} />
              <TH title={'Shop Name'} />
              <TH title={'Shop Address'} />
              <TH title={'Quantity'} />
            </THead>

            <TBody>

              {data.map(d => {
                return (
                  <Row key={d.id}>


                    <TD>
                      {d.shopName}
                    </TD>

                    <TD>
                      {d.catalogName}
                    </TD>

                    <TD>
                      {d.productName}
                    </TD>
                    <TD>
                      {d.shopAddress}
                    </TD>
                    <TD>
                      {d.quantity}
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

export default Stocks