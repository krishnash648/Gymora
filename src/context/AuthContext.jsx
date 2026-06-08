import { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase-config";

import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userRef = doc(db, "users", user.uid);

        unsubscribeSnapshot = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData({
              uid: user.uid,
              ...snapshot.data(),
            });
          }
        });
      } else {
        setCurrentUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
