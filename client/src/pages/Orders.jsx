import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  DollarSign,
  Hash,
  ShoppingBag,
  Eye,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";

export default function Orders() {
  const { token } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Your Orders
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {orders.length} {orders.length === 1 ? "order" : "orders"} found
              </p>
            </div>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          /* Empty State */
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center border border-gray-700/50"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              No orders yet
            </h2>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Start shopping to see your orders here
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all text-sm sm:text-base"
              onClick={() => window.history.back()}
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          /* Orders List */
          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewOrder(order)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Hash className="w-3 h-3" />
                        <span className="font-mono text-xs truncate">
                          {order._id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-lg font-bold text-green-400">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({order.items.length} items)
                        </span>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-white">
                          Items
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div
                            key={i}
                            className="text-sm text-gray-300 truncate"
                          >
                            • {item.title} x{item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-between">
                      {/* Left Side */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Hash className="w-4 h-4" />
                            <span className="font-mono text-sm">
                              {order._id.slice(-8)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-xl font-bold text-green-400">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {order.items.length} items
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewOrder(order)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </motion.button>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="mt-4 bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">Items</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-300 truncate pr-2">
                              {item.title}
                            </span>
                            <span className="text-gray-400 flex-shrink-0">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderDetail && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowOrderDetail(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Order Details
                    </h3>
                    <p className="text-sm text-gray-400">
                      #{selectedOrder._id.slice(-8)}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOrderDetail(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.status)}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Status
                      </p>
                      <p className="text-white font-semibold">
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-white font-semibold">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Total
                      </p>
                      <p className="text-green-400 font-bold text-lg">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-green-400" />
                    <span className="font-semibold text-white">Payment</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    ID: {selectedOrder.paymentId}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status: {selectedOrder.paymentStatus}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-white">Shipping</span>
                  </div>
                  <p className="text-sm text-gray-300 break-words">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">
                    Items ({selectedOrder.items.length})
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          by {item.author}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-white font-semibold">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
