import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  ShoppingCart,
  Star,
  User,
  BookOpen,
  DollarSign,
  MessageSquare,
  X,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const { token, user } = useUserStore();
  const { addToCart } = useCartStore();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchBook = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/books/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBook(data.data);
    } catch (err) {
      toast.error("Failed to load book");
    }
  };

  const hasReviewed = book?.reviews?.data?.some(
    (r) => r.userId._id === user?._id
  );
  const userReview = book?.reviews?.data?.find(
    (r) => r.userId._id === user?._id
  );

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${VITE_API_URL}/api/books/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, rating }),
      });
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.message);
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(5);
        setShowReviewModal(false);
        fetchBook();
      } catch {
        console.error("Invalid response:", text);
        throw new Error("Server returned invalid response");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateReview = async () => {
    if (!editComment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${VITE_API_URL}/api/reviews/${editingReview._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: editComment, rating: editRating }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Review updated successfully!");
      setEditingReview(null);
      fetchBook();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await fetch(
        `${VITE_API_URL}/api/reviews/${reviewToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Review deleted successfully!");
      setShowDeleteReviewModal(false);
      setReviewToDelete(null);
      fetchBook();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteBook = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Book deleted successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowDeleteModal(true);
    }
  };

  const handleAddToCart = () => {
    addToCart(book);
    toast.success("Added to cart successfully!");
  };

  const openDeleteReviewModal = (review) => {
    setReviewToDelete(review);
    setShowDeleteReviewModal(true);
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-400">Loading book details...</span>
      </div>
    );
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Book Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700/50"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                {book.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4" />
                <span>by {book.author}</span>
              </div>
            </div>

            {user?._id === book.createdBy._id && (
              <div className="flex gap-3">
                <Link
                  to={`${VITE_API_URL}/edit-book/${book._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Description</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Price</span>
                </div>
                <p className="text-2xl font-bold text-green-300">
                  ${book.price}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Reviews</h2>
            </div>

            {token && !hasReviewed && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Star className="w-4 h-4" />
                Add Review
              </motion.button>
            )}
          </div>

          {book.reviews?.data?.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 text-gray-400"
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reviews yet. Be the first to review this book!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {book.reviews?.data?.map((review, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300 font-medium">
                        {review.userId.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-400">
                          {review.rating}/5
                        </span>
                      </div>
                      {/* {user?._id === review.userId._id && (
                        <button
                          onClick={() => openDeleteReviewModal(review)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )} */}
                      {user?._id === review.userId._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingReview(review);
                              setEditComment(review.comment);
                              setEditRating(review.rating);
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                            title="Edit Review"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteReviewModal(review)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setEditingReview(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Review</h3>
                <button
                  onClick={() => setEditingReview(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setEditRating(n)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            n <= editRating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600 hover:text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    {editRating} out of 5 stars
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingReview(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={updateReview}
                  disabled={isSubmitting || !editComment.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-bold"
                >
                  {isSubmitting ? "Updating..." : "Update Review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Book Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Book</h3>
                  <p className="text-gray-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{book.title}"? This will
                permanently remove the book and all its reviews.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBook}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Review Confirmation Modal */}
      <AnimatePresence>
        {showDeleteReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteReviewModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Delete Review
                  </h3>
                  <p className="text-gray-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your review? This will
                permanently remove your review and rating.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteReview}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            n <= rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600 hover:text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    {rating} out of 5 stars
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={isSubmitting || !comment.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
