import "../App.css";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import {
  FaUsers,
  FaBox,
  FaEnvelope,
  FaShoppingCart,
  FaDollarSign,
  FaTachometerAlt,
  FaUserFriends,
  FaClipboardList,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

// Pages
import Users from "./Users";
import Product from "./Product";
import Orders from "./Orders";
import Payments from "./Payments";
import Settings from "./Settings";
import Messages from "./Messages";

function AdminDashboard() {
  const navigate = useNavigate();

  // page state
  const [activePage, setActivePage] = useState("dashboard");

  // firestore data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  // getting firestore data
  const getData = (name, setData) => {
    const collectionRef = collection(db, name);
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setData(data);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const usersData = getData("users", setUsers);
    const productsData = getData("products", setProducts);
    const ordersData = getData("orders", setOrders);
    const paymentsData = getData("payments", setPayments);

    return () => {
      usersData();
      productsData();
      ordersData();
      paymentsData();
    };
  }, []);

  // revenue calculation
  let totalRevenue = 0;

  payments.forEach((item) => {
    totalRevenue = totalRevenue + Number(item.amount || 0);
  });

  // logout
  const handleLogout = () => {
    localStorage.removeItem("admin");
    alert("Logout Successful");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          {/* Logo */}
          <div className="logo">
            <img src={logo} alt="logo" className="logo-img" />
          </div>

          {/* Menu */}
          <div className="sidebar-menu">
            <div
              className={`sidebar-item ${
                activePage === "dashboard" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("dashboard");
              }}
            >
              <FaTachometerAlt />

              <span>Dashboard</span>
            </div>

            <div
              className={`sidebar-item ${
                activePage === "users" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("users");
              }}
            >
              <FaUserFriends />

              <span>Users</span>
            </div>

            <div
              className={`sidebar-item ${
                activePage === "products" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("products");
              }}
            >
              <FaBox />

              <span>Products</span>
            </div>

            <div
              className={`sidebar-item ${
                activePage === "orders" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("orders");
              }}
            >
              <FaClipboardList />

              <span>Orders</span>
            </div>

            <div
              className={`sidebar-item ${
                activePage === "payments" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("payments");
              }}
            >
              <FaCreditCard />

              <span>Payments</span>
            </div>

            <div
              className={`sidebar-item ${
                activePage === "messages" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("messages");
              }}
            >
              <FaEnvelope />

              <span>Messages</span>
            </div>

            <div
              className={`sidebar-item ${
                activePage === "settings" ? "active" : ""
              }`}
              onClick={() => {
                setActivePage("settings");
              }}
            >
              <FaCog />

              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          {/* Admin Info */}
          <div className="admin-profile">
            <img
              src={
                localStorage.getItem("profileImage") ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
              }
              alt="admin"
              className="admin-avatar"
            />

            <div>
              <h4>
                {JSON.parse(localStorage.getItem("profile"))?.name ||
                  "Krishna Sharma"}
              </h4>

              <p>
                {JSON.parse(localStorage.getItem("profile"))?.role || "Admin"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="dashboard-main">
        {activePage === "dashboard" && (
          <>
            <h1 className="admin-title">Dashboard</h1>

            {/* Cards */}
            <div className="stats-container">
              {/* Users */}
              <div className="stat-card">
                <div className="stat-icon green">
                  <FaUsers />
                </div>

                <div className="stat-text">
                  <h4>Total Users</h4>

                  <h1>{users.length}</h1>

                  <p>↑ 12% from last month</p>
                </div>
              </div>

              {/* Products */}
              <div className="stat-card">
                <div className="stat-icon purple">
                  <FaBox />
                </div>

                <div className="stat-text">
                  <h4>Total Products</h4>

                  <h1>{products.length}</h1>

                  <p>↑ 8% from last month</p>
                </div>
              </div>

              {/* Orders */}
              <div className="stat-card">
                <div className="stat-icon blue">
                  <FaShoppingCart />
                </div>

                <div className="stat-text">
                  <h4>Total Orders</h4>

                  <h1>{orders.length}</h1>

                  <p>↑ 15% from last month</p>
                </div>
              </div>

              {/* Revenue */}
              <div className="stat-card">
                <div className="stat-icon orange">
                  <FaDollarSign />
                </div>

                <div className="stat-text">
                  <h4>Total Revenue</h4>

                  <h1>₹{totalRevenue}</h1>

                  <p>↑ 18% from last month</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="dashboard-card">
              <div className="users-header">
                <h2>Dashboard Overview</h2>

                <p>Manage your gym store easily</p>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Total Users</th>

                    <th>Total Products</th>

                    <th>Total Orders</th>

                    <th>Total Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{users.length}</td>

                    <td>{products.length}</td>

                    <td>{orders.length}</td>

                    <td>₹{totalRevenue}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Other Pages */}
        {activePage === "users" && <Users />}
        {activePage === "products" && <Product />}
        {activePage === "orders" && <Orders />}
        {activePage === "payments" && <Payments />}
        {activePage === "messages" && <Messages />}
        {activePage === "settings" && <Settings />}
      </main>
    </div>
  );
}

export default AdminDashboard;
