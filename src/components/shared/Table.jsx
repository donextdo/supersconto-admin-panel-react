import React from 'react'
import { FaSort } from 'react-icons/fa'

export const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto relative">
    
          <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
            { children }
          </table>
        
    </div>
  )
}

export const THead = ({ children }) => {
    return (
        <thead className="text-xs text-gray-700 uppercase border border-gray-100 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 ">
              <tr>
                { children }
              </tr>
        </thead>
    )
}

export const TBody = ({ children }) => {
    return (
        <tbody className="bg-white">
            { children }
        </tbody>
    )
}

export const TH = ({ title,width }) => {
    return (
        <th  scope="col" className={`relative px-6 py-3 font-medium tracking-wider cursor-pointer hover:bg-gray-300 whitespace-nowrap ${width}`}>
            <span className='mr-6'>
                { title }
            </span>
            
            <FaSort className='w-3 h-3 fill-gray-500 absolute right-6 top-0 bottom-0 my-auto'/>
        </th>
    )
}

export const Row = ({ children }) => {
    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            { children }
        </tr>
    )
}

export const TD = ({ children }) => {
    return (
        <td className="px-6 py-4 border-r border-l border-gray-100 whitespace-nowrap">
     
            { children }

        </td>
    )
}