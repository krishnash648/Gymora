import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { userData, loading } = useAuth();

  // loading
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // check admin
  if (!userData || userData.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;
