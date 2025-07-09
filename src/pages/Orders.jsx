import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axiosInstance from '../axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await axiosInstance.get('/all-orders/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
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

      // Reflect change locally after success
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, delivery_status: status } : order
        )
      );
      toast.success("status updated successfully");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const DELIVERY_STATUS_CHOICES = ['pending', 'shipped', 'delivered', 'cancelled'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          const isExpanded = expandedOrders[order.id];
          return (
            <div
              key={order.id}
              style={{
                border: '1px solid #ccc',
                margin: '20px 0',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              <button
                onClick={() => toggleExpanded(order.id)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#333',
                }}
              >
                {isExpanded ? '▲' : '▼'}
              </button>

              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>User Email:</strong> {order.user}</p>
              <p><strong>Name:</strong> {order.address.first_name} {order.address.last_name}</p>
              <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p><strong>Status:</strong> {order.delivery_status}</p>
                <select
                  value={statusUpdate[order.id] || order.delivery_status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  style={{ padding: '5px', borderRadius: '5px' }}
                >
                  {DELIVERY_STATUS_CHOICES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => updateStatus(order.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Update
                </button>
              </div>

              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Total:</strong> ₹{(order.total_amount / 100).toFixed(2)}</p>

              <div
                style={{
                  maxHeight: isExpanded ? '1000px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s ease',
                  marginTop: isExpanded ? '20px' : '0px',
                }}
              >
                <h4><strong>Shipping Address</strong></h4>
                <div
                  style={{
                    backgroundColor: '#e8e8e8',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    lineHeight: '1.6',
                  }}
                >
                  <p style={{ margin: 0 }}>{order.address.first_name} {order.address.last_name}</p>
                  <p style={{ margin: 0 }}>{order.address.address_line1}, {order.address.street}</p>
                  <p style={{ margin: 0 }}>{order.address.city}, {order.address.state}</p>
                  <p style={{ margin: 0 }}>Postal Code: {order.address.postal_code}</p>
                  <p style={{ margin: 0 }}>Phone: {order.address.phone}</p>
                </div>

                <h4>Order Items</h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        backgroundColor: '#444',
                        color: '#fff',
                        padding: '15px',
                        margin: '10px 0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.product}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '5px',
                        }}
                      />
                      <div>
                        <p><strong>Product:</strong> {item.product}</p>
                        <p><strong>Size:</strong> {item.size}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
