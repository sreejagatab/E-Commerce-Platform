import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaShoppingCart,
  FaDollarSign,
  FaUsers,
  FaBox,
  FaClipboardList,
  FaCubes,
  FaUsersCog,
  FaChartLine,
  FaSync,
  FaEthereum,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:4000/api/admin/stats'),
        axios.get('http://localhost:4000/api/admin/analytics/sales')
      ]);
      setStats(statsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: FaDollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FaShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FaUsers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FaBox,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20'
    },
  ];

  const quickActions = [
    { title: 'Manage Orders', description: `${stats?.totalOrders || 0} orders`, icon: FaClipboardList, link: '/admin/orders', color: 'text-blue-400' },
    { title: 'View Products', description: `${stats?.totalProducts || 0} products`, icon: FaCubes, link: '/admin/products', color: 'text-orange-400' },
    { title: 'Manage Users', description: `${stats?.totalUsers || 0} users`, icon: FaUsersCog, link: '/admin/users', color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your store.</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`text-2xl ${stat.color}`} />
                </div>
                {stat.title === 'Total Orders' && stats?.recentOrders > 0 && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    +{stats.recentOrders} this week
                  </span>
                )}
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-orange-500" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
                >
                  <action.icon className={`text-2xl ${action.color} group-hover:scale-110 transition-transform`} />
                  <div>
                    <span className="text-white font-medium block">{action.title}</span>
                    <span className="text-gray-500 text-sm">{action.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaCreditCard className="text-blue-500" />
              Payment Methods
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaEthereum className="text-purple-400 text-xl" />
                  <span className="text-white">MetaMask</span>
                </div>
                <span className="text-purple-400 font-bold">{analytics?.paymentMethods?.metamask || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-blue-400 text-xl" />
                  <span className="text-white">Stripe</span>
                </div>
                <span className="text-blue-400 font-bold">{analytics?.paymentMethods?.stripe || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-500/10 border border-gray-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaDollarSign className="text-gray-400 text-xl" />
                  <span className="text-white">Other</span>
                </div>
                <span className="text-gray-400 font-bold">{analytics?.paymentMethods?.other || 0}</span>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaTruck className="text-green-500" />
              Delivery Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaClock className="text-yellow-400 text-xl" />
                  <span className="text-white">Pending</span>
                </div>
                <span className="text-yellow-400 font-bold">{analytics?.deliveryStats?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaTruck className="text-blue-400 text-xl" />
                  <span className="text-white">Shipped</span>
                </div>
                <span className="text-blue-400 font-bold">{analytics?.deliveryStats?.shipped || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-400 text-xl" />
                  <span className="text-white">Delivered</span>
                </div>
                <span className="text-green-400 font-bold">{analytics?.deliveryStats?.delivered || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-orange-500" />
              Revenue (Last 7 Days)
            </h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {stats?.revenueByDay?.map((day, index) => {
                const maxRevenue = Math.max(...stats.revenueByDay.map(d => d.revenue), 1);
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-xs text-gray-400 mb-1">
                        ${day.revenue.toLocaleString()}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-pink-500 rounded-t-lg transition-all hover:from-orange-400 hover:to-pink-400"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              Monthly Revenue (Last 6 Months)
            </h2>
            <div className="flex items-end justify-between h-48 gap-3">
              {analytics?.monthlyRevenue?.map((month, index) => {
                const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue), 1);
                const height = (month.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-xs text-gray-400 mb-1">
                        ${month.revenue.toLocaleString()}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-400 hover:to-purple-400"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{month.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
