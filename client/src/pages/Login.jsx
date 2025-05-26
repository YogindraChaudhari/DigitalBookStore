import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const inputVariants = {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.02 },
    focus: { scale: 1.01 },
  };

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto p-6 md:p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Login
        </h2>

        {/* Email */}
        <motion.div
          className="flex items-center px-3 bg-gray-700 text-white border border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-green-500 transition-all duration-300"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileFocus="focus"
        >
          <Mail className="text-gray-400 mr-2" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full py-2 bg-transparent text-white outline-none"
          />
        </motion.div>

        {/* Password */}
        <motion.div
          className="flex items-center px-3 bg-gray-700 text-white border border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-green-500 transition-all duration-300"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileFocus="focus"
        >
          <Lock className="text-gray-400 mr-2" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full py-2 bg-transparent text-white outline-none"
          />
          <button
            type="button"
            className="text-gray-400 hover:text-white transition duration-200 ml-2"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full p-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
        >
          Login
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
