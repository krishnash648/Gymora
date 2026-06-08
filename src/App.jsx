import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import AdminRoute from "./routes/AdminRoute";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Register from "./pages/register";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import UserDashboard from "./pages/UserDashboard";

function MainApp() {
  // cart
  const savedCart = localStorage.getItem("cart");

  const [cart, setCart] = useState(savedCart ? JSON.parse(savedCart) : []);

  // save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // wishlist
  const savedWishlist = localStorage.getItem("wishlist");

  const [wishlist, setWishlist] = useState(
    savedWishlist ? JSON.parse(savedWishlist) : [],
  );

  // save wishlist
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // search
  const [searchText, setSearchText] = useState("");

  // current page
  const location = useLocation();

  return (
    <>
      {/* Hide Navbar on Admin Pages */}
      {!location.pathname.startsWith("/admin") && (
        <Navbar
          cart={cart}
          wishlist={wishlist}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )}

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Products
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              searchText={searchText}
            />
          }
        />

        {/* Cart */}
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              setWishlist={setWishlist}
              setCart={setCart}
            />
          }
        />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          }
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout cart={cart} setCart={setCart} />}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

export default App;
