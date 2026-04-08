import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

const fallbackPlanes = [
  {
    id: "fallback-1",
    titulo: "Plan Individual 4 sesiones",
    detalle: "4 sesiones mensuales individuales",
    descripcion: "Atencion presencial para acompanamiento constante.",
    precio: "45000",
    modalidad: "Presencial"
  },
  {
    id: "fallback-2",
    titulo: "Plan Individual 8 sesiones",
    detalle: "8 sesiones mensuales individuales",
    descripcion: "Seguimiento presencial mas intensivo durante el mes.",
    precio: "80000",
    modalidad: "Presencial"
  },
  {
    id: "fallback-3",
    titulo: "Plan Familiar 4 sesiones",
    detalle: "4 sesiones mensuales familiares",
    descripcion: "Espacio familiar para fortalecer comunicacion y bienestar.",
    precio: "90000",
    modalidad: "Presencial"
  },
  {
    id: "fallback-4",
    titulo: "Plan Online 4 sesiones",
    detalle: "4 sesiones mensuales individuales",
    descripcion: "Atencion online flexible con acompanamiento profesional.",
    precio: "30000",
    modalidad: "Online"
  },
  {
    id: "fallback-5",
    titulo: "Plan Online 8 sesiones",
    detalle: "8 sesiones mensuales individuales",
    descripcion: "Proceso online continuo para trabajo terapeutico intensivo.",
    precio: "50000",
    modalidad: "Online"
  },
  {
    id: "fallback-6",
    titulo: "Plan Familiar Online",
    detalle: "Sesiones familiares online",
    descripcion: "Modalidad familiar a distancia. Valor segun evaluacion.",
    precio: "0",
    modalidad: "Online"
  }
];

function normalizePlanes(payload) {
  if (!Array.isArray(payload)) return [];

  return payload.map((plan) => ({
    id: plan.id,
    titulo: plan.titulo || "Plan sin titulo",
    detalle: plan.duracion || "Plan mensual",
    descripcion: plan.descripcion || "",
    precio: String(plan.precio ?? "0"),
    modalidad: plan.modalidad || "Presencial",
    estado: plan.estado || "activo"
  }));
}

function formatPrecio(precio) {
  const n = Number(precio);
  if (Number.isNaN(n) || n <= 0) return "Consultar valor";
  return `$${n.toLocaleString("es-CL")} CLP`;
}

function Planes() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPlanes = async () => {
      setLoading(true);
      setError("");

      if (!API_URL) {
        if (!mounted) return;
        setPlanes(fallbackPlanes);
        setError("Mostrando planes locales. Falta configurar VITE_API_URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/servicios`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "No se pudieron cargar los planes");
        }

        if (!mounted) return;
        const normalized = normalizePlanes(data).filter((p) => p.estado !== "inactivo");
        setPlanes(normalized.length > 0 ? normalized : fallbackPlanes);
      } catch (err) {
        if (!mounted) return;
        setPlanes(fallbackPlanes);
        setError(err.message || "No se pudo cargar API. Mostrando datos locales.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPlanes();
    return () => {
      mounted = false;
    };
  }, []);

  const planesPresenciales = useMemo(
    () => planes.filter((p) => (p.modalidad || "").toLowerCase().includes("presencial")),
    [planes]
  );

  const planesOnline = useMemo(
    () => planes.filter((p) => (p.modalidad || "").toLowerCase().includes("online")),
    [planes]
  );

  return (
    <main className="planes-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Planes y packs</span>
          <h1>Planes de atencion psicologica</h1>
          <p>
            Revisa alternativas de atencion presencial y online. Puedes elegir planes
            individuales o familiares segun tus necesidades.
          </p>
          {loading && <p>Cargando planes...</p>}
          {!loading && error && <p>{error}</p>}
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Planes de sesiones</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Planes presenciales</h3>
          <p>Opciones de atencion en consulta para procesos individuales y familiares.</p>
        </div>

        <div className="cards-grid">
          {planesPresenciales.map((plan) => (
            <article className="card plan-card" key={plan.id}>
              <span className="plan-tag">Presencial</span>
              <h4>{plan.titulo}</h4>
              <p className="plan-detail">{plan.detalle}</p>
              <p>{plan.descripcion}</p>
              <strong className="plan-price">{formatPrecio(plan.precio)}</strong>
              <Link to="/contacto" className="btn-primary">
                Consultar plan
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Planes online</h3>
          <p>Alternativas flexibles para acompanarte desde cualquier lugar.</p>
        </div>

        <div className="cards-grid">
          {planesOnline.map((plan) => (
            <article className="card plan-card" key={plan.id}>
              <span className="plan-tag online">Online</span>
              <h4>{plan.titulo}</h4>
              <p className="plan-detail">{plan.detalle}</p>
              <p>{plan.descripcion}</p>
              <strong className="plan-price">{formatPrecio(plan.precio)}</strong>

              {formatPrecio(plan.precio) === "Consultar valor" ? (
                <Link to="/contacto" className="btn-primary">
                  Consultar plan
                </Link>
              ) : (
                <Link to="/reservar" className="btn-primary">
                  Reservar plan
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-box">
          <h3>No sabes que plan elegir?</h3>
          <p>
            Puedes escribirme para evaluar tu caso y encontrar la modalidad mas adecuada
            para ti o tu familia.
          </p>

          <Link to="/contacto" className="btn-primary">
            Ir a contacto
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Planes;
