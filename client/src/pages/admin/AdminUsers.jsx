import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaUsers,
  FaEnvelope,
  FaCalendar,
  FaSearch,
  FaUserCircle,
  FaSync,
  FaTrash,
  FaShoppingBag,
  FaDollarSign,
  FaEye,
  FaTimes
} from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const viewUserDetails = async (userId) => {
    setSelectedUser(userId);
    setLoadingDetails(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/admin/users/${userId}`);
      setUserDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? Their orders will be preserved but marked as deleted_user.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:4000/api/admin/users/${userId}`);
      toast.success('User deleted successfully');
      setSelectedUser(null);
      setUserDetails(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpentAll = users.reduce((sum, u) => sum + (u.total_spent || 0), 0);
  const usersWithOrders = users.filter(u => u.order_count > 0).length;

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
              <h1 className="text-3xl font-bold text-white">Users Management</h1>
              <p className="text-gray-400">{users.length} registered users</p>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Users with Orders</p>
            <p className="text-2xl font-bold text-green-400">{usersWithOrders}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Spent (All Users)</p>
            <p className="text-2xl font-bold text-orange-400">${totalSpentAll.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">This Month</p>
            <p className="text-2xl font-bold text-purple-400">
              {users.filter(u => {
                const created = new Date(u.created_at);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        user.order_count > 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.order_count || 0} orders
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-orange-400 font-semibold">
                        ${(user.total_spent || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewUserDetails(user.id)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Delete User"
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="text-4xl text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setUserDetails(null);
                  }}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <FaTimes />
                </button>
              </div>

              {loadingDetails ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : userDetails ? (
                <div className="p-6 space-y-6">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                      <FaUserCircle className="text-4xl text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{userDetails.name}</h4>
                      <p className="text-gray-400 flex items-center gap-2">
                        <FaEnvelope /> {userDetails.email}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <FaCalendar /> Joined {new Date(userDetails.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <FaShoppingBag className="text-2xl text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{userDetails.orders?.length || 0}</p>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <FaDollarSign className="text-2xl text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        ${userDetails.orders?.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString() || 0}
                      </p>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                    </div>
                  </div>

                  {/* Orders */}
                  {userDetails.orders && userDetails.orders.length > 0 && (
                    <div>
                      <h5 className="text-white font-semibold mb-3">Order History</h5>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {userDetails.orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                            <div>
                              <p className="text-white font-mono text-sm">#{order.id?.slice(0, 8)}...</p>
                              <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-400 font-semibold">${order.total?.toLocaleString()}</p>
                              <p className={`text-xs ${
                                order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                              }`}>
                                {order.payment_status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={() => deleteUser(userDetails.id)}
                      className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition-colors"
                    >
                      <FaTrash /> Delete User
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
