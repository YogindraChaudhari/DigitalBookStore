import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../store/userStore";
import {
  LogOut,
  ShoppingCart,
  Plus,
  Package,
  Settings,
  User,
  BookOpen,
  X,
  Menu,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Header() {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#0f1419] via-[#161b22] to-[#1c2128] shadow-2xl border-b border-gray-700/50 backdrop-blur-sm"
      >
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
            onClick={closeMobileMenu}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <BookOpen size={24} className="text-blue-400 sm:w-7 sm:h-7" />
            </motion.div>
            <span className="hidden xs:inline">BookStore</span>
            <span className="xs:hidden">BS</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {/* Cart */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/cart"
              title="Shopping Cart"
              className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 group"
            >
              <ShoppingCart
                size={20}
                className="text-gray-300 group-hover:text-white transition-colors duration-300"
              />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2 }}
                    className="absolute left-2.5 top-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {user ? (
            <>
              {/* Add Book */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/add-book"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 text-sm xl:text-base"
                >
                  <Plus size={16} />
                  <span className="hidden xl:inline">Add Book</span>
                  <span className="xl:hidden">Add</span>
                </Link>
              </motion.div>

              {/* Orders */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm xl:text-base"
                >
                  <Package size={16} />
                  Orders
                </Link>
              </motion.div>

              {/* Settings */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm xl:text-base"
                >
                  <Settings size={16} />
                  <span className="hidden xl:inline">Settings</span>
                </Link>
              </motion.div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowLogoutModal(true)}
                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut size={20} />
              </motion.button>
            </>
          ) : (
            <>
              {/* Login */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 font-medium text-sm xl:text-base"
                >
                  <User size={16} />
                  Login
                </Link>
              </motion.div>

              {/* Register */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-sm xl:text-base"
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button & Cart */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Cart */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/cart"
              title="Shopping Cart"
              className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 group"
              onClick={closeMobileMenu}
            >
              <ShoppingCart
                size={20}
                className="text-gray-300 group-hover:text-white transition-colors duration-300"
              />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute left-2.5 top-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </motion.header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 sm:h-20"></div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 sm:top-20 right-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-[#161b22] to-[#0d1117] border-l border-gray-700/50 shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {user ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="pb-4 border-b border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            Hi, {user.username} 👋
                          </p>
                          <p className="text-gray-400 text-sm">
                            Manage your account
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/add-book"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/20 text-green-400 hover:text-green-300 transition-all duration-300"
                        onClick={closeMobileMenu}
                      >
                        <Plus size={20} />
                        <span className="font-semibold">Add New Book</span>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-300"
                        onClick={closeMobileMenu}
                      >
                        <Package size={20} />
                        <span className="font-semibold">My Orders</span>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-300"
                        onClick={closeMobileMenu}
                      >
                        <Settings size={20} />
                        <span className="font-semibold">Settings</span>
                      </Link>
                    </motion.div>

                    {/* Logout Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 mt-6"
                    >
                      <LogOut size={20} />
                      <span className="font-semibold">Logout</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Guest Info */}
                    <div className="pb-4 border-b border-gray-700/50">
                      <h3 className="text-white text-lg font-bold">
                        Join BookStore
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Sign in to access your account
                      </p>
                    </div>

                    {/* Auth Links */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        className="flex items-center gap-3 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-300"
                        onClick={closeMobileMenu}
                      >
                        <User size={20} />
                        <span className="font-semibold">Login</span>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/register"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg"
                        onClick={closeMobileMenu}
                      >
                        <span>Create Account</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <LogOut size={20} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Confirm Logout
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
