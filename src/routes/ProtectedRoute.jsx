import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/panel-paciente" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
