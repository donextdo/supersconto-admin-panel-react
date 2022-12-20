import React from 'react'

const Navbar = () => {
  return (
    <nav className="nav h-20 px-4 fixed top-0 right-0 left-0 ml-56 bg-white shadow-md">
        <slot></slot>
    </nav>
  )
}

export default Navbar