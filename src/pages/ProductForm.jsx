import React, { useState } from "react";
import upload_icon from "../assets/upload_area.png";
import { toast } from "react-toastify";
import axiosInstance from "../axios";
import { useAuth } from "@clerk/clerk-react";
import { useLoading } from "../contexts/LoadingContext";

function ProductForm({ onSubmitted }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Men",
        subcategory: "Topwear",
        stock_details: [
            { size: "M", quantity: 0 },
            { size: "L", quantity: 0 },
            { size: "XL", quantity: 0 }
        ],
        bestseller: false,
    });
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useAuth();
    const { showLoading, hideLoading } = useLoading();

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
                formData.append(
                    "stock_details",
                    JSON.stringify(form.stock_details)
                );
                console.log(typeof JSON.stringify(form.stock_details));
            } else {
                formData.append(key, form[key]);
            }
        }

        images.forEach((img) => formData.append("images", img));

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            if (isSubmitting) return;
            setIsSubmitting(true);
            showLoading("Creating product...");

            const token = await getToken();
            await axiosInstance.post("/api/products/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("product added...");
            onSubmitted && onSubmitted();
            setForm({
                name: "",
                description: "",
                price: "",
                category: "Men",
                subcategory: "Topwear",
                stock_details: [
                    { size: "M", quantity: 0 },
                    { size: "L", quantity: 0 },
                    { size: "XL", quantity: 0 }
                ],
                bestseller: false,
            });
            setImages([]);
        } catch (err) {
            console.error(err.response?.data);
            toast.error("Error creating product");
        } finally {
            setIsSubmitting(false);
            hideLoading();
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
                                accept="image/*"
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
                <p className="mb-3 font-medium text-gray-700">Stock Details</p>
                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.stock_details.map((stock, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-3 font-medium text-gray-900">{stock.size}</td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            min={0}
                                            value={stock.quantity}
                                            onChange={(e) => {
                                                const updated = [...form.stock_details];
                                                updated[idx].quantity = Number(e.target.value);
                                                setForm((f) => ({ ...f, stock_details: updated }));
                                            }}
                                            className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                disabled={isSubmitting}
                className={`w-28 py-3 mt-4 text-white flex items-center justify-center ${
                    isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-black"
                }`}
            >
                {isSubmitting ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            ></path>
                        </svg>
                        Submitting...
                    </>
                ) : (
                    "Submit"
                )}
            </button>
        </form>
    );
}

export default ProductForm;
