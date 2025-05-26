import { useState } from "react";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BookPlus,
  User,
  FileText,
  DollarSign,
  Layers,
  Tags,
  UploadCloud,
} from "lucide-react";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const { token } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          author,
          description,
          price,
          stock,
          category,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Book added successfully!");
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
    } catch (err) {
      toast.error(err.message);
    }
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
        <h2 className="text-2xl font-bold">Add a New Book</h2>
      </div>

      <div className="space-y-4">
        <InputField
          icon={<BookPlus size={20} />}
          placeholder="Title"
          value={title}
          onChange={setTitle}
        />
        <InputField
          icon={<User size={20} />}
          placeholder="Author"
          value={author}
          onChange={setAuthor}
        />
        <InputField
          icon={<FileText size={20} />}
          placeholder="Description"
          value={description}
          onChange={setDescription}
          textarea
        />
        <InputField
          icon={<DollarSign size={20} />}
          placeholder="Price"
          type="number"
          value={price}
          onChange={setPrice}
        />
        <InputField
          icon={<Layers size={20} />}
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={setStock}
        />
        <InputField
          icon={<Tags size={20} />}
          placeholder="Category"
          value={category}
          onChange={setCategory}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 transition-colors duration-300 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
      >
        <UploadCloud size={20} />
        Add Book
      </motion.button>
    </motion.form>
  );
}

// Reusable InputField component
function InputField({
  icon,
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
          placeholder={placeholder}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
      ) : (
        <input
          className="w-full bg-transparent outline-none text-white"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
      )}
    </div>
  );
}
