import React, {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {Content, Card} from '../components/shared/Utils'
import Navbar from '../components/shared/Navbar'
import Sidebar from '../components/shared/Sidebar'
import axios from "axios";
import baseUrl from "../utils/baseUrl.js";

const Main = (props) => {

    const location = useLocation()
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect( () => {
        console.log(location.pathname)
        const token = localStorage.getItem('token')
        if (!token) {
            setIsLoggedIn(false)
            navigate('/login')

        } else {
            axios.get(`${baseUrl}/auth/user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${token}`,
                    'Accept': "application/json"
                }
            }).then((data) => {
                console.log({data})
                sessionStorage.setItem('user', btoa(JSON.stringify(data.data)))
                setIsLoggedIn(true)
            }).catch(err => {
                console.log({err})
                sessionStorage.removeItem('user')
                setIsLoggedIn(false)
                navigate('/login')
            })


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