import React, { useState } from "react";
import instance from "../axios";
import upload_icon from "../assets/upload_area.png";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import axios from "axios";

function ProductForm({ onSubmitted }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Men",
        subcategory: "Topwear",
        stock_details: [],
        bestseller: false,
    });
    const [images, setImages] = useState([]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle image selection
    const handleImageChange = (e, idx) => {
        const newImages = [...images];
        newImages[idx] = e.target.files[0];
        setImages(newImages);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (let key in form) {
            if (key === "stock_details") {
                formData.append("stock_details", JSON.stringify(form.stock_details));
                console.log(typeof(JSON.stringify(form.stock_details)))

            } else {
                formData.append(key, form[key]);
            }
        }

        images.forEach((img) => formData.append("images", img));

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {

            await axios.post(`${backendUrl}/api/products/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("product added...");
            onSubmitted && onSubmitted();
            setForm({
                name: "",
                description: "",
                price: "",
                category: "Men",
                subcategory: "Topwear",
                stock_details: [],
                bestseller: false,
            });
            setImages([]);
        } catch (err) {
            console.error(err.response?.data);
            toast.error("Error creating product");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <p className="mb-2">Upload Image</p>
                <div className="flex gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                        <label htmlFor={`image${idx + 1}`} key={idx}>
                            <img
                                className="w-20"
                                src={
                                    !images[idx]
                                        ? upload_icon
                                        : URL.createObjectURL(images[idx])
                                }
                                alt=""
                            />
                            <input
                                onChange={(e) => handleImageChange(e, idx)}
                                type="file"
                                id={`image${idx + 1}`}
                                hidden
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <p className="mb-2">Product Name</p>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    className="w-full max-w-[500px] px-2 py-2"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="w-full">
                <p className="mb-2">Product Description</p>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    className="w-full max-w-[500px] px-2 py-2"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                    <p className="mb-2">Product Category</p>
                    <select
                        name="category"
                        value={form.category}
                        className="w-full px-3 py-2"
                        onChange={handleChange}
                    >
                        <option>Men</option>
                        <option>Women</option>
                        <option>Kids</option>
                    </select>
                </div>
                <div>
                    <p className="mb-2">Product Subcategory</p>
                    <select
                        name="subcategory"
                        value={form.subcategory}
                        className="w-full px-3 py-2"
                        onChange={handleChange}
                    >
                        <option>Topwear</option>
                        <option>Bottomwear</option>
                    </select>
                </div>
                <div>
                    <p className="mb-2">Product Price</p>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        className="w-full px-3 py-2 sm:w-[120px]"
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div>
                <p className="mb-2 font-medium">Stock Details</p>
                <div className="flex flex-col gap-2">
                    {form.stock_details.map((stock, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <select
                                value={stock.size}
                                onChange={(e) => {
                                    const updated = [...form.stock_details];
                                    updated[idx].size = e.target.value;
                                    setForm((f) => ({
                                        ...f,
                                        stock_details: updated,
                                    }));
                                }}
                                className="px-2 py-1 border"
                                required
                            >
                                <option value="">Select Size</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                            <input
                                type="number"
                                min={0}
                                value={stock.quantity}
                                onChange={(e) => {
                                    const updated = [...form.stock_details];
                                    updated[idx].quantity = Number(
                                        e.target.value
                                    );
                                    setForm((f) => ({
                                        ...f,
                                        stock_details: updated,
                                    }));
                                }}
                                className="px-2 py-1 border w-20"
                                placeholder="Stock"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = form.stock_details.filter(
                                        (_, i) => i !== idx
                                    );
                                    setForm((f) => ({
                                        ...f,
                                        stock_details: updated,
                                    }));
                                }}
                                className="text-red-500 px-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="text-left">
                        <button
                            type="button"
                            onClick={() =>
                                setForm((f) => ({
                                    ...f,
                                    stock_details: [
                                        ...f.stock_details,
                                        { size: "", quantity: 0 },
                                    ],
                                }))
                            }
                            className="text-blue-500 mt-2"
                        >
                            + Add Size
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    name="bestseller"
                    onChange={handleChange}
                    checked={form.bestseller}
                    type="checkbox"
                    id="bestseller"
                />
                <label className="cursor-pointer" htmlFor="bestseller">
                    Add to Bestseller
                </label>
            </div>

            <button
                type="submit"
                className="w-28 py-3 mt-4 bg-black text-white"
            >
                Submit
            </button>
        </form>
    );
}

export default ProductForm;
