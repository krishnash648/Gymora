import "../App.css";

import { useEffect, useState } from "react";

import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase-config";

function Payments() {
  // store all payments
  const [payments, setPayments] = useState([]);

  // get all payments from firebase
  useEffect(() => {
    // payments collection reference
    const paymentsCollection = collection(db, "payments");

    // realtime listener
    const unsubscribe = onSnapshot(
      paymentsCollection,

      (snapshot) => {
        // convert firebase docs into array
        const paymentsData = snapshot.docs.map((paymentDoc) => {
          return {
            id: paymentDoc.id,

            ...paymentDoc.data(),
          };
        });

        // save payments in state
        setPayments(paymentsData);
      },
    );

    // cleanup listener
    return () => {
      unsubscribe();
    };
  }, []);

  // delete payment function
  const deletePayment = async (id) => {
    try {
      // delete payment from firebase
      await deleteDoc(doc(db, "payments", id));

      // success message
      alert("Payment Deleted Successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  // calculate total revenue
  const totalRevenue = payments.reduce((total, item) => {
    return total + Number(item.total || 0);
  }, 0);

  return (
    <>
      {/* PAGE TITLE */}
      <h1 className="admin-title">Payments</h1>

      <div className="dashboard-card">
        {/* HEADER */}
        <div className="users-header">
          <h2>Payment Management</h2>

          <p>Total Revenue : ${totalRevenue}</p>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>No.</th>

              <th>Customer</th>

              <th>Total</th>

              <th>Payment Method</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => {
              return (
                <tr key={payment.id}>
                  {/* SERIAL NUMBER */}
                  <td>{index + 1}</td>

                  {/* CUSTOMER NAME */}
                  <td>{payment.customerName || "N/A"}</td>

                  {/* TOTAL AMOUNT */}
                  <td>${payment.total || 0}</td>

                  {/* PAYMENT METHOD */}
                  <td>{payment.paymentMethod || "Card"}</td>

                  {/* PAYMENT STATUS */}
                  <td>
                    <span
                      className={`status ${(
                        payment.status || "paid"
                      ).toLowerCase()}`}
                    >
                      {payment.status || "Paid"}
                    </span>
                  </td>

                  {/* DELETE BUTTON */}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        deletePayment(payment.id);
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

export default Payments;
