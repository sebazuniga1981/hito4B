import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [mensaje, setMensaje] = useState("");
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
    setMensaje("");
    setError("");

    if (!API_URL) {
      setError("Falta configurar VITE_API_URL en frontend (Render).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
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
        setError(data.error || "No se pudo registrar el usuario");
        return;
      }

      setMensaje("Usuario creado correctamente");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
          <span className="page-badge">Registro</span>
          <h1>Crea tu cuenta en PsicoConecta</h1>
          <p className="auth-subtext">
            Registrate para poder reservar horas y acceder a tu informacion.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </div>

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
                placeholder="Crea una contrasena"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contrasena</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repite tu contrasena"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}

            <button type="submit" className="btn-primary auth-button" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Ya tienes cuenta?{" "}
              <Link to="/login" className="text-link">
                Inicia sesion aqui
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Registro;
