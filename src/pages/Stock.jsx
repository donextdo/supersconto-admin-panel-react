import React, { useState,useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import axios from 'axios'



const Stocks = () => {

    const [data, setData] =useState([])
      
    useEffect( () => {
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
            
            <Table>

              <THead>
                <TH title={'Shop Name'}/>
                <TH title={'Catalog Name'}/>
                <TH title={'Product Name'}/>
                <TH title={'Quantity'}/>
              </THead>

              <TBody>

                {data.map(d => {
                  return (
                    <Row key={d.id}>
                    

                      <TD>
                        { d.shopName }
                      </TD>

                      <TD>
                        { d.catalogName }
                      </TD>

                      <TD>
                        { d.productName }
                      </TD>
                      <TD>
                        { d.quantity }
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