import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";

const Orders = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                showLoading("Loading orders...");
                const token = await getToken();
                const res = await axiosInstance.get("/all-orders/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res.data)
                setOrders(res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                hideLoading();
            }
        };

        fetchOrders();
    }, []);



    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Orders Management</h2>
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No orders found.</p>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-lg border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">#{order.id}</td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{order.address.first_name} {order.address.last_name}</p>
                                                <p className="text-sm text-gray-600">{order.user}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">₹{(order.total_amount / 100).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.delivery_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.delivery_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.delivery_status.charAt(0).toUpperCase() + order.delivery_status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
                                                    navigate(`/orders/${order.id}`);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg border p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="font-medium text-base">#{order.id}</p>
                                        <p className="text-sm text-gray-600 truncate">{order.address.first_name} {order.address.last_name}</p>
                                        <p className="text-xs text-gray-500 truncate">{order.user}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                        order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.delivery_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.delivery_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.delivery_status.charAt(0).toUpperCase() + order.delivery_status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-base">₹{(order.total_amount / 100).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
                                            navigate(`/orders/${order.id}`);
                                        }}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Orders;
