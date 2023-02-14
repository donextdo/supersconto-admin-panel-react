import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'

const Navbar = () => {

const location = useLocation()
const [screen, setScreen] = useState(false)
const pathname = location.pathname

useEffect(() => {
    
    if(
        pathname == '/catelog/pages/items' ||
        pathname == '/catelog/pages'
    ) {
      setScreen(true)
    } else {
      setScreen(false)
    }
}, [pathname])

  return (
    <nav className={`${screen ? 'w-full ml-16' : 'nav ml-56'} h-20 px-4 fixed top-0 right-0 left-0 bg-white shadow-md`}>
        <slot></slot>
    </nav>
  )
}

export default Navbar