import React from 'react'

const Navbar = ({screen}) => {
  return (
    <nav className={`${screen ? 'w-full ml-16' : 'nav ml-56'} h-20 px-4 fixed top-0 right-0 left-0 bg-white shadow-md`}>
        <slot></slot>
    </nav>
  )
}

export default Navbar