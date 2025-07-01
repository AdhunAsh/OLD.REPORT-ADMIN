import React, { useState } from 'react'
import upload_icon from '../assets/upload_area.png'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import instance from '../axios'

const Add = () => {
  // Use a single array for images
  const [images, setImages] = useState([null, null, null, null])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("bestseller", bestseller)
      formData.append("category", category )
      formData.append("subcategory", subcategory )
      formData.append("sizes", JSON.stringify(sizes))

      // Append all images as a list
      images.forEach((img) => {
        if (img) formData.append("images", img)
      })

      console.log(formData)

      const response = await instance.post("/api/products/", formData)
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setSizes([])
        setBestseller(false)
        setImages([null, null, null, null])
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form className='flex flex-col w-full items-start gap-3' onSubmit={onSubmitHandler}>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map((idx) => (
            <label htmlFor={`image${idx + 1}`} key={idx}>
              <img
                className='w-20'
                src={!images[idx] ? upload_icon : URL.createObjectURL(images[idx])}
                alt=""
              />
              <input
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[idx] = e.target.files[0];
                  setImages(newImages);
                }}
                type="file"
                id={`image${idx + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full max-w-[500px] px-2 py-2'
          type='text'
          placeholder='Type here..'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='w-full max-w-[500px] px-2 py-2'
          type='text'
          placeholder='Write the description..'
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select value={category} onChange={()=>setCategory(value)} className='w-full px-3 py-2'>
            <option value="Men">Men</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Subcategory</p>
          <select value={subcategory} onChange={()=>setSubcategory(value)} className='w-full px-3 py-2'>
            <option value="topwear">Topwear</option>
            <option value="bottomwear">Bottomwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            className='w-full px-3 py-2 sm:w-[120px]'
            type="number"
            placeholder='0'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {['M', 'L', 'XL'].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                }  px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className='cursor-pointer' htmlFor='bestseller'>
          Add to Bestseller
        </label>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>
        Add
      </button>
    </form>
  )
}

export default Add