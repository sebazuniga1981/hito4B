import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import { HORAS_AGENDA } from "../constants/agenda";

const HOURS = HORAS_AGENDA;

function ReservarHora() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    fecha: "",
    hora: "",
    modalidad: "",
    tipoSesion: ""
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
  const [horasNoDisponibles, setHorasNoDisponibles] = useState([]);

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

    const nombre = formData.nombre.trim();
    const apellido = formData.apellido.trim();
    const email = formData.email.trim();

    if (!nombre || !apellido || !email) {
      setError("Nombre, apellido y correo son obligatorios.");
      return;
    }

    if (horasNoDisponibles.includes(formData.hora)) {
      setError("La hora seleccionada ya no esta disponible. Elige otra.");
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
        body: JSON.stringify({
          ...formData,
          nombre,
          apellido,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo guardar la reserva");
        return;
      }

      setMensaje("Reserva guardada correctamente");
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
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

  useEffect(() => {
    let isMounted = true;

    const fetchDisponibilidad = async () => {
      if (!formData.fecha || !API_URL) {
        if (isMounted) setHorasNoDisponibles([]);
        return;
      }

      setLoadingDisponibilidad(true);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/api/reservas/disponibilidad?fecha=${encodeURIComponent(formData.fecha)}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo cargar disponibilidad");

        if (!isMounted) return;
        const ocupadas = Array.isArray(data?.horasNoDisponibles) ? data.horasNoDisponibles : [];
        setHorasNoDisponibles(ocupadas);
        setFormData((prev) => (ocupadas.includes(prev.hora) ? { ...prev, hora: "" } : prev));
      } catch {
        if (!isMounted) return;
        setHorasNoDisponibles([]);
      } finally {
        if (isMounted) setLoadingDisponibilidad(false);
      }
    };

    fetchDisponibilidad();
    return () => {
      isMounted = false;
    };
  }, [formData.fecha]);

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
          <p>Completa tus datos para confirmar tu reserva.</p>
        </div>

        <div className="booking-card">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electronico</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input type="date" id="fecha" value={formData.fecha} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <select id="hora" value={formData.hora} onChange={handleChange} required>
                <option value="">Selecciona una hora</option>
                {HOURS.map((hora) => (
                  <option key={hora} value={hora} disabled={horasNoDisponibles.includes(hora)}>
                    {hora} {horasNoDisponibles.includes(hora) ? "(No disponible)" : ""}
                  </option>
                ))}
              </select>
              {formData.fecha && (
                <small>
                  {loadingDisponibilidad
                    ? "Actualizando disponibilidad..."
                    : "Se bloquean horarios pendientes, confirmados y bloqueados por administracion."}
                </small>
              )}
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
            Te enviaremos la confirmacion de tu reserva despues de guardar la solicitud.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ReservarHora;
