import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";
import {
  BookPlus,
  User,
  FileText,
  DollarSign,
  Layers,
  Tags,
} from "lucide-react";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useUserStore();
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    genre: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBook({
          title: data.data.title,
          author: data.data.author,
          description: data.data.description,
          price: data.data.price,
          stock: data.data.stock,
          genre: data.data.genre,
        });
      } catch (err) {
        toast.error("Failed to load book");
        navigate("/");
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Book updated successfully!");
      navigate(`/book/${id}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-6 mt-8 bg-gray-900 text-white rounded-xl shadow-lg space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookPlus size={28} className="text-blue-400" />
        <h2 className="text-2xl font-bold">Edit Book</h2>
      </div>

      <div className="space-y-4">
        <InputField
          icon={<BookPlus size={20} />}
          name="title"
          placeholder="Title"
          value={book.title}
          onChange={handleChange}
        />
        <InputField
          icon={<User size={20} />}
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
        />
        <InputField
          icon={<FileText size={20} />}
          name="description"
          placeholder="Description"
          value={book.description}
          onChange={handleChange}
          textarea
        />
        <InputField
          icon={<DollarSign size={20} />}
          name="price"
          type="number"
          placeholder="Price"
          value={book.price}
          onChange={handleChange}
        />
        <InputField
          icon={<Layers size={20} />}
          name="stock"
          type="number"
          placeholder="Stock"
          value={book.stock}
          onChange={handleChange}
        />
        <InputField
          icon={<Tags size={20} />}
          name="genre"
          placeholder="Genre"
          value={book.genre}
          onChange={handleChange}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 transition-colors duration-300 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
      >
        Update Book
      </motion.button>
    </motion.form>
  );
}

// Reusable InputField component (same as in AddBook.jsx)
function InputField({
  icon,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  textarea = false,
}) {
  return (
    <div className="flex items-start gap-3 bg-gray-800 border border-gray-700 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
      <div className="pt-1 text-gray-400">{icon}</div>
      {textarea ? (
        <textarea
          className="w-full bg-transparent outline-none resize-none text-white"
          name={name}
          placeholder={placeholder}
          rows={3}
          value={value}
          onChange={onChange}
          required
        />
      ) : (
        <input
          className="w-full bg-transparent outline-none text-white"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      )}
    </div>
  );
}
