import React from 'react'
import { NavLink } from 'react-router-dom'
import add_icon from '../assets/add_icon.png'
import order_icon from '../assets/order.png'
import list_icon from '../assets/list.png'

const SideBar = () => {
  return (
    <div className='md:w-[18%] md:min-h-screen md:border-r-2 md:relative fixed bottom-0 left-0 right-0 bg-white border-t-2 md:border-t-0 z-10'>
      <div className='flex md:flex-col flex-row gap-4 md:pt-6 md:pl-[20%] p-4 text-[15px] justify-center md:justify-start'>
          <NavLink className= 'flex items-center gap-3 border border-gray-300 md:border-r-0 px-3 py-2 md:rounded-l rounded' to='/'>
            <img className='w-5 h-5' src= {add_icon} alt="" />
            <p className='hidden md:block'>Add Items</p>
          </NavLink>

          <NavLink className= 'flex items-center gap-3 border border-gray-300 md:border-r-0 px-3 py-2 md:rounded-l rounded' to='/list'>
            <img className='w-5 h-5' src= {list_icon} alt="" />
            <p className='hidden md:block'>List Items</p>
          </NavLink>

          <NavLink className= 'flex items-center gap-3 border border-gray-300 md:border-r-0 px-3 py-2 md:rounded-l rounded' to='/orders'>
            <img className='w-5 h-5' src= {order_icon} alt="" />
            <p className='hidden md:block'>Order Items</p>
          </NavLink>
      </div>
    </div> 
  )
}

export default SideBar