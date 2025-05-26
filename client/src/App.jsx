import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Header from "./pages/Header";
import { useUserStore } from "./store/userStore";
import { useCartStore } from "./store/cartStore";

export default function App() {
  const { user } = useUserStore();
  const { syncUserCart } = useCartStore();

  useEffect(() => {
    syncUserCart();
  }, [user]);

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route
          path="/add-book"
          element={user ? <AddBook /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-book/:id"
          element={user ? <EditBook /> : <Navigate to="/login" />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/orders"
          element={user ? <Orders /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}
