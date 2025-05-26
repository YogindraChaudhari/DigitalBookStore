import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Settings as SettingsIcon, // Renamed to avoid conflict with component name
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, token, logout, setUser } = useUserStore();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  // Modals state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Animation variants
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

  const handleEmailChange = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${VITE_API_URL}/api/users/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser({ ...user, email: email });
      toast.success("Email updated successfully! ✅");
      setShowEmailModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to update email.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${VITE_API_URL}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Password updated successfully! ✅");
      setPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${VITE_API_URL}/api/users/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Account deleted successfully! 👋");
      logout();
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6 text-white"
    >
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50 flex items-center gap-4"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Account Settings
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your profile, password, and account
            </p>
          </div>
        </motion.div>

        {/* User Info (Optional, but nice to show) */}
        {user && (
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Your Profile
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-300 text-sm sm:text-base">
                <span>Username:</span>
                <span className="font-semibold text-white">
                  {user.username}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-300 text-sm sm:text-base">
                <span>Email:</span>
                <span className="font-semibold text-white">{user.email}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Email Change Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 border border-gray-700/50"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Change Email
          </h2>
          <label htmlFor="email" className="block text-gray-300 mb-2 text-sm">
            New Email Address
          </label>
          <div className="relative mb-4">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter new email"
            />
            {/* <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowEmailModal(true)}
            disabled={!email || email === user?.email}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            <Mail className="w-4 h-4" />
            Update Email
          </motion.button>
        </motion.div>

        {/* Password Change Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 border border-gray-700/50"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-400" />
            Change Password
          </h2>
          <label
            htmlFor="password"
            className="block text-gray-300 mb-2 text-sm"
          >
            New Password
          </label>
          <div className="relative mb-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pl-12 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="Enter new password"
            />
            {/* <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPasswordModal(true)}
            disabled={!password || password.length < 6} // Basic validation
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            <Lock className="w-4 h-4" />
            Update Password
          </motion.button>
        </motion.div>

        {/* Delete Account Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            Delete Account
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </motion.button>
        </motion.div>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {/* Email Confirmation Modal */}
        {showEmailModal && (
          <Modal
            onClose={() => setShowEmailModal(false)}
            onConfirm={handleEmailChange}
            title="Confirm Email Change"
            message={`Are you sure you want to change your email to "${email}"?`}
            confirmText="Change Email"
            icon={CheckCircle}
            iconColor="text-green-600"
            buttonBg="bg-green-600 hover:bg-green-700"
            isProcessing={isProcessing}
            modalVariants={modalVariants}
          />
        )}

        {/* Password Confirmation Modal */}
        {showPasswordModal && (
          <Modal
            onClose={() => setShowPasswordModal(false)}
            onConfirm={handlePasswordChange}
            title="Confirm Password Change"
            message="Are you sure you want to update your password? You will need to use the new password next time you log in."
            confirmText="Update Password"
            icon={CheckCircle}
            iconColor="text-green-600"
            buttonBg="bg-green-600 hover:bg-green-700"
            isProcessing={isProcessing}
            modalVariants={modalVariants}
          />
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <Modal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            title="Confirm Account Deletion"
            message="This action is permanent and cannot be undone. All your data will be lost. Are you absolutely sure?"
            confirmText="Delete Permanently"
            icon={AlertCircle}
            iconColor="text-red-600"
            buttonBg="bg-red-600 hover:bg-red-700"
            isProcessing={isProcessing}
            modalVariants={modalVariants}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Reusable Modal Component
const Modal = ({
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  icon: Icon,
  iconColor,
  buttonBg,
  isProcessing,
  modalVariants,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => !isProcessing && onClose()}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full mx-4 border border-gray-700 shadow-xl relative"
      >
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 ${
              iconColor.includes("red") ? "bg-red-100" : "bg-green-100"
            } rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg transition-colors font-bold text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 px-3 sm:px-4 py-2 ${buttonBg} disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg transition-colors font-bold flex items-center justify-center gap-2 text-sm sm:text-base`}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
