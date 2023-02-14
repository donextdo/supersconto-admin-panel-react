import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'

export const Content = ({ children }) => {
const location = useLocation()
const [expand, setExpand] = useState(false)
const pathname = location.pathname

useEffect(() => {
    
    if(
        pathname == '/catelog/pages/items' ||
        pathname == '/catelog/pages'
    ) {
      setExpand(true)
    } else {
      setExpand(false)
    }
}, [pathname])
  return (
    <div className={`${expand ? 'content-expand' : 'content'}`}>
        { children }
    </div>
  )
}


export const Card = ({ children, title }) => {
  return (
    <div className="w-full px-6 py-7 bg-white shadow-md">

      { title && 
        <h3 className="text-lg font-semibold text-gray-800">
          { title }
      </h3>
      }

      { children }
    </div>
  )
}