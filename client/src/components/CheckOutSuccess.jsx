import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaEthereum, FaCreditCard, FaShoppingBag, FaHome } from 'react-icons/fa';

const CheckOutSuccess = () => {
  const location = useLocation();
  const { orderId, transactionHash, paymentMethod } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 mb-4">
              <FaCheckCircle className="text-6xl text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400 text-lg">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6 text-left">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <FaShoppingBag className="text-orange-500" />
              Order Details
            </h3>

            <div className="space-y-3">
              {orderId && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Order ID</span>
                  <span className="text-white font-mono text-sm">#{orderId.slice(0, 8)}...</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-white flex items-center gap-2">
                  {paymentMethod === 'metamask' ? (
                    <>
                      <FaEthereum className="text-purple-400" />
                      MetaMask (ETH)
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="text-blue-400" />
                      Credit Card
                    </>
                  )}
                </span>
              </div>

              {transactionHash && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Transaction</span>
                  <a
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 font-mono text-sm"
                  >
                    {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Status</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-xl p-6 mb-6 text-left">
            <h3 className="text-white font-semibold mb-3">What's Next?</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                You will receive an email confirmation shortly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                Your order will be processed within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                Track your order status in your account
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              <FaHome />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSuccess;
