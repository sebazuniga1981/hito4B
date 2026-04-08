import { Navigate, Outlet } from "react-router-dom";

function PublicOnlyRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    return <Navigate to={role === "admin" ? "/panel-psicologa" : "/panel-paciente"} replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
