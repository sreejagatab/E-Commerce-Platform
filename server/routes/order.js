const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        status: 'fail',
        message: 'Database not configured. Please add Supabase credentials to .env file.'
      });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          product_id,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Create order (for MetaMask payments)
router.post("/create", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        status: 'fail',
        message: 'Database not configured.'
      });
    }

    const {
      items,
      subtotal,
      total,
      shipping_cost,
      tax,
      payment_method,
      transaction_hash,
      wallet_address,
      eth_amount,
      eth_price_usd,
      user_id
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Items are required'
      });
    }

    // Create order with items stored in shipping JSON
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user_id || 'guest',
          subtotal: subtotal,
          total: total,
          shipping: {
            cost: shipping_cost,
            tax: tax,
            payment_method: payment_method,
            transaction_hash: transaction_hash,
            wallet_address: wallet_address,
            eth_amount: eth_amount,
            eth_price_usd: eth_price_usd,
            items: items.map(item => ({
              product_id: item._id,
              name: item.name,
              price: item.price,
              quantity: item.cartQuantity,
              image: item.image
            }))
          },
          payment_status: 'paid',
          delivery_status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order_id: order.id,
        transaction_hash: transaction_hash
      }
    });

  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        status: 'fail',
        message: 'Database not configured.'
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          product_id,
          products (*)
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Get orders by user
router.get("/user/:userId", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        status: 'fail',
        message: 'Database not configured.'
      });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          product_id,
          products (*)
        )
      `)
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
});

module.exports = router;
