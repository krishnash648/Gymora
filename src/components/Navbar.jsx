import "../App.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaHeart, FaUser, FaShoppingBag } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/gym-logo.png";

function Navbar(props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { wishlist, cart, searchText, setSearchText } = props;

  // auth
  const { currentUser, userData } = useAuth();

  return (
    <>
      <nav className="main-navbar">
        {/* LEFT */}
        <div className="main-nav-left">
          <Link to="/">Women</Link>
          <Link to="/">Men</Link>
          <Link to="/">Accessories</Link>
        </div>

        {/* CENTER */}
        <div className="main-nav-center">
          <img src={logo} alt="logo" className="main-navbar-logo" />
        </div>

        {/* RIGHT */}
        <div className="main-nav-right">
          {/* SEARCH */}
          <FaSearch
            className="nav-icon"
            onClick={() => {
              setSearchOpen(true);
            }}
          />

          {/* WISHLIST */}
          <Link to="/wishlist" className="main-cart-icon">
            <FaHeart />

            <span>{wishlist.length}</span>
          </Link>

          {/* USER */}
          <Link
            to={
              !currentUser
                ? "/login"
                : userData?.role === "admin"
                  ? "/admin"
                  : "/dashboard"
            }
            className="nav-user-link"
          >
            <FaUser />
          </Link>

          {/* CART */}
          <Link to="/cart" className="main-cart-icon">
            <FaShoppingBag />

            <span>{cart.length}</span>
          </Link>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div
          className="search-overlay"
          onClick={() => {
            setSearchOpen(false);
          }}
        >
          <div
            className="search-box"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="search-top">
              <h2>Search Products</h2>

              <button
                onClick={() => {
                  setSearchOpen(false);
                }}
              >
                X
              </button>
            </div>

            <input
              type="text"
              placeholder="Search gym products..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchOpen(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
