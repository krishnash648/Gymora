import "../App.css";

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase-config";

function Orders() {
  // store all orders
  const [orders, setOrders] = useState([]);

  // get all orders from firebase
  useEffect(() => {
    // reference of orders collection
    const ordersCollection = collection(db, "orders");

    // realtime listener
    const unsubscribe = onSnapshot(
      ordersCollection,

      (snapshot) => {
        // convert firebase docs into array
        const ordersData = snapshot.docs.map((orderDoc) => {
          return {
            id: orderDoc.id,

            ...orderDoc.data(),
          };
        });

        // store orders in state
        setOrders(ordersData);
      },
    );

    // cleanup listener
    return () => {
      unsubscribe();
    };
  }, []);

  // delete order function
  const deleteOrder = async (id) => {
    try {
      // delete order from firebase
      await deleteDoc(doc(db, "orders", id));

      // success message
      alert("Order Deleted Successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {/* PAGE TITLE */}
      <h1 className="admin-title">Orders</h1>

      <div className="dashboard-card">
        {/* HEADER */}
        <div className="users-header">
          <h2>Order Management</h2>

          <p>Total Orders : {orders.length}</p>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>No.</th>

              <th>Customer</th>

              <th>Product</th>

              <th>Total</th>

              <th>Payment</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => {
              return (
                <tr key={order.id}>
                  {/* SERIAL NUMBER */}
                  <td>{index + 1}</td>

                  {/* CUSTOMER NAME */}
                  <td>{order.customerName || "N/A"}</td>

                  {/* PRODUCT NAME */}
                  <td>{order.products?.[0]?.productName || "N/A"}</td>

                  {/* TOTAL PRICE */}
                  <td>${order.total || 0}</td>

                  {/* PAYMENT METHOD */}
                  <td>{order.paymentMethod || "N/A"}</td>

                  {/* ORDER STATUS */}
                  <td>
                    <select
                      className="status-dropdown"
                      value={order.status || "Pending"}
                      onChange={(e) => {
                        updateOrderStatus(order.id, e.target.value);
                      }}
                    >
                      <option value="Pending">Pending</option>

                      <option value="Packed">Packed</option>

                      <option value="Shipped">Shipped</option>

                      <option value="Delivered">Delivered</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* DELETE BUTTON */}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        deleteOrder(order.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Orders;
