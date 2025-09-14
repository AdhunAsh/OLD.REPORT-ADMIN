import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const { showLoading, hideLoading } = useLoading();

    const DELIVERY_STATUS_CHOICES = ["pending", "shipped", "delivered", "cancelled"];

    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem(`order_${id}`));
        if (orderData) {
            setOrder(orderData);
            setStatus(orderData.delivery_status);
        } else {
            navigate("/orders");
        }
    }, [id]);

    const updateStatus = async () => {
        try {
            showLoading("Updating status...");
            const token = await getToken();
            await axiosInstance.put(`/all-orders/${id}/`, 
                { delivery_status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrder(prev => ({ ...prev, delivery_status: status }));
            localStorage.setItem(`order_${id}`, JSON.stringify({ ...order, delivery_status: status }));
            toast.success("Status updated successfully");
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            hideLoading();
        }
    };

    if (!order) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button onClick={() => navigate("/orders")} className="text-blue-600 hover:text-blue-800">
                    ← Back to Orders
                </button>
                <h1 className="text-lg sm:text-2xl font-bold">Order #{order.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg border">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Information</h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Order ID:</span> {order.id}</p>
                        <p><span className="font-medium">User:</span> {order.user}</p>
                        <p><span className="font-medium">Phone:</span> {order.phone}</p>
                        <p><span className="font-medium">Total:</span> ₹{(order.total_amount / 100).toFixed(2)}</p>
                        <p><span className="font-medium">Created:</span> {new Date(order.created_at).toLocaleString()}</p>
                        <p className="break-all"><span className="font-medium">Razorpay Order ID:</span> {order.razorpay_order_id}</p>
                        <p className="break-all"><span className="font-medium">Payment ID:</span> {order.razorpay_payment_id}</p>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg border">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Shipping Address</h2>
                    <div className="text-sm space-y-1">
                        <p className="font-medium">{order.address.first_name} {order.address.last_name}</p>
                        <p>{order.address.address_line1}</p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>Postal Code: {order.address.postal_code}</p>
                        <p>Phone: {order.address.phone}</p>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg border lg:col-span-2">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Status Management</h2>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 border rounded-md"
                        >
                            {DELIVERY_STATUS_CHOICES.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                        <button
                            onClick={updateStatus}
                            disabled={status === order.delivery_status}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            Update Status
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Current: {order.delivery_status}</p>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg border mt-4 sm:mt-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 border rounded-md">
                            <img src={item.image} alt={item.product} className="w-16 h-16 object-cover rounded mx-auto sm:mx-0" />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-medium">{item.product}</h3>
                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;