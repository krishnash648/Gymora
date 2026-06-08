import "../App.css";

import { useEffect, useState } from "react";

import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase-config";

function Users() {
  // store all users
  const [users, setUsers] = useState([]);

  // get users from firebase
  useEffect(() => {
    // users collection reference
    const usersCollection = collection(db, "users");

    // realtime listener
    const unsubscribe = onSnapshot(
      usersCollection,

      (snapshot) => {
        // convert firebase docs into array
        const usersData = snapshot.docs.map((singleDoc) => {
          return {
            id: singleDoc.id,

            ...singleDoc.data(),
          };
        });

        // save users in state
        setUsers(usersData);
      },
    );

    // cleanup listener
    return () => {
      unsubscribe();
    };
  }, []);

  // delete user function
  const deleteUser = async (id) => {
    try {
      // delete user from firebase
      await deleteDoc(doc(db, "users", id));

      // success message
      alert("User Deleted Successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {/* PAGE TITLE */}
      <h1 className="admin-title">Users</h1>

      <div className="dashboard-card">
        {/* HEADER */}
        <div className="users-header">
          <h2>User Management</h2>

          <p>Total Users : {users.length}</p>
        </div>

        {/* USERS TABLE */}
        <table>
          <thead>
            <tr>
              <th>No.</th>

              <th>Email</th>

              <th>Role</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={user.id}>
                  {/* SERIAL NUMBER */}
                  <td>{index + 1}</td>

                  {/* USER EMAIL */}
                  <td>{user.email || "N/A"}</td>

                  {/* USER ROLE */}
                  <td>{user.role || "User"}</td>

                  {/* DELETE BUTTON */}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        deleteUser(user.id);
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

export default Users;
