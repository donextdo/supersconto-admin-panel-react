import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

const Navbar = () => {

    const location = useLocation()
    const [screen, setScreen] = useState(false)
    const pathname = location.pathname
    const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null

    useEffect(() => {

        if (
            pathname == '/catelog/pages/items' ||
            pathname == '/catelog/pages'
        ) {
            setScreen(true)
        } else {
            setScreen(false)
        }
    }, [pathname])

    return (
        <nav
            className={`${screen ? 'w-full ml-16' : 'nav ml-56'}  h-20 px-4 fixed top-0 right-0 left-0 bg-white shadow-md z-50 flex items-center justify-end`}>
            {`${userData?.userType === 0 ? 'Admin' : 'Vendor'} : ${userData?.email}`}
        </nav>
    )
}

export default Navbar