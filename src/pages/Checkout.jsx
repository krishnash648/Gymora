import "../App.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase-config";

import { useAuth } from "../context/AuthContext";

function Checkout({ cart, setCart }) {
  // navigate page
  const navigate = useNavigate();

  // current logged in user
  const { currentUser } = useAuth();

  // payment method state
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  // shipping form data
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // calculate total cart price
  const total = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // update input fields
  const handleChange = (e) => {
    setShippingData({
      ...shippingData,

      [e.target.name]: e.target.value,
    });
  };

  // place order function
  const placeOrder = async () => {
    try {
      // check user login
      if (!currentUser) {
        alert("Please Login First");

        return;
      }

      // validate all fields
      if (
        !shippingData.fullName ||
        !shippingData.phone ||
        !shippingData.address ||
        !shippingData.city ||
        !shippingData.pincode
      ) {
        alert("Please Fill All Fields");

        return;
      }

      // validate stock
      for (const item of cart) {
        if (item.quantity > item.stock) {
          alert(`${item.productName} is out of stock`);

          return;
        }
      }

      // save order in firebase
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,

        customerName: shippingData.fullName,

        phone: shippingData.phone,

        address: shippingData.address,

        city: shippingData.city,

        pincode: shippingData.pincode,

        products: cart,

        total: total,

        paymentMethod: paymentMethod,

        userEmail: currentUser.email,

        status: "Pending",

        createdAt: serverTimestamp(),
      });

      // reduce stock
      for (const item of cart) {
        const productRef = doc(db, "products", item.id);

        await updateDoc(productRef, {
          stock: item.stock - item.quantity,
        });
      }

      // success message
      alert("Order Placed Successfully");

      // clear cart
      setCart([]);

      // redirect home page
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h1>Checkout</h1>

          {/* SHIPPING FORM */}
          <div className="checkout-form">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingData.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={shippingData.phone}
              onChange={handleChange}
            />

            <textarea
              name="address"
              placeholder="Address"
              value={shippingData.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingData.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={shippingData.pincode}
              onChange={handleChange}
            />
          </div>

          {/* PAYMENT METHODS */}
          <div className="payment-methods">
            <h2>Payment Method</h2>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "Cash On Delivery"}
                onChange={() => {
                  setPaymentMethod("Cash On Delivery");
                }}
              />
              Cash On Delivery
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "UPI"}
                onChange={() => {
                  setPaymentMethod("UPI");
                }}
              />
              UPI
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "Card"}
                onChange={() => {
                  setPaymentMethod("Card");
                }}
              />
              Card
            </label>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h2>Order Summary</h2>

          {/* PRODUCTS */}
          <div className="checkout-products">
            {cart.map((item) => {
              return (
                <div key={item.id} className="checkout-product">
                  <img src={item.imageUrl} alt={item.productName} />

                  <div>
                    <h3>{item.productName}</h3>

                    <p>Quantity :{item.quantity}</p>
                  </div>

                  <span>${item.price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          {/* TOTAL */}
          <div className="checkout-total">
            <h2>Total</h2>

            <h1>${total}</h1>
          </div>

          {/* PLACE ORDER BUTTON */}
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
