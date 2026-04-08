import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function getRoleFromToken(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    return payload.role || payload.rol || "";
  } catch {
    return "";
  }
}

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!API_URL) {
      setError("Falta configurar VITE_API_URL en frontend (Render).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
console.log("LOGIN RESPONSE:", data);
console.log("TOKEN PAYLOAD:", data.token ? JSON.parse(atob(data.token.split(".")[1])) : null);

      if (!response.ok) {
        setError(data.error || "No se pudo iniciar sesion");
        return;
      }

      localStorage.setItem("token", data.token);
      const userRole = data.role || data.rol || getRoleFromToken(data.token) || "";
      if (userRole) {
        localStorage.setItem("role", userRole);
        localStorage.setItem("rol", userRole);
      } else {
        localStorage.removeItem("role");
        localStorage.removeItem("rol");
      }

      navigate(userRole === "admin" ? "/panel-psicologa" : "/panel-paciente");
    } catch {
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <div className="auth-card">
          <span className="page-badge">Iniciar sesion</span>
          <h1>Bienvenido/a a PsicoConecta</h1>
          <p className="auth-subtext">
            Ingresa a tu cuenta para revisar tu informacion y gestionar tus reservas.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electronico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contrasena</label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contrasena"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p>{error}</p>}

            <button type="submit" className="btn-primary auth-button" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar sesion"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Aun no tienes cuenta?{" "}
              <Link to="/registro" className="text-link">
                Registrate aqui
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
