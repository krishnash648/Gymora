import "../App.css";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";

function Account() {
  const navigate = useNavigate();

  // logout
  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="account-page">
      {/* SIDEBAR */}
      <div className="account-sidebar">
        <h2>My Account</h2>

        <NavLink to="/account/profile">Profile</NavLink>
        <NavLink to="/account/orders">Orders</NavLink>
        <NavLink to="/account/addresses">Addresses</NavLink>
        <NavLink to="/wishlist">Wishlist</NavLink>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="account-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Account;
