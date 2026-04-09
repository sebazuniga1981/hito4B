import { useEffect, useMemo, useState } from "react";
import API_URL from "../api";
import { HORAS_AGENDA } from "../constants/agenda";

const HORAS_REPROGRAMACION = HORAS_AGENDA;

function formatFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const d = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function normalizeReservas(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.reservas)) return payload.reservas;
  return [];
}

function getEstadoClass(estado) {
  const e = (estado || "").toLowerCase();
  if (e === "confirmada") return "status-confirmada";
  if (e === "pendiente") return "status-pendiente";
  return "status-cancelada";
}

async function safeReadJson(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function PanelPaciente() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfilLoading, setPerfilLoading] = useState(true);
  const [perfilSaving, setPerfilSaving] = useState(false);
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "",
    telefono: "",
    email: ""
  });
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [actionKey, setActionKey] = useState("");
  const [editandoReservaId, setEditandoReservaId] = useState(null);
  const [nuevoHorario, setNuevoHorario] = useState({ fecha: "", hora: "" });

  const token = localStorage.getItem("token");

  const proximasActivas = useMemo(() => {
    return reservas
      .filter((r) => ["pendiente", "confirmada"].includes((r.estado || "").toLowerCase()))
      .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
  }, [reservas]);

  const proximaReserva = proximasActivas[0] || null;

  const loadReservas = async () => {
    setLoading(true);
    setError("");

    if (!API_URL) {
      setReservas([]);
      setError("No se pudo cargar tus reservas en este entorno.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reservas/mias`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await safeReadJson(response);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "El endpoint /api/reservas/mias no esta disponible o no responde JSON en el backend."
        );
      }

      setReservas(normalizeReservas(data));
    } catch (err) {
      setReservas([]);
      setError(err.message || "No se pudieron cargar tus reservas");
    } finally {
      setLoading(false);
    }
  };

  const loadPerfil = async () => {
    setPerfilLoading(true);

    if (!API_URL) {
      setPerfilLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/mi-perfil`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await safeReadJson(response);
      if (!response.ok) throw new Error(data?.error || "No se pudo cargar perfil");

      setPerfil({
        nombre: data?.nombre || "",
        apellido: data?.apellido || "",
        edad: data?.edad == null ? "" : String(data.edad),
        sexo: data?.sexo || "",
        telefono: data?.telefono || "",
        email: data?.email || ""
      });
    } catch (err) {
      setError((prev) => prev || err.message || "No se pudo cargar perfil");
    } finally {
      setPerfilLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
    loadPerfil();
  }, []);

  const handlePerfilChange = (e) => {
    setPerfil((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setPerfilSaving(true);
    setError("");
    setMensaje("");

    try {
      const response = await fetch(`${API_URL}/api/mi-perfil`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...perfil,
          edad: perfil.edad === "" ? null : Number(perfil.edad)
        })
      });

      const data = await safeReadJson(response);
      if (!response.ok) throw new Error(data?.error || "No se pudo actualizar perfil");

      setPerfil({
        nombre: data?.nombre || "",
        apellido: data?.apellido || "",
        edad: data?.edad == null ? "" : String(data.edad),
        sexo: data?.sexo || "",
        telefono: data?.telefono || "",
        email: data?.email || ""
      });
      setMensaje("Perfil actualizado correctamente");
      setEditandoPerfil(false);
    } catch (err) {
      setError(err.message || "No se pudo actualizar perfil");
    } finally {
      setPerfilSaving(false);
    }
  };

  const cancelarReserva = async (reservaId) => {
    const confirmar = window.confirm("Se cancelara esta reserva. Deseas continuar?");
    if (!confirmar) return;

    setActionKey(`cancelar_${reservaId}`);
    setError("");
    setMensaje("");

    try {
      const response = await fetch(`${API_URL}/api/reservas/${reservaId}/cancelar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await safeReadJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo cancelar la reserva");
      }

      setReservas((prev) =>
        prev.map((r) => (r.id === reservaId ? { ...r, estado: "cancelada" } : r))
      );
      setMensaje("Reserva cancelada correctamente");
    } catch (err) {
      setError(err.message || "No se pudo cancelar la reserva");
    } finally {
      setActionKey("");
    }
  };

  const abrirReprogramacion = (reserva) => {
    setEditandoReservaId(reserva.id);
    setNuevoHorario({
      fecha: reserva.fecha || "",
      hora: reserva.hora || ""
    });
    setMensaje("");
    setError("");
  };

  const guardarReprogramacion = async (reservaId) => {
    if (!nuevoHorario.fecha || !nuevoHorario.hora) {
      setError("Debes seleccionar nueva fecha y hora");
      return;
    }

    setActionKey(`reprogramar_${reservaId}`);
    setError("");
    setMensaje("");

    try {
      const response = await fetch(`${API_URL}/api/reservas/${reservaId}/reprogramar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(nuevoHorario)
      });

      const data = await safeReadJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo reprogramar la reserva");
      }

      setReservas((prev) =>
        prev.map((r) =>
          r.id === reservaId
            ? {
                ...r,
                fecha: data?.fecha || nuevoHorario.fecha,
                hora: data?.hora || nuevoHorario.hora,
                estado: data?.estado || r.estado
              }
            : r
        )
      );
      setEditandoReservaId(null);
      setMensaje("Reserva reprogramada correctamente");
    } catch (err) {
      setError(err.message || "No se pudo reprogramar la reserva");
    } finally {
      setActionKey("");
    }
  };

  return (
    <main className="panel-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Mi panel</span>
          <h1>Bienvenido/a a tu espacio en PsicoConecta</h1>
          <p>Aqui puedes revisar tus reservas y su estado actual.</p>
          {loading && <p>Cargando reservas...</p>}
          {!loading && error && <p className="admin-error">{error}</p>}
          {!loading && mensaje && <p>{mensaje}</p>}
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Mi cuenta</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Mi perfil</h3>
          <p>Revisa tus datos y editalos cuando lo necesites.</p>
        </div>

        {perfilLoading ? (
          <p>Cargando perfil...</p>
        ) : !editandoPerfil ? (
          <div className="card profile-summary-card">
            <div className="profile-summary-grid">
              <p><strong>Nombre:</strong> {perfil.nombre || "No definido"}</p>
              <p><strong>Apellido:</strong> {perfil.apellido || "No definido"}</p>
              <p><strong>Edad:</strong> {perfil.edad || "No definida"}</p>
              <p><strong>Sexo:</strong> {perfil.sexo || "No definido"}</p>
              <p><strong>Telefono:</strong> {perfil.telefono || "No definido"}</p>
              <p><strong>Correo:</strong> {perfil.email || "No definido"}</p>
            </div>
            <button type="button" className="mini-btn profile-edit-btn" onClick={() => setEditandoPerfil(true)}>
              <span aria-hidden="true">✎</span> Editar perfil
            </button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={guardarPerfil}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" value={perfil.nombre} onChange={handlePerfilChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" value={perfil.apellido} onChange={handlePerfilChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="edad">Edad</label>
              <input id="edad" type="number" min="0" max="120" value={perfil.edad} onChange={handlePerfilChange} />
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select id="sexo" value={perfil.sexo} onChange={handlePerfilChange}>
                <option value="">Selecciona</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="No binario">No binario</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Telefono</label>
              <input id="telefono" value={perfil.telefono} onChange={handlePerfilChange} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input id="email" type="email" value={perfil.email} onChange={handlePerfilChange} required />
            </div>

            <button type="submit" className="btn-primary auth-button" disabled={perfilSaving}>
              {perfilSaving ? "Guardando..." : "Guardar perfil"}
            </button>
            <button
              type="button"
              className="btn-secondary auth-button"
              onClick={() => {
                setEditandoPerfil(false);
                loadPerfil();
              }}
            >
              Cancelar edicion
            </button>
          </form>
        )}
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Resumen de tu cuenta</h3>
        </div>

        <div className="cards-grid three-cols">
          <article className="card">
            <h4>Proxima sesion</h4>
            {proximaReserva ? (
              <>
                <p>{formatFecha(proximaReserva.fecha)}</p>
                <p>{proximaReserva.hora} hrs</p>
              </>
            ) : (
              <p>Sin sesiones agendadas</p>
            )}
          </article>

          <article className="card">
            <h4>Modalidad</h4>
            <p>{proximaReserva?.modalidad || "Sin datos"}</p>
          </article>

          <article className="card">
            <h4>Estado</h4>
            <p>{proximaReserva?.estado || "Sin reservas"}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Mis reservas</h3>
          <p>Aqui se muestran tus sesiones registradas.</p>
        </div>

        {!loading && reservas.length === 0 ? (
          <div className="card">
            <p>No tienes reservas por ahora. Cuando agendes una, aparecera aqui.</p>
          </div>
        ) : (
          <div className="panel-list">
            {reservas.map((reserva) => {
              const estado = (reserva.estado || "").toLowerCase();
              const editable = ["pendiente", "confirmada"].includes(estado);

              return (
                <div className="panel-item" key={reserva.id}>
                  <div>
                    <strong>{formatFecha(reserva.fecha)}</strong>
                    <p>
                      {reserva.hora} hrs · {reserva.modalidad || "Sin modalidad"} · {reserva.tipoSesion || "Sesion"}
                    </p>

                    {editandoReservaId === reserva.id && (
                      <div className="panel-edit-box">
                        <input
                          type="date"
                          value={nuevoHorario.fecha}
                          onChange={(e) => setNuevoHorario((prev) => ({ ...prev, fecha: e.target.value }))}
                        />
                        <select
                          value={nuevoHorario.hora}
                          onChange={(e) => setNuevoHorario((prev) => ({ ...prev, hora: e.target.value }))}
                        >
                          <option value="">Selecciona hora</option>
                          {HORAS_REPROGRAMACION.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="mini-btn"
                          disabled={actionKey === `reprogramar_${reserva.id}`}
                          onClick={() => guardarReprogramacion(reserva.id)}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => setEditandoReservaId(null)}
                        >
                          Cancelar edicion
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="panel-item-actions">
                    <span className={`status-badge ${getEstadoClass(estado)}`}>{reserva.estado}</span>
                    {editable && editandoReservaId !== reserva.id && (
                      <>
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => abrirReprogramacion(reserva)}
                        >
                          Modificar fecha
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          disabled={actionKey === `cancelar_${reserva.id}`}
                          onClick={() => cancelarReserva(reserva.id)}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default PanelPaciente;
