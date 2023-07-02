import React, {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {Content, Card} from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'

const Main = (props) => {

    const location = useLocation()
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        console.log(location.pathname)
        const token = localStorage.getItem('token')
        if (!token) {
            setIsLoggedIn(false)
            navigate('/login')

        } else {
            setIsLoggedIn(true)
        }
    }, [])

    return (

        <>{isLoggedIn ?
            <>
                <Sidebar/>
                <Navbar/>

                <Content>
                    <Outlet/>
                </Content>
            </> : <>
            </>}

        </>

    )
}

export default Main