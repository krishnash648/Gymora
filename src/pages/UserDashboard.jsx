import "../App.css";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  // PROFILE EDIT
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // REVIEW
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const addressRef = collection(db, "users", currentUser.uid, "addresses");

    const unsubscribe = onSnapshot(addressRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(data);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // SET USER DATA
  useEffect(() => {
    if (userData) {
      setEditName(userData.name || "");
      setEditPhone(userData.phone || "");
      setEditAddress(userData.address || "");
    }
  }, [userData]);

  // FETCH ORDERS
  useEffect(() => {
    if (!currentUser) return;
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
    );
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // FETCH RECENTLY VIEWED
  useEffect(() => {
    if (!currentUser) return;

    try {
      const recentCollection = collection(
        db,
        "users",
        currentUser.uid,
        "recentlyViewed",
      );

      const unsubscribe = onSnapshot(
        recentCollection,
        (snapshot) => {
          const recentData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const sortedProducts = recentData.sort((a, b) => {
            if (!a.viewedAt || !b.viewedAt) return 0;

            return b.viewedAt.seconds - a.viewedAt.seconds;
          });

          setRecentProducts(sortedProducts.slice(0, 5));
        },
        (error) => {
          console.log("RECENT PRODUCTS ERROR:", error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  // SAVE PROFILE
  const saveProfile = async () => {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: editName,
        phone: editPhone,
        address: editAddress,
      });
      alert("Profile Updated");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // SUBMIT REVIEW
  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write review");
      return;
    }
    try {
      const firstProduct = selectedOrder.products?.[0];

      await addDoc(collection(db, "reviews"), {
        productId: firstProduct.id,
        productName: firstProduct.productName,
        productImage: firstProduct.imageUrl,
        userId: currentUser.uid,
        userName: userData?.name || currentUser.email,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });

      const reviewsSnapshot = await getDocs(
        query(
          collection(db, "reviews"),
          where("productId", "==", firstProduct.id),
        ),
      );

      const allReviews = reviewsSnapshot.docs.map((doc) => doc.data());

      const totalRatings = allReviews.reduce((total, review) => {
        return total + review.rating;
      }, 0);

      const newTotal = totalRatings + rating;
      const newCount = allReviews.length + 1;
      const averageRating = newTotal / newCount;

      await updateDoc(doc(db, "products", firstProduct.id), {
        rating: averageRating.toFixed(1),
        reviewCount: newCount,
      });

      await updateDoc(doc(db, "orders", selectedOrder.id), {
        hasReviewed: true,
      });

      setSelectedOrder({
        ...selectedOrder,
        hasReviewed: true,
      });

      alert("Review Submitted");

      setComment("");
      setRating(5);
    } catch (error) {
      console.log(error);
    }
  };

  const saveAddress = async () => {
    try {
      const addressRef = collection(db, "users", currentUser.uid, "addresses");

      await addDoc(addressRef, {
        ...shippingData,
        isDefault: false,
        createdAt: serverTimestamp(),
      });

      alert("Address Saved");

      setShippingData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowAddressForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <div className="dashboard-sidebar">
        <h2>My Account</h2>

        <button
          className={activeSection === "dashboard" ? "active-tab" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={activeSection === "orders" ? "active-tab" : ""}
          onClick={() => setActiveSection("orders")}
        >
          My Orders
        </button>

        <button
          className={activeSection === "addresses" ? "active-tab" : ""}
          onClick={() => setActiveSection("addresses")}
        >
          Addresses
        </button>

        <button
          className={activeSection === "wishlist" ? "active-tab" : ""}
          onClick={() => setActiveSection("wishlist")}
        >
          Wishlist
        </button>
        <button className="logout-sidebar-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* MAIN */}
      <div className="dashboard-main">
        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="profile-overview">
            {/* PROFILE CARD */}
            <div className="profile-card">
              <div className="profile-avatar-box">
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt=""
                    className="profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar">
                    {editName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <label className="avatar-upload-btn">
                  +
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={async (e) => {
                      try {
                        const file = e.target.files[0];

                        if (!file) return;

                        setUploading(true);

                        const imageRef = ref(
                          storage,
                          `profile-images/${currentUser.uid}`,
                        );

                        await uploadBytes(imageRef, file);

                        const downloadURL = await getDownloadURL(imageRef);

                        await updateDoc(doc(db, "users", currentUser.uid), {
                          photoURL: downloadURL,
                        });
                      } catch (error) {
                        console.log(error);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="profile-info">
                {!isEditing ? (
                  <>
                    <h2>{editName || "User"}</h2>

                    <p>{currentUser?.email}</p>

                    <p>{editPhone || "No phone added"}</p>

                    <p>{editAddress || "No address added"}</p>

                    <button
                      className="edit-profile-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="edit-profile-form">
                    <input
                      type="text"
                      placeholder="Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Phone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />

                    <textarea
                      placeholder="Address"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                    />

                    <div className="profile-btns">
                      <button
                        className="save-profile-btn"
                        onClick={saveProfile}
                      >
                        Save Changes
                      </button>

                      <button
                        className="cancel-profile-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STATS */}
            <div className="dashboard-stats">
              <div className="stat-box">
                <h3>{orders.length}</h3>
                <p>Total Orders</p>
              </div>

              <div className="stat-box">
                <h3>
                  {
                    orders.filter((o) => {
                      return o.status === "Delivered";
                    }).length
                  }
                </h3>

                <p>Delivered</p>
              </div>

              <div className="stat-box">
                <h3>
                  {
                    orders.filter((o) => {
                      return o.status === "Pending";
                    }).length
                  }
                </h3>
                <p>Pending</p>
              </div>
            </div>

            {/* RECENTLY VIEWED */}
            <div className="recent-products-section">
              <h2>Recently Viewed</h2>

              <div className="recent-products-grid">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => {
                    return (
                      <div key={product.id} className="recent-product-card">
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="recent-product-image"
                        />

                        <div className="recent-product-info">
                          <h3>{product.productName}</h3>

                          <p>${product.price}</p>

                          <button
                            className="recent-cart-btn"
                            onClick={() => {
                              if (product.productId) {
                                navigate(`/product/${product.productId}`);
                              }
                            }}
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-recent-products">
                    No recently viewed products
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeSection === "orders" && (
          <>
            <div className="dashboard-header">
              <h1>My Orders</h1>
            </div>

            <div className="orders-section">
              <div className="orders-list">
                {orders.map((order) => {
                  const firstProduct = order.products?.[0] || {
                    productName: order.productName,
                    imageUrl: order.productImage,
                    quantity: 1,
                  };

                  return (
                    <div
                      key={order.id}
                      className="modern-order-card"
                      onClick={() => {
                        setSelectedOrder(order);
                      }}
                    >
                      {/* LEFT */}
                      <div className="modern-order-left">
                        <img
                          src={firstProduct.imageUrl}
                          alt=""
                          className="modern-order-img"
                        />
                      </div>

                      {/* CENTER */}
                      <div className="modern-order-center">
                        <h3>{firstProduct.productName}</h3>

                        <p>Quantity: {firstProduct.quantity}</p>

                        <p>Total: ${order.total}</p>

                        <p>Payment: {order.paymentMethod}</p>
                      </div>

                      {/* RIGHT */}
                      <div className="modern-order-right">
                        <span
                          className={`modern-status ${order.status?.toLowerCase()}`}
                        >
                          {order.status}
                        </span>

                        {(order.status === "Pending" ||
                          order.status === "Packed") && (
                          <button
                            className="cancel-modern-btn"
                            onClick={async (e) => {
                              e.stopPropagation();

                              await deleteDoc(doc(db, "orders", order.id));
                            }}
                          >
                            Cancel Order
                          </button>
                        )}

                        {order.status === "Delivered" &&
                          !order.refundRequested && (
                            <button
                              className="track-btn"
                              onClick={async (e) => {
                                e.stopPropagation();

                                await updateDoc(doc(db, "orders", order.id), {
                                  refundRequested: true,
                                });
                              }}
                            >
                              Request Refund
                            </button>
                          )}

                        {order.refundRequested && (
                          <p className="refund-text">Refund Requested</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeSection === "addresses" && (
          <div className="address-section">
            <div className="address-header">
              <h2>My Addresses</h2>

              <button
                className="add-address-btn"
                onClick={() => setShowAddressForm(true)}
              >
                + Add Address
              </button>
            </div>
            {showAddressForm && (
              <div className="address-form">
                <h2>Add Address</h2>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingData.fullName}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      fullName: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={shippingData.phone}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      phone: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Full Address"
                  value={shippingData.address}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      address: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="City"
                  value={shippingData.city}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      city: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="State"
                  value={shippingData.state}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      state: e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={shippingData.pincode}
                  onChange={(e) =>
                    setShippingData({
                      ...shippingData,
                      pincode: e.target.value,
                    })
                  }
                />

                <div className="address-form-buttons">
                  <button className="save-address-btn" onClick={saveAddress}>
                    Save Address
                  </button>

                  <button
                    className="cancel-address-btn"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="address-list">
              {addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <h3>
                    <strong></strong>
                    <FaMapMarkerAlt />
                    {address.fullName}
                  </h3>
                  <span className="default-badge">Default</span>
                  <p>
                    <strong>Phone: </strong>
                    {address.phone}
                  </p>

                  <p>
                    <strong>Address: </strong>
                    {address.address}
                  </p>

                  <p>
                    <strong>City: </strong>
                    {address.city}, {address.state}
                  </p>

                  <p>
                    <strong>Pincode: </strong>
                    {address.pincode}
                  </p>

                  <div className="address-actions">
                    <button>Edit</button>

                    <button>Delete</button>
                  </div>

                  {address.isDefault && (
                    <span className="default-badge">Default Address</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WISHLIST */}
        {activeSection === "wishlist" && (
          <div className="coming-soon-box">
            <h2>Wishlist</h2>
            <p>Your wishlist products will appear here.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div
          className="order-modal"
          onClick={() => {
            setSelectedOrder(null);
          }}
        >
          <div
            className="order-modal-content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              className="close-modal-btn"
              onClick={() => {
                setSelectedOrder(null);
              }}
            >
              ✕
            </button>

            <h2>Order Details</h2>

            {/* PRODUCTS */}
            <div className="modal-order-products">
              {selectedOrder.products?.map((product, index) => {
                return (
                  <div key={index} className="modal-product-card">
                    <img src={product.imageUrl || "/placeholder.png"} alt="" />

                    <div>
                      <h3>{product.productName}</h3>

                      <p>Quantity: {product.quantity}</p>

                      <p>Price: ${product.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TRACKING */}
            <div className="tracking-section">
              <h3>Track Order</h3>

              <div
                className={`tracker-step ${
                  ["Pending", "Packed", "Shipped", "Delivered"].includes(
                    selectedOrder.status,
                  )
                    ? "active"
                    : ""
                }`}
              >
                <div className="tracker-dot"></div>
                <p>Order Placed</p>
              </div>

              <div
                className={`tracker-step ${
                  ["Packed", "Shipped", "Delivered"].includes(
                    selectedOrder.status,
                  )
                    ? "active"
                    : ""
                }`}
              >
                <div className="tracker-dot"></div>
                <p>Packed</p>
              </div>

              <div
                className={`tracker-step ${
                  ["Shipped", "Delivered"].includes(selectedOrder.status)
                    ? "active"
                    : ""
                }`}
              >
                <div className="tracker-dot"></div>
                <p>Shipped</p>
              </div>

              <div
                className={`tracker-step ${
                  selectedOrder.status === "Delivered" ? "active" : ""
                }`}
              >
                <div className="tracker-dot"></div>
                <p>Delivered</p>
              </div>
            </div>

            {/* SHIPPING INFO */}
            <div className="shipping-info">
              <h3>Shipping Info</h3>

              <p>
                <strong>Name:</strong> {selectedOrder.customerName}
              </p>

              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>

              <p>
                <strong>Address:</strong> {selectedOrder.address}
              </p>

              <p>
                <strong>City:</strong> {selectedOrder.city}
              </p>

              <p>
                <strong>Pincode:</strong> {selectedOrder.pincode}
              </p>
            </div>

            {/* ORDER INFO */}
            <div className="order-extra-info">
              <h3>Order Info</h3>

              <p>
                <strong>Payment:</strong> {selectedOrder.paymentMethod}
              </p>

              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>

              <p>
                <strong>Total:</strong> ${selectedOrder.total}
              </p>

              <p>
                <strong>Tracking ID:</strong> TRK92837123
              </p>

              <p>
                <strong>Estimated Delivery:</strong> 30 May 2026
              </p>
            </div>

            {/* REVIEW */}
            {selectedOrder.status === "Delivered" &&
              !selectedOrder.hasReviewed && (
                <div className="review-section">
                  <h2>Write Review</h2>

                  <div className="review-form">
                    <select
                      value={rating}
                      onChange={(e) => {
                        setRating(Number(e.target.value));
                      }}
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>

                    <textarea
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />

                    <button
                      className="submit-review-btn"
                      onClick={submitReview}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

            {selectedOrder.hasReviewed && (
              <p className="review-done">Review Submitted ✓</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
