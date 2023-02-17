import React, { useEffect } from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'

const Main = (props) => {

const location = useLocation()
const navigate = useNavigate()

useEffect(() => {
    console.log(location.pathname)
    const token = localStorage.getItem('token')
    if (!token) {
        navigate('/login', { replace: true })
    }
}, [])

  return (
    
    <>
        <Sidebar />
        <Navbar />

        <Content>
            <Outlet/>
        </Content>
        
    </>
    
  )
}

export default Main