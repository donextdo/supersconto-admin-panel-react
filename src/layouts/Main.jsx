import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Content, Card } from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'

const Main = () => {

const location = useLocation()

useEffect(() => {
    console.log(location.pathname)
}, [])

  return (
    
    <>
        <Sidebar />
        <Navbar />

        <Content>
            <Outlet />
        </Content>
        
    </>
    
  )
}

export default Main