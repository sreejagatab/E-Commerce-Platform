import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaEye,
  FaTrash,
  FaBox,
  FaEthereum,
  FaCreditCard,
  FaSync,
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const updateOrderStatus = async (orderId, field, value) => {
    try {
      await axios.patch(`http://localhost:4000/api/admin/orders/${orderId}`, {
        [field]: value
      });
      toast.success(`Order ${field.replace('_', ' ')} updated to ${value}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:4000/api/admin/orders/${orderId}`);
      toast.success('Order deleted successfully');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'refunded': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      order.payment_status === statusFilter ||
      order.delivery_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <FaArrowLeft className="text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Orders Management</h1>
              <p className="text-gray-400">{orders.length} total orders</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-8 text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Delivery</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-mono text-sm">
                        #{order.id?.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{order.user_name || order.user_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">${order.total?.toLocaleString()}</span>
                        {order.shipping?.payment_method === 'metamask' && (
                          <FaEthereum className="text-purple-400" title="Paid with ETH" />
                        )}
                        {order.shipping?.payment_method === 'stripe' && (
                          <FaCreditCard className="text-blue-400" title="Paid with Card" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.payment_status}
                        onChange={(e) => updateOrderStatus(order.id, 'payment_status', e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${getStatusColor(order.payment_status)} bg-transparent`}
                      >
                        <option value="pending" className="bg-gray-900">Pending</option>
                        <option value="paid" className="bg-gray-900">Paid</option>
                        <option value="refunded" className="bg-gray-900">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.delivery_status}
                        onChange={(e) => updateOrderStatus(order.id, 'delivery_status', e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer ${getStatusColor(order.delivery_status)} bg-transparent`}
                      >
                        <option value="pending" className="bg-gray-900">Pending</option>
                        <option value="shipped" className="bg-gray-900">Shipped</option>
                        <option value="delivered" className="bg-gray-900">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FaBox className="text-4xl text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No orders found</p>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Order ID</span>
                    <p className="text-white font-mono text-sm">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Customer</span>
                    <p className="text-white">{selectedOrder.user_name || selectedOrder.user_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Subtotal</span>
                    <p className="text-white">${selectedOrder.subtotal?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Total</span>
                    <p className="text-white font-bold text-xl">${selectedOrder.total?.toLocaleString()}</p>
                  </div>
                </div>

                {selectedOrder.shipping?.payment_method === 'metamask' && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                      <FaEthereum /> MetaMask Payment
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Wallet</span>
                        <p className="text-gray-300 font-mono text-xs break-all">{selectedOrder.shipping.wallet_address}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">ETH Amount</span>
                        <p className="text-gray-300">{selectedOrder.shipping.eth_amount} ETH</p>
                      </div>
                      <div>
                        <span className="text-gray-500">ETH Price</span>
                        <p className="text-gray-300">${selectedOrder.shipping.eth_price_usd}</p>
                      </div>
                      {selectedOrder.shipping.transaction_hash && (
                        <div>
                          <span className="text-gray-500">Tx Hash</span>
                          <a
                            href={`https://etherscan.io/tx/${selectedOrder.shipping.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:underline block font-mono text-xs truncate"
                          >
                            {selectedOrder.shipping.transaction_hash}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.shipping?.items && selectedOrder.shipping.items.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">Items ({selectedOrder.shipping.items.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedOrder.shipping.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white truncate">{item.name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity} × ${item.price}</p>
                          </div>
                          <span className="text-orange-400 font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">
                    Created: {new Date(selectedOrder.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => deleteOrder(selectedOrder.id)}
                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaTrash /> Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
