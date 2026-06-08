import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Login() {
  // states
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // google provider
  const provider = new GoogleAuthProvider();

  // login with email password
  const loginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // get firestore user data
      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();

      alert("Login Successful");

      // role check
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);

      alert(error.message);
    }
  };

  // google login
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // firestore ref
      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      // create user if not exists
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,

          email: user.email,

          name: user.displayName || "User",

          photo: user.photoURL || "",

          role: "user",
        });
      }

      // get final user data
      const finalUser = await getDoc(userRef);

      const finalUserData = finalUser.data();

      alert("Google Login Successful");

      // redirect
      if (finalUserData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);

      alert(error.message);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h2>Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter Email"
          className="login-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter Password"
          className="login-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        {/* Login Button */}
        <button className="login-btn" onClick={loginUser}>
          Login
        </button>

        {/* Google Login */}
        <button className="google-btn" onClick={googleLogin}>
          Login With Google
        </button>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <span
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
