import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  ShoppingCart,
  User,
  Star,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const { addToCart } = useCartStore();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${VITE_API_URL}/api/books?search=${query}`);
      const data = await res.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`"${book.title}" added to cart! 🛒`);
  };

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "title":
      default:
        return a.title.localeCompare(b.title);
    }
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-gray-700/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Digital
              </span>{" "}
              <span className="text-white">Bookstore</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Discover thousands of books at your fingertips. From bestsellers
              to hidden gems.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for books, authors, genres..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchBooks}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  Search
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Bar */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">
                  {books.length} {books.length === 1 ? "Book" : "Books"} Found
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="title">Sort by Title</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
            />
            <span className="text-gray-400">Loading amazing books...</span>
          </motion.div>
        ) : (
          /* Books Grid */
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {sortedBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                  className={
                    viewMode === "grid"
                      ? "bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all group"
                      : "bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all group flex items-center gap-6"
                  }
                >
                  {viewMode === "grid" ? (
                    /* Grid View */
                    <>
                      <div className="mb-4">
                        <div className="w-full h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-800/30 group-hover:to-purple-800/30 transition-all">
                          <BookOpen className="w-16 h-16 text-gray-600 group-hover:text-gray-500 transition-colors" />
                        </div>

                        <Link to={`${VITE_API_URL}/books/${book._id}`}>
                          <h2 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors line-clamp-2">
                            {book.title}
                          </h2>
                        </Link>

                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{book.author}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-green-400">
                              ${book.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-yellow-400 fill-current"
                              />
                            ))}
                            <span className="text-sm text-gray-400 ml-1">
                              (4.5)
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(book)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                    </>
                  ) : (
                    /* List View */
                    <>
                      <div className="w-24 h-32 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link to={`${VITE_API_URL}/books/${book._id}`}>
                          <h2 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                            {book.title}
                          </h2>
                        </Link>

                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <User className="w-4 h-4" />
                          <span>{book.author}</span>
                        </div>

                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {book.description ||
                            "A captivating story that will keep you turning pages..."}
                        </p>

                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-green-400">
                            ${book.price}
                          </span>

                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 text-yellow-400 fill-current"
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">
                              (4.5)
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(book)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg flex-shrink-0"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!isLoading && books.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-20">
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
              className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Search className="w-12 h-12 text-gray-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No books found
            </h2>
            <p className="text-gray-400 mb-6">
              {query
                ? `No results for "${query}"`
                : "Try searching for something specific"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setQuery("");
                fetchBooks();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              Show All Books
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
