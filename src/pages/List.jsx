import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { backendUrl, currency } from '../App'
import axios from 'axios'
import instance from '../axios'


const List = () => {

  const [list, setList] = useState([])

  // const fetchList = async () => {
  //   const res = await axios.get('http://localhost:8000/api/products/');
  //   console.log(res)
  //   setList(res.data);

  // };
  const fetchList = async () => {
    try {
      console.log('calling API:', backendUrl + '/api/products/');
      const res = await axios.get( backendUrl + '/api/products/');
      console.log(res)
      if (res.data) {
        setList(res.data);
      } else {
        toast.error(res.data)
      }

    } catch (error) {
      toast.error(error.res?.data?.message || 'Failed to fetch product list');
    }
  }

  const removeProduct = async (id) => {
    try {
      
      const res = await instance.delete( `/api/products/delete/${id}/`);
      console.log(res)
      if (res) {
        toast.success('product deleted...')
        await fetchList();
      } else {
        toast.error(res.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  useEffect(()=>{
    fetchList();
  },[])

    return (
      <>
        <p className='mb-2'>All Products List</p>
        <div className='flex flex-col gap-2'>

          {/* List Table Title */}

          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
            <b>Image</b>
            <b>Name</b>
            <b>Price</b>
            <b className='text-center'>Action</b>
          </div>

          {/* Product list */}

          {
            list.map((item, index)=>(
              <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                <img src= {`${backendUrl}${item.images[0].image}`} className='w-12' alt="" />  
                <p>{item.name}</p>
                <p>{currency}{item.price}</p>
                <p onClick={()=>removeProduct(item.id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
              </div>
            ))
          }

        </div>
      </>
    )
}

export default List