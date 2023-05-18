import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo.jpg'
import { Link, useLocation } from 'react-router-dom'
import {ChartPieIcon } from '@heroicons/react/solid'
import { FaShopify,FaFirstOrder,FaList } from "react-icons/fa";
import { BiCategory,BiNews,BiBook ,BiClipboard} from "react-icons/bi";
import { TbUsers,TbLogout} from "react-icons/tb";
import { AiOutlineStock} from "react-icons/ai";


const Sidebar = () => {

const location = useLocation()
const [minimize, setMinimize] = useState(false)
const pathname = location.pathname
const logout=()=>{
    sessionStorage.clear()
    localStorage.clear()
}
useEffect(() => {
    
    console.log(pathname)
    if(
        pathname == '/catelog/pages/items' ||
        pathname == '/catelog/pages'
    ) {
        setMinimize(true)
    }
    else {
        setMinimize(false)
    }
}, [pathname])

  return (
    <div className={`${ minimize ? 'w-16' : 'w-56'} fixed left-0 top-0 bottom-0 h-screen bg-slate-900 flex flex-col gap-10 text-white`}>
    
        <div className="w-full h-20 border-b border-slate-700 flex items-center px-4 py-3">

            <img src={logo} alt="" />

        </div>

        <ul className="w-full h-max flex flex-col gap-2">

          
{/* 
            <li className={pathname=='/shop'? 'listItem active' :'listItem'}>
                <Link to={'/'} className="listItemLink">
                    <ChartPieIcon className='w-5 h-5'/>
                    {!minimize && <span>Dashboard</span>} 
                </Link>
            </li> */}
{}
            <li className={pathname=='/shop'? 'listItem active' :'listItem'}>
                <Link to={'/shop'} className="listItemLink">
                    <FaShopify className='w-5 h-5'/>
                    {!minimize && <span>Shop</span> }
                </Link>
            </li>

            <li className={pathname=='/catelog'? 'listItem active' :'listItem'}>
                <Link to={'/catelog'} className="listItemLink">
                    <BiBook className='w-5 h-5'/>
                    {!minimize && <span>Catalog</span> }
                </Link>
            </li>

            <li className={pathname=='/category'? 'listItem active' :'listItem'}>
                <Link to={'/category'} className="listItemLink">
                    <FaList className='w-5 h-5'/>
                    {!minimize && <span>Category</span>}
                </Link>
            </li>

            {/* <li className="listItem">
                <Link to={'/users'} className="listItemLink">
                    <TbUsers className='w-5 h-5'/>
                    {!minimize && <span>Users</span>}
                </Link>
            </li> */}

            <li className={pathname=='/news'? 'listItem active' :'listItem'}>
                <Link to={'/news'} className="listItemLink">
                    <BiNews className='w-5 h-5'/>
                    {!minimize && <span>News</span>}
                </Link>
            </li>

            <li className={pathname=='/orders'? 'listItem active' :'listItem'}>
                <Link to={'/orders'} className="listItemLink">
                    <BiClipboard className='w-5 h-5'/>
                    {!minimize && <span>Orders</span>}
                </Link>
            </li>

            <li className={pathname=='/stocks'? 'listItem active' :'listItem'}>
                <Link to={'/stocks'} className="listItemLink">
                    <AiOutlineStock className='w-5 h-5'/>
                    {!minimize && <span>Stocks</span>}
                </Link>
            </li>

            <li className={pathname=='/vender'? 'listItem active' :'listItem'}>
                <Link to={'/vender'} className="listItemLink">
                    <TbUsers className='w-5 h-5'/>
                    {!minimize && <span>Vender</span>}
                </Link>
            </li>
            <li onClick={logout} className={pathname=='/login'? 'listItem active' :'listItem'}>
                <Link to={'/login'} className="listItemLink">
                    <TbLogout className='w-5 h-5'/>
                    {!minimize && <span>Logout</span>}
                </Link>
            </li>
        </ul>

    </div>
  )
}

export default Sidebar