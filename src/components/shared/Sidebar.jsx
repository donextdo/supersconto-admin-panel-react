import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { ChartPieIcon } from "@heroicons/react/solid";
import { FaShopify, FaFirstOrder, FaList } from "react-icons/fa";
import { BiCategory, BiNews, BiBook, BiClipboard } from "react-icons/bi";
import { TbUsers, TbLogout } from "react-icons/tb";
import { AiOutlineStock } from "react-icons/ai";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const [minimize, setMinimize] = useState(false);
  const [showSubmenus, setShowSubmenus] = useState(false);
  const [icon, setIcon] = useState("arrow-forward");
  const [selectedSubmenu, setSelectedSubmenu] = useState(null);
  const pathname = location.pathname;
  const userData = sessionStorage.getItem("user")
    ? JSON.parse(atob(sessionStorage.getItem("user")))
    : null;
  const isAdmin = userData?.userType === 0;

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
  };
  useEffect(() => {
    console.log(pathname);
    if (pathname == "/catelog/pages/items" || pathname == "/catelog/pages") {
      setMinimize(true);
    } else {
      setMinimize(false);
    }
  }, [pathname]);

  return (
    <div
      className={`${
        minimize ? "w-16" : "w-56"
      } fixed left-0 top-0 bottom-0 h-screen bg-green-900 flex flex-col gap-10 text-white`}
    >
      <div className="w-full h-20 border-b border-slate-700 flex items-center px-4 py-3 bg-white">
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
        <li className={pathname == "/shop" ? "listItem active" : "listItem"}>
          <Link to={"/shop"} className="listItemLink">
            <FaShopify className="w-5 h-5" />
            {!minimize && <span>Shop</span>}
          </Link>
        </li>

        <li className={pathname == "/catelog" ? "listItem active" : "listItem"}>
          <Link to={"/catelog"} className="listItemLink">
            <BiBook className="w-5 h-5" />
            {!minimize && <span>Catalog</span>}
          </Link>
        </li>

        <li
          className={pathname == "/category" ? "listItem active" : "listItem"}
        >
          <Link
            to={"/category"}
            className="listItemLink"
            onClick={() => {
              setShowSubmenus(!showSubmenus);
              setIcon(showSubmenus ? "arrow-forward" : "arrow-down");
            }}
          >
            <FaList className="w-5 h-5" />
            {!minimize && <span>Category</span>}
            {icon === "arrow-forward" && !minimize && (
              <MdKeyboardArrowRight className="w-5 h-5 ml-16" />
            )}
          </Link>
        </li>
        {showSubmenus && (
          <ul className="submenu">
            <Link to={"/sub-category-level-one"}>
              <li
                className={
                  pathname == "/sub-category-level-one"
                    ? "listItem active"
                    : "listItem"
                }
              >
                Sub Category Level 1
              </li>
            </Link>
            <Link to={"/sub-category-level-two"}>
              <li
                className={
                  pathname == "/sub-category-level-two"
                    ? "listItem active"
                    : "listItem"
                }
              >
                Sub Category Level 2
              </li>
            </Link>
            <Link to={"/sub-category-level-three"}>
              <li
                className={
                  pathname == "/sub-category-level-three"
                    ? "listItem active"
                    : "listItem"
                }
              >
                Sub Category Level 3
              </li>
            </Link>
            <Link to={"/sub-category-level-four"}>
              <li
                className={
                  pathname == "/sub-category-level-four"
                    ? "listItem active"
                    : "listItem"
                }
              >
                Sub Category Level 4
              </li>
            </Link>
          </ul>
        )}
        {/* <li className="listItem">
                <Link to={'/users'} className="listItemLink">
                    <TbUsers className='w-5 h-5'/>
                    {!minimize && <span>Users</span>}
                </Link>
            </li> */}

        {isAdmin && (
          <li className={pathname == "/news" ? "listItem active" : "listItem"}>
            <Link to={"/news"} className="listItemLink">
              <BiNews className="w-5 h-5" />
              {!minimize && <span>News</span>}
            </Link>
          </li>
        )}

        {isAdmin && (
          <li
            className={pathname == "/orders" ? "listItem active" : "listItem"}
          >
            <Link to={"/orders"} className="listItemLink">
              <BiClipboard className="w-5 h-5" />
              {!minimize && <span>Orders</span>}
            </Link>
          </li>
        )}

        <li className={pathname == "/stocks" ? "listItem active" : "listItem"}>
          <Link to={"/stocks"} className="listItemLink">
            <AiOutlineStock className="w-5 h-5" />
            {!minimize && <span>Stocks</span>}
          </Link>
        </li>

        {isAdmin && (
          <li
            className={pathname == "/vender" ? "listItem active" : "listItem"}
          >
            <Link to={"/vender"} className="listItemLink">
              <TbUsers className="w-5 h-5" />
              {!minimize && <span>Vender</span>}
            </Link>
          </li>
        )}
        <li
          onClick={logout}
          className={pathname == "/login" ? "listItem active" : "listItem"}
        >
          <Link to={"/login"} className="listItemLink">
            <TbLogout className="w-5 h-5" />
            {!minimize && <span>Logout</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
