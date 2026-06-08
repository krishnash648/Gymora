import React, { useState } from "react";

import { User, Lock, KeyRound, Eye, EyeOff, Pencil, Send } from "lucide-react";

import { sendPasswordResetEmail, updatePassword } from "firebase/auth";

import { auth } from "../firebase-config";

import "../App.css";

function Settings() {
  // profile information state
  const [profile, setProfile] = useState(() => {
    // get saved profile from localStorage
    const savedProfile = localStorage.getItem("profile");

    // if profile exists
    // convert string to object
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }

    // default profile data
    return {
      name: "Krishna Sharma",

      email: "krishnasharma030202@gmail.com",

      phone: "+91 9664480918",

      role: "Admin",
    };
  });

  // profile image state
  const [profileImage, setProfileImage] = useState(() => {
    return (
      localStorage.getItem("profileImage") ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"
    );
  });

  // password fields state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",

    newPassword: "",

    confirmPassword: "",
  });

  // show hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // toast message state
  const [message, setMessage] = useState("");

  // update profile input fields
  const handleProfileInputChange = (e) => {
    setProfile({
      ...profile,

      [e.target.name]: e.target.value,
    });
  };

  // update password input fields
  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,

      [e.target.name]: e.target.value,
    });
  };

  // upload profile image
  const handleProfileImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // check if file exists
    if (selectedFile) {
      const fileReader = new FileReader();

      // after image loads
      fileReader.onloadend = () => {
        // save image in state
        setProfileImage(fileReader.result);

        // save image in localStorage
        localStorage.setItem("profileImage", fileReader.result);

        // success message
        setMessage("Profile Photo Updated");

        // remove message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);
      };

      // convert image into base64
      fileReader.readAsDataURL(selectedFile);
    }
  };

  // update profile function
  const updateProfileDetails = () => {
    // save profile in localStorage
    localStorage.setItem("profile", JSON.stringify(profile));

    // success message
    setMessage("Profile Updated Successfully");

    // clear message
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // change password function
  const changeUserPassword = async () => {
    try {
      // check empty fields
      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setMessage("Please Fill All Password Fields");

        return;
      }

      // check password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage("Passwords Do Not Match");

        return;
      }

      // current logged in user
      const currentUser = auth.currentUser;

      // update password
      await updatePassword(currentUser, passwordData.newPassword);

      // success message
      setMessage("Password Changed Successfully");

      // clear password fields
      setPasswordData({
        currentPassword: "",

        newPassword: "",

        confirmPassword: "",
      });

      // clear message
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // send reset password email
  const sendResetPasswordLink = async () => {
    try {
      // send reset email
      await sendPasswordResetEmail(auth, profile.email);

      // success message
      setMessage("Reset Email Sent Successfully");

      // clear message
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="settings">
      {/* TOAST MESSAGE */}
      {message && <div className="toast">{message}</div>}

      {/* TOP SECTION */}
      <div className="settings-top">
        <div>
          <h1>Settings</h1>

          <p>Manage your account settings and security</p>
        </div>

        {/* ADMIN INFO */}
        <div className="admin-box">
          <img src={profileImage} alt="" className="admin-img" />

          <div>
            <h4>{profile.name}</h4>

            <span>{profile.role}</span>
          </div>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="settings-card">
        <div className="card-title">
          <User className="card-icon" />

          <div>
            <h2>Admin Profile</h2>

            <p>Update your personal information</p>
          </div>
        </div>

        <div className="profile-section">
          {/* LEFT SIDE */}
          <div className="profile-left">
            <div className="profile-img-box">
              <img src={profileImage} alt="" className="profile-img" />

              {/* IMAGE UPLOAD BUTTON */}
              <label className="profile-edit-btn">
                <Pencil size={16} />

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>

            {/* UPDATE PROFILE BUTTON */}
            <button className="blue-btn" onClick={updateProfileDetails}>
              Update Profile
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-right">
            {/* FULL NAME */}
            <div className="input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileInputChange}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileInputChange}
              />
            </div>

            {/* PHONE */}
            <div className="input-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileInputChange}
              />
            </div>

            {/* ROLE */}
            <div className="input-group">
              <label>Role</label>

              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleProfileInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PASSWORD CARD */}
      <div className="settings-card">
        <div className="card-title">
          <Lock className="card-icon" />

          <div>
            <h2>Change Password</h2>

            <p>Update your password to keep your account secure</p>
          </div>
        </div>

        <div className="password-grid">
          {/* CURRENT PASSWORD */}
          <div className="input-group">
            <label>Current Password</label>

            <div className="password-input">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
              />

              <button
                type="button"
                onClick={() => {
                  setShowCurrentPassword(!showCurrentPassword);
                }}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="input-group">
            <label>New Password</label>

            <div className="password-input">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
              />

              <button
                type="button"
                onClick={() => {
                  setShowNewPassword(!showNewPassword);
                }}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <label>Confirm New Password</label>

            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
              />

              <button
                type="button"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD BUTTON */}
        <button className="blue-btn" onClick={changeUserPassword}>
          Change Password
        </button>
      </div>

      {/* FORGOT PASSWORD */}
      <div className="settings-card">
        <div className="forgot-top">
          <div>
            <div className="card-title">
              <KeyRound className="card-icon" />

              <div>
                <h2>Forgot Password</h2>

                <p>Reset your password using your registered email</p>
              </div>
            </div>

            {/* RECOVERY EMAIL */}
            <div className="input-group forgot-input">
              <label>Recovery Email</label>

              <input type="email" value={profile.email} readOnly />

              <small>
                We will send a password reset link to this email address.
              </small>
            </div>

            {/* SEND RESET LINK BUTTON */}
            <button className="blue-btn" onClick={sendResetPasswordLink}>
              <Send size={16} />
              Send Reset Link
            </button>
          </div>

          {/* LAST PASSWORD CHANGE */}
          <div className="last-password-box">
            <p>Last Password Changed</p>

            <h4>25 May 2025, 10:30 AM</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
