import React from 'react'
import logo from '../assets/logo.png'
import { useAuth } from '@clerk/clerk-react'

const NavBar = ({setToken}) => {

  const { signOut } = useAuth()

  return (
    <div className='flex items-center px-[4%] py-2 justify-between'>
      <div className='flex items-center gap-1'>
        <img className='w-[max(10%,8px)]' src= {logo}  alt="" />
        <p className='font-bold text-lg bg-red-100 px-2 rounded-md'>Admin</p>
      </div>
        <button onClick={()=> signOut()} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default NavBar