import React, { useState, useEffect } from 'react'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import { Table, THead, TBody, TH, Row, TD } from '../components/shared/Table'
import axios from 'axios'
import { ButtonSuccess, ButtonNormal } from '../components/shared/Button'
import { FcClearFilters } from 'react-icons/fc'
import baseUrl from '../utils/baseUrl'
import Dropdown from '../components/shared/Dropdown'


const Order = () => {

  const [orderData, setOrderData] = useState([])
  const [modal, setModal] = useState(false)
  const [shops, setShops] = useState([])
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    fetchData()
    fetchShops()
  }, [])

  async function fetchData() {
    try {
      const { data } = await axios.get(`${baseUrl}/order`)
      setOrderData(data)
    }
    catch (error) {
      console.log(error)
    }
      
  }

  async function fetchShops() {

    try {
      const res = await axios.get(`${baseUrl}/shop`);
      const shopData = res?.data.map(d => {
          return {
              value: d._id,
              label: d.shop_name
          }
      })
      setShops(shopData);
    }
    catch (error) {
      console.log(error)
    }

  }

  const handleDropDownChange = async (selectedOption) => {
    try {
      const shop = selectedOption.value
      setFilter(shop)
      const { data } = await axios.post(`${baseUrl}/order/by-shop`,
        {
          shop
        }
      )

      console.log(data)

      setOrderData(data)
    }
    catch (error) {
      console.log(error)
    }
  }

  const clearFilter = async () => {
    await fetchData()
    setFilter(null)
  }

  const onSave = () => {
    alert('onsave clicked')
  }

  const onCancel = () => {
    setModal(false)
  }


  return (
    <div>
      {/* <Sidebar />
      <Navbar />

      <Content> */}
      
        <Card>

          <div className='w-full py-4 flex gap-6'>

            <div className='flex w-2/5'>
              <div className='py-2 px-3 whitespace-nowrap bg-gray-600 text-white text-sm font-medium'>
                Filter by shop
              </div>

              <div className='w-full'>
                <Dropdown
                    options={shops}
                    onChange={handleDropDownChange}
                />
              </div>
            </div>

            <ButtonNormal onClick={clearFilter} disabled={!filter}>
                <FcClearFilters className='w-5 h-5'/>
                <span>Clear Filter</span>
            </ButtonNormal>

          </div>

          <Table>

            <THead>
              <TH title={'Order Id'} />
              <TH title={'Shop'} />
              <TH title={'Customer'} />
              <TH title={'Mobile'} />
              <TH title={'Billing Address'} />
              <TH title={'Payment method'} />
              <TH title={'Status'} />
              <TH title={'Total Price'} />
            </THead>

            <TBody>

              {orderData.map(order => {
                return (
                  <Row key={order._id}>


                    <TD>
                      {order._id}
                    </TD>

                    <TD>
                      {order.shop.shop_name}
                    </TD>

                    <TD>
                      {order.customer.fullName}
                    </TD>
                    <TD>
                      {order.phone}
                    </TD>
                    <TD>
                      {`${order.billingAddress.address_line1}, ${order.billingAddress.city}, ${order.billingAddress.state}`}
                    </TD>
                    <TD>
                      {order.paymentMethod}
                    </TD>
                    <TD>
                      {order.status}
                    </TD>
                    <TD>
                      {order.totalPrice}
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

export default Order