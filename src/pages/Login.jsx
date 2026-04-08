import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

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

      if (!response.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.role) {
        localStorage.setItem("role", data.role);
      } else {
        localStorage.removeItem("role");
      }

      navigate(data.role === "admin" ? "/panel-psicologa" : "/panel-paciente");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <div className="auth-card">
          <span className="page-badge">Iniciar sesión</span>
          <h1>Bienvenido/a a PsicoConecta</h1>
          <p className="auth-subtext">
            Ingresa a tu cuenta para revisar tu información y gestionar tus reservas.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
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
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p>{error}</p>}

            <button type="submit" className="btn-primary auth-button">
              Iniciar sesión
            </button>
          </form>

          <div className="auth-links">
            <p>
              ¿Aún no tienes cuenta?{" "}
              <Link to="/registro" className="text-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
