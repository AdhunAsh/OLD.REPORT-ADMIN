import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";

const Orders = () => {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [statusUpdate, setStatusUpdate] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const res = await axiosInstance.get("/all-orders/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res.data)
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, []);

    const toggleExpanded = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdate((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    };

    const updateStatus = async (orderId) => {
        const token = await getToken();
        const status = statusUpdate[orderId];

        if (!status) return;

        try {
            await axiosInstance.put(
                `/all-orders/${orderId}/`,
                { delivery_status: status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, delivery_status: status }
                        : order
                )
            );
            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const DELIVERY_STATUS_CHOICES = [
        "pending",
        "shipped",
        "delivered",
        "cancelled",
    ];

    return (
        <div className="p-4 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 mt-10 mb-10">
                    No orders found.
                </p>
            ) : (
                orders.map((order) => {
                    const isExpanded = expandedOrders[order.id];
                    return (
                        <div
                            key={order.id}
                            className="border border-gray-300 mb-6 rounded-lg bg-gray-50 relative transition-all duration-300 shadow-sm"
                        >
                            <button
                                onClick={() => toggleExpanded(order.id)}
                                className="absolute top-4 right-4 text-xl bg-none border-none cursor-pointer text-gray-700"
                            >
                                {isExpanded ? "▲" : "▼"}
                            </button>

                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">
                                                Order ID:
                                            </span>{" "}
                                            {order.id}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">
                                                User Email:
                                            </span>{" "}
                                            {order.user}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">
                                                Name:
                                            </span>{" "}
                                            {order.address.first_name}{" "}
                                            {order.address.last_name}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">
                                                Razorpay Order ID:
                                            </span>{" "}
                                            {order.razorpay_order_id}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">
                                                Razorpay Payment ID:
                                            </span>{" "}
                                            {order.razorpay_payment_id}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">
                                                Created:
                                            </span>{" "}
                                            {new Date(
                                                order.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-2 sm:mt-0">
                                        <p className="text-sm">
                                            <span className="font-semibold">
                                                Status:
                                            </span>{" "}
                                            {order.delivery_status}
                                        </p>
                                        <select
                                            value={
                                                statusUpdate[order.id] ||
                                                order.delivery_status
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            className="px-2 py-1 rounded border border-gray-300 text-sm"
                                        >
                                            {DELIVERY_STATUS_CHOICES.map(
                                                (status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            status.slice(1)}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        <button
                                            onClick={() =>
                                                updateStatus(order.id)
                                            }
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">
                                            Phone:
                                        </span>{" "}
                                        {order.phone}
                                    </p>
                                    <p className="text-base font-semibold text-black">
                                        <span className="font-semibold">
                                            Total:
                                        </span>{" "}
                                        ₹{(order.total_amount / 100).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-500 ${
                                    isExpanded
                                        ? "max-h-[1000px] mt-2"
                                        : "max-h-0"
                                }`}
                            >
                                <div className="px-4 pb-4 sm:px-6">
                                    <h4 className="font-semibold mb-2">
                                        Shipping Address
                                    </h4>
                                    <div className="bg-gray-200 p-3 rounded mb-4 leading-relaxed">
                                        <p className="mb-0">
                                            {order.address.first_name}{" "}
                                            {order.address.last_name}
                                        </p>
                                        <p className="mb-0">
                                            {order.address.address_line1},{" "}
                                            {order.address.street}
                                        </p>
                                        <p className="mb-0">
                                            {order.address.city},{" "}
                                            {order.address.state}
                                        </p>
                                        <p className="mb-0">
                                            Postal Code:{" "}
                                            {order.address.postal_code}
                                        </p>
                                        <p className="mb-0">
                                            Phone: {order.address.phone}
                                        </p>
                                    </div>

                                    <h4 className="font-semibold mb-2">
                                        Order Items
                                    </h4>
                                    <ul className="list-none pl-0">
                                        {order.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className="bg-gray-800 text-white p-4 mb-3 rounded flex flex-col sm:flex-row items-center gap-4"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.product}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold">
                                                        Product:{" "}
                                                        <span className="font-normal">
                                                            {item.product}
                                                        </span>
                                                    </p>
                                                    <p className="font-semibold">
                                                        Size:{" "}
                                                        <span className="font-normal">
                                                            {item.size}
                                                        </span>
                                                    </p>
                                                    <p className="font-semibold">
                                                        Quantity:{" "}
                                                        <span className="font-normal">
                                                            {item.quantity}
                                                        </span>
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Orders;
