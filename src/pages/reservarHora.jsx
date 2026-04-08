import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function ReservarHora() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    modalidad: "",
    tipoSesion: ""
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!API_URL) {
      setError("Falta configurar VITE_API_URL en frontend (Render).");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo guardar la reserva");
        return;
      }

      setMensaje("Reserva guardada correctamente");
      setFormData({
        fecha: "",
        hora: "",
        modalidad: "",
        tipoSesion: ""
      });
      setTimeout(() => navigate("/confirmacion-reserva"), 900);
    } catch {
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reservar-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Reservar hora</span>
          <h1>Agenda tu sesion</h1>
          <p>Selecciona la fecha, horario y modalidad para reservar tu atencion.</p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Reserva</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Formulario de reserva</h3>
          <p>Esta vista ahora envia la reserva al backend configurado en `VITE_API_URL`.</p>
        </div>

        <div className="booking-card">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input type="date" id="fecha" value={formData.fecha} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <select id="hora" value={formData.hora} onChange={handleChange} required>
                <option value="">Selecciona una hora</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modalidad">Modalidad</label>
              <select id="modalidad" value={formData.modalidad} onChange={handleChange} required>
                <option value="">Selecciona una modalidad</option>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tipoSesion">Tipo de sesion</label>
              <select id="tipoSesion" value={formData.tipoSesion} onChange={handleChange} required>
                <option value="">Selecciona un tipo de sesion</option>
                <option value="Terapia individual">Terapia individual</option>
                <option value="Ansiedad">Ansiedad</option>
                <option value="Estres">Estres</option>
                <option value="Autoestima">Autoestima</option>
                <option value="Duelo">Duelo</option>
              </select>
            </div>

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}

            <button type="submit" className="btn-primary auth-button" disabled={loading}>
              {loading ? "Guardando..." : "Confirmar reserva"}
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Informacion importante</h3>
          <p>
            Si la API falla, revisa que `VITE_API_URL` apunte al backend desplegado y que ese backend
            use la URL de PostgreSQL de Render en su entorno.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ReservarHora;
