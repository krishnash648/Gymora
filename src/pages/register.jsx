import "../App.css";

import { useState } from "react";

import { auth, db } from "../firebase-config";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  // register user
  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // save user data
      await setDoc(
        doc(db, "users", user.uid),

        {
          uid: user.uid,

          email: user.email,

          name: name,

          photo: user.photoURL || "",

          role: "user",
        },
      );

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error.code);

      console.log(error.message);

      alert(error.message);
    }
  };

  // google signup
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),

        {
          uid: user.uid,

          email: user.email,

          name: name,

          photo: user.photoURL || "",

          role: "user",
        },

        {
          merge: true,
        },
      );

      alert("Logged In Successfully");

      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="register">
      <div className="register-box">
        <h2>Register</h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter Name"
          className="register-input"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter Email"
          className="register-input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter Password"
          className="register-input"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        {/* Register Button */}
        <button className="register-btn" onClick={registerUser}>
          Register
        </button>

        {/* Google Button */}
        <button className="google-btn" onClick={googleLogin}>
          Sign Up With Google
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
