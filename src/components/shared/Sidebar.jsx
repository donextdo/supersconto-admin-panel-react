import React from 'react'
import logo from '../../assets/react.svg'
import { Link } from 'react-router-dom'
import {ChartPieIcon } from '@heroicons/react/solid'
import { FaShopify,FaFirstOrder,FaList } from "react-icons/fa";
import { BiCategory,BiNews,BiBook ,BiClipboard} from "react-icons/bi";
import { TbUsers } from "react-icons/tb";
import { AiOutlineStock} from "react-icons/ai";




const Sidebar = ({ minimize }) => {
  return (
    <div className={`${ minimize ? 'w-16' : 'w-56'} fixed left-0 top-0 bottom-0 h-screen bg-slate-900 flex flex-col gap-10 text-white`}>
    
        <div className="w-full h-20 border-b border-slate-700 flex items-center px-4 py-3">

            <img src={logo} alt="" />

        </div>

        <ul className="w-full h-max flex flex-col gap-2">

          

            {/* <li className="listItem">
                <Link to={'/'} className="listItemLink">
                    <ChartPieIcon className='w-5 h-5'/>
                    {!minimize && <span>Dashboard</span>} 
                </Link>
            </li> */}

            <li className="listItem">
                <Link to={'/shop'} className="listItemLink">
                    <FaShopify className='w-5 h-5'/>
                    {!minimize && <span>Shop</span> }
                </Link>
            </li>

            <li className="listItem">
                <Link to={'/catelog'} className="listItemLink">
                    <BiBook className='w-5 h-5'/>
                    {!minimize && <span>Catalog</span> }
                </Link>
            </li>

            <li className="listItem">
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

            <li className="listItem">
                <Link to={'/news'} className="listItemLink">
                    <BiNews className='w-5 h-5'/>
                    {!minimize && <span>News</span>}
                </Link>
            </li>

            {/* <li className="listItem">
                <Link to={'/orders'} className="listItemLink">
                    <BiClipboard className='w-5 h-5'/>
                    {!minimize && <span>Orders</span>}
                </Link>
            </li> */}

            <li className="listItem">
                <Link to={'/stocks'} className="listItemLink">
                    <AiOutlineStock className='w-5 h-5'/>
                    {!minimize && <span>Stocks</span>}
                </Link>
            </li>

            <li className="listItem">
                <Link to={'/vender'} className="listItemLink">
                    <TbUsers className='w-5 h-5'/>
                    {!minimize && <span>Vender</span>}
                </Link>
            </li>
        </ul>

        <div className="w-full h-max flex flex-col px-4 self-baseline">
        
        </div>
        
    </div>
  )
}

export default Sidebar