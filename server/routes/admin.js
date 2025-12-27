const express = require("express");
const supabase = require("../config/supabase");
const productsFromFile = require('../data/expandedProducts');

const router = express.Router();

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    let orders = [];
    let users = [];
    let totalProducts = productsFromFile?.length || 0;

    if (supabase) {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total, payment_status, created_at');
      orders = ordersData || [];

      const { data: usersData } = await supabase
        .from('users')
        .select('id, created_at');
      users = usersData || [];
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const paidOrders = orders.filter(o => o.payment_status === 'paid').length;
    const pendingOrders = orders.filter(o => o.payment_status === 'pending').length;
    const totalUsers = users.length;

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = orders.filter(o => new Date(o.created_at) > sevenDaysAgo).length;

    // Revenue by day (last 7 days)
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = orders
        .filter(o => o.created_at?.startsWith(dateStr))
        .reduce((sum, o) => sum + (o.total || 0), 0);
      revenueByDay.push({ date: dateStr, revenue: dayRevenue });
    }

    // Get categories count
    const categories = [...new Set(productsFromFile.map(p => p.category))];

    res.json({
      status: 'success',
      data: {
        totalOrders,
        totalRevenue,
        paidOrders,
        pendingOrders,
        totalProducts,
        totalUsers,
        recentOrders,
        revenueByDay,
        totalCategories: categories.length
      }
    });

  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// ============ PRODUCTS ============

// Get all products (from local file)
router.get("/products", (req, res) => {
  try {
    const products = productsFromFile.map(p => ({
      ...p,
      id: p._id,
      stock: p.stock || Math.floor(Math.random() * 50) + 5 // Simulated stock
    }));
    res.json({ status: 'success', data: products });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Get single product
router.get("/products/:id", (req, res) => {
  try {
    const product = productsFromFile.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }
    res.json({ status: 'success', data: product });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// ============ ORDERS ============

// Get all orders with details
router.get("/orders", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Enrich orders with user info
    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      let userName = 'Guest';
      if (order.user_id && order.user_id !== 'guest') {
        const { data: user } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', order.user_id)
          .single();
        if (user) userName = user.name;
      }
      return { ...order, user_name: userName };
    }));

    res.json({ status: 'success', data: enrichedOrders });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Get single order
router.get("/orders/:id", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    res.json({ status: 'success', data: order });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Update order status
router.patch("/orders/:id", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { delivery_status, payment_status } = req.body;
    const updateData = { updated_at: new Date().toISOString() };

    if (delivery_status) updateData.delivery_status = delivery_status;
    if (payment_status) updateData.payment_status = payment_status;

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ status: 'success', message: 'Order updated successfully', data: order });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Delete order
router.delete("/orders/:id", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ status: 'success', message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// ============ USERS ============

// Get all users with order count
router.get("/users", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get order count for each user
    const usersWithOrders = await Promise.all(users.map(async (user) => {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total')
        .eq('user_id', user.id);

      const orderCount = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      return { ...user, order_count: orderCount, total_spent: totalSpent };
    }));

    res.json({ status: 'success', data: usersWithOrders });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Get single user with their orders
router.get("/users/:id", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', req.params.id)
      .single();

    if (userError) throw userError;
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Get user's orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.params.id)
      .order('created_at', { ascending: false });

    res.json({
      status: 'success',
      data: { ...user, orders: orders || [] }
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    // First update their orders to 'deleted_user'
    await supabase
      .from('orders')
      .update({ user_id: 'deleted_user' })
      .eq('user_id', req.params.id);

    // Then delete the user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// ============ ANALYTICS ============

// Get sales analytics
router.get("/analytics/sales", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('total, payment_status, delivery_status, shipping, created_at')
      .order('created_at', { ascending: false });

    // Payment method breakdown
    const paymentMethods = { metamask: 0, stripe: 0, other: 0 };
    orders?.forEach(order => {
      const method = order.shipping?.payment_method || 'other';
      if (method === 'metamask') paymentMethods.metamask++;
      else if (method === 'stripe') paymentMethods.stripe++;
      else paymentMethods.other++;
    });

    // Delivery status breakdown
    const deliveryStats = { pending: 0, shipped: 0, delivered: 0 };
    orders?.forEach(order => {
      const status = order.delivery_status || 'pending';
      if (deliveryStats[status] !== undefined) deliveryStats[status]++;
    });

    // Monthly revenue (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const monthRevenue = orders
        ?.filter(o => o.created_at?.startsWith(monthStr))
        .reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      monthlyRevenue.push({
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: monthRevenue
      });
    }

    res.json({
      status: 'success',
      data: { paymentMethods, deliveryStats, monthlyRevenue }
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Get top products (based on orders)
router.get("/analytics/top-products", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ status: 'fail', message: 'Database not configured.' });
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('shipping');

    // Count product occurrences
    const productCounts = {};
    orders?.forEach(order => {
      const items = order.shipping?.items || [];
      items.forEach(item => {
        const id = item.product_id;
        if (!productCounts[id]) {
          productCounts[id] = {
            id,
            name: item.name || 'Unknown',
            count: 0,
            revenue: 0,
            image: item.image
          };
        }
        productCounts[id].count += item.quantity || 1;
        productCounts[id].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({ status: 'success', data: topProducts });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;
