import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { currency } from "../App";
import axios from "axios";
import axiosInstance from "../axios";
import { backendUrl } from "../App";
import { useAuth } from "@clerk/clerk-react";
import { useLoading } from "../contexts/LoadingContext";

const List = () => {
    const [list, setList] = useState([]);
    const { getToken } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    // const fetchList = async () => {
    //   const res = await axios.get('http://localhost:8000/api/products/');
    //   console.log(res)
    //   setList(res.data);

    // };
    const fetchList = async () => {
        try {
            showLoading("Loading products...");
            const res = await axiosInstance.get("/api/products/");
            console.log(res);
            if (res.data) {
                setList(res.data);
            } else {
                toast.error(res.data);
            }
        } catch (error) {
            toast.error(
                error.res?.data?.message || "Failed to fetch product list"
            );
        } finally {
            hideLoading();
        }
    };

    const removeProduct = async (id) => {
        try {
            showLoading("Deleting product...");
            const token = await getToken();
            const res = await axiosInstance.delete(
                `/api/products/delete/${id}/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(res);
            if (res) {
                toast.success("product deleted...");
                await fetchList();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Failed to delete product"
            );
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="animate-fade-in">
            <p className="mb-2">All Products List</p>
            <div className="flex flex-col gap-2">
                {/* List Table Title */}

                <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Qty</b>
                    <b>Price</b>
                    <b className="text-center">Action</b>
                </div>

                {/* Product list */}

                {list.map((item, index) => (
                    <div
                        className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                        key={index}
                    >
                        <img
                            src={`${item.images[0].image}`}
                            className="w-12"
                            alt=""
                        />
                        <p>{item.name}</p>
                        <p>
                            {item.stock_details
                                .map((s) => `${s.size}: ${s.quantity}`)
                                .join(", ")}
                        </p>
                        <p>
                            {currency}
                            {item.price}
                        </p>
                        <p
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this product?")) {
                                    removeProduct(item.id);
                                }
                            }}
                            className="text-right md:text-center cursor-pointer text-lg"
                        >
                            X
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;
