import { useEffect, useMemo, useState } from "react";
import API_URL from "../api";

const HOURS = Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
const DAY_LABELS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWeekStart(baseDate) {
  const d = new Date(baseDate);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(d, diffToMonday);
}

function formatShortDate(dateKey) {
  const d = fromDateKey(dateKey);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthTitle(date) {
  return date.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric"
  });
}

function slotKey(dateKey, hour) {
  return `${dateKey}_${hour}`;
}

function formatPrecio(precio) {
  const n = Number(precio);
  if (Number.isNaN(n) || n <= 0) return "Consultar";
  return `$${n.toLocaleString("es-CL")} CLP`;
}

function buildMockData(weekStart) {
  const monday = toDateKey(weekStart);
  const tuesday = toDateKey(addDays(weekStart, 1));
  const thursday = toDateKey(addDays(weekStart, 3));
  const friday = toDateKey(addDays(weekStart, 4));

  return {
    reservas: [
      {
        id: 1,
        paciente: "Maria Gonzalez",
        fecha: monday,
        hora: "10:00",
        modalidad: "Online",
        tipoSesion: "Terapia individual",
        estado: "pendiente"
      },
      {
        id: 2,
        paciente: "Camila Rojas",
        fecha: tuesday,
        hora: "16:00",
        modalidad: "Presencial",
        tipoSesion: "Ansiedad",
        estado: "confirmada"
      },
      {
        id: 3,
        paciente: "Javiera Soto",
        fecha: friday,
        hora: "12:00",
        modalidad: "Online",
        tipoSesion: "Autoestima",
        estado: "pendiente"
      }
    ],
    bloqueos: [
      {
        id: "b-1",
        fecha: thursday,
        hora: "18:00",
        motivo: "Bloqueo manual"
      }
    ]
  };
}

function normalizeReservas(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.reservas)) return payload.reservas;
  return [];
}

function getPacienteNombre(reserva) {
  if (reserva?.nombre) return reserva.nombre;
  if (reserva?.paciente && !String(reserva.paciente).includes("@")) return reserva.paciente;
  return "Falta nombre";
}

function getPacienteCorreo(reserva) {
  if (reserva?.email) return reserva.email;
  if (reserva?.paciente && String(reserva.paciente).includes("@")) return reserva.paciente;
  return "Falta correo";
}

function normalizeBloqueos(payload) {
  if (Array.isArray(payload?.bloqueos)) return payload.bloqueos;
  if (Array.isArray(payload?.blocks)) return payload.blocks;
  return [];
}

function normalizePlanes(payload) {
  if (!Array.isArray(payload)) return [];

  return payload.map((plan) => ({
    id: plan.id,
    titulo: plan.titulo || "",
    descripcion: plan.descripcion || "",
    precio: String(plan.precio ?? "0"),
    modalidad: plan.modalidad || "Presencial",
    duracion: plan.duracion || "",
    estado: plan.estado || "activo"
  }));
}

function PanelPsicologa() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [reservas, setReservas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [planes, setPlanes] = useState([]);
  const [planesLoading, setPlanesLoading] = useState(false);
  const [planesError, setPlanesError] = useState("");
  const [planesMessage, setPlanesMessage] = useState("");
  const [planesActionKey, setPlanesActionKey] = useState("");
  const [editandoPlanId, setEditandoPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    modalidad: "Presencial",
    duracion: "",
    estado: "activo"
  });

  const token = localStorage.getItem("token");

  const weekDays = useMemo(() => {
    return DAY_LABELS.map((label, i) => {
      const date = addDays(weekStart, i);
      return {
        label,
        date,
        dateKey: toDateKey(date)
      };
    });
  }, [weekStart]);

  const weekRange = useMemo(() => {
    const start = weekDays[0]?.dateKey;
    const end = weekDays[weekDays.length - 1]?.dateKey;
    return { start, end };
  }, [weekDays]);

  const monthTitle = useMemo(() => formatMonthTitle(weekStart), [weekStart]);

  const reservasBySlot = useMemo(() => {
    const map = new Map();
    for (const reserva of reservas) {
      map.set(slotKey(reserva.fecha, reserva.hora), reserva);
    }
    return map;
  }, [reservas]);

  const bloqueosBySlot = useMemo(() => {
    const map = new Map();
    for (const bloqueo of bloqueos) {
      map.set(slotKey(bloqueo.fecha, bloqueo.hora), bloqueo);
    }
    return map;
  }, [bloqueos]);

  const resumen = useMemo(() => {
    return {
      confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
      pendientes: reservas.filter((r) => r.estado === "pendiente").length,
      online: reservas.filter((r) => (r.modalidad || "").toLowerCase() === "online").length
    };
  }, [reservas]);

  const sendAdminAction = async (path, method, body) => {
    if (!API_URL) {
      throw new Error("Falta VITE_API_URL para sincronizar con backend");
    }

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || "No se pudo ejecutar la accion");
    }

    return data;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchWeek = async () => {
      setLoadingWeek(true);
      setError("");

      const mock = buildMockData(weekStart);

      if (!API_URL) {
        if (!isMounted) return;
        setReservas(mock.reservas);
        setBloqueos(mock.bloqueos);
        setMessage("Panel en modo demo: falta VITE_API_URL para sincronizar con backend.");
        setLoadingWeek(false);
        return;
      }

      try {
        const query = `weekStart=${weekRange.start}&weekEnd=${weekRange.end}`;
        const data = await sendAdminAction(`/api/admin/reservas?${query}`, "GET");

        if (!isMounted) return;
        setReservas(normalizeReservas(data));
        setBloqueos(normalizeBloqueos(data));
        setMessage("Sincronizado con backend");
      } catch (err) {
        if (!isMounted) return;
        setReservas(mock.reservas);
        setBloqueos(mock.bloqueos);
        setMessage("No se encontro endpoint admin. Mostrando demo local.");
        setError(err.message || "Error de carga");
      } finally {
        if (isMounted) setLoadingWeek(false);
      }
    };

    fetchWeek();

    return () => {
      isMounted = false;
    };
  }, [token, weekRange.end, weekRange.start, weekStart]);

  useEffect(() => {
    let mounted = true;

    const loadPlanes = async () => {
      setPlanesLoading(true);
      setPlanesError("");

      try {
        if (!API_URL) throw new Error("Falta VITE_API_URL");

        const response = await fetch(`${API_URL}/api/servicios`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "No se pudieron cargar planes");
        }

        if (!mounted) return;
        setPlanes(normalizePlanes(data));
      } catch (err) {
        if (!mounted) return;
        setPlanes([]);
        setPlanesError(err.message || "No se pudieron cargar planes");
      } finally {
        if (mounted) setPlanesLoading(false);
      }
    };

    loadPlanes();
    return () => {
      mounted = false;
    };
  }, [token]);

  const cambiarEstadoReserva = async (reservaId, nuevoEstado) => {
    const target = reservas.find((r) => r.id === reservaId);
    if (!target) return;

    const loadKey = `estado_${reservaId}`;
    setActionLoadingKey(loadKey);
    setError("");

    try {
      await sendAdminAction(`/api/admin/reservas/${reservaId}/estado`, "PATCH", {
        estado: nuevoEstado
      });
      setReservas((prev) => prev.map((r) => (r.id === reservaId ? { ...r, estado: nuevoEstado } : r)));
      setMessage(`Reserva ${reservaId} actualizada a ${nuevoEstado}`);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el estado");
    } finally {
      setActionLoadingKey("");
    }
  };

  const moverReserva = async (reservaId) => {
    const current = reservas.find((r) => r.id === reservaId);
    if (!current) return;

    let destino = null;
    for (const day of weekDays) {
      for (const hour of HOURS) {
        const key = slotKey(day.dateKey, hour);
        const ocupado = reservasBySlot.has(key) || bloqueosBySlot.has(key);
        const isCurrent = current.fecha === day.dateKey && current.hora === hour;
        if (!ocupado && !isCurrent) {
          destino = { fecha: day.dateKey, hora: hour };
          break;
        }
      }
      if (destino) break;
    }

    if (!destino) {
      setError("No hay cupos disponibles para mover la reserva en esta semana");
      return;
    }

    const loadKey = `mover_${reservaId}`;
    setActionLoadingKey(loadKey);
    setError("");

    try {
      await sendAdminAction(`/api/admin/reservas/${reservaId}/mover`, "PATCH", destino);
      setReservas((prev) =>
        prev.map((r) => (r.id === reservaId ? { ...r, fecha: destino.fecha, hora: destino.hora } : r))
      );
      setMessage(`Reserva ${reservaId} movida a ${destino.fecha} ${destino.hora}`);
    } catch (err) {
      setError(err.message || "No se pudo mover la reserva");
    } finally {
      setActionLoadingKey("");
    }
  };

  const toggleBloqueo = async (dateKey, hour) => {
    const key = slotKey(dateKey, hour);
    const bloqueo = bloqueosBySlot.get(key);

    if (!bloqueo && reservasBySlot.has(key)) {
      setError("No se puede bloquear un horario que ya tiene reserva");
      return;
    }

    const loadKey = `bloqueo_${key}`;
    setActionLoadingKey(loadKey);
    setError("");

    try {
      if (bloqueo) {
        await sendAdminAction(`/api/admin/bloqueos/${bloqueo.id}`, "DELETE");
        setBloqueos((prev) => prev.filter((b) => b.id !== bloqueo.id));
        setMessage(`Horario ${dateKey} ${hour} desbloqueado`);
      } else {
        await sendAdminAction(`/api/admin/bloqueos`, "POST", {
          fecha: dateKey,
          hora: hour,
          motivo: "Bloqueo manual"
        });
        setBloqueos((prev) => [
          ...prev,
          {
            id: `tmp-${dateKey}-${hour}`,
            fecha: dateKey,
            hora: hour,
            motivo: "Bloqueo manual"
          }
        ]);
        setMessage(`Horario ${dateKey} ${hour} bloqueado`);
      }
    } catch (err) {
      setError(err.message || "No se pudo actualizar bloqueo");
    } finally {
      setActionLoadingKey("");
    }
  };

  const handlePlanFormChange = (e) => {
    setPlanForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const resetPlanForm = () => {
    setEditandoPlanId(null);
    setPlanForm({
      titulo: "",
      descripcion: "",
      precio: "",
      modalidad: "Presencial",
      duracion: "",
      estado: "activo"
    });
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setPlanesError("");
    setPlanesMessage("");

    const payload = {
      titulo: planForm.titulo,
      descripcion: planForm.descripcion,
      precio: Number(planForm.precio || 0),
      modalidad: planForm.modalidad,
      duracion: planForm.duracion,
      estado: planForm.estado
    };

    if (!payload.titulo || !payload.descripcion || !payload.modalidad) {
      setPlanesError("Completa los campos obligatorios para guardar el plan");
      return;
    }

    const actionKey = editandoPlanId ? `plan_edit_${editandoPlanId}` : "plan_create";
    setPlanesActionKey(actionKey);

    try {
      if (editandoPlanId) {
        const updated = await sendAdminAction(`/api/servicios/${editandoPlanId}`, "PUT", payload);
        setPlanes((prev) => prev.map((p) => (p.id === editandoPlanId ? { ...p, ...updated } : p)));
        setPlanesMessage("Plan actualizado correctamente");
      } else {
        const created = await sendAdminAction("/api/servicios", "POST", payload);
        setPlanes((prev) => [{ ...created, precio: String(created.precio ?? payload.precio) }, ...prev]);
        setPlanesMessage("Plan creado correctamente");
      }

      resetPlanForm();
    } catch (err) {
      setPlanesError(err.message || "No se pudo guardar el plan");
    } finally {
      setPlanesActionKey("");
    }
  };

  const handleEditarPlan = (plan) => {
    setEditandoPlanId(plan.id);
    setPlanForm({
      titulo: plan.titulo || "",
      descripcion: plan.descripcion || "",
      precio: String(plan.precio ?? ""),
      modalidad: plan.modalidad || "Presencial",
      duracion: plan.duracion || "",
      estado: plan.estado || "activo"
    });
    setPlanesMessage("");
    setPlanesError("");
  };

  const handleEliminarPlan = async (planId) => {
    const confirmar = window.confirm("Se eliminara este plan. Deseas continuar?");
    if (!confirmar) return;

    setPlanesActionKey(`plan_delete_${planId}`);
    setPlanesError("");
    setPlanesMessage("");

    try {
      await sendAdminAction(`/api/servicios/${planId}`, "DELETE");
      setPlanes((prev) => prev.filter((p) => p.id !== planId));
      if (editandoPlanId === planId) resetPlanForm();
      setPlanesMessage("Plan eliminado correctamente");
    } catch (err) {
      setPlanesError(err.message || "No se pudo eliminar el plan");
    } finally {
      setPlanesActionKey("");
    }
  };

  const handleToggleEstadoPlan = async (plan) => {
    const nuevoEstado = plan.estado === "inactivo" ? "activo" : "inactivo";
    setPlanesActionKey(`plan_estado_${plan.id}`);
    setPlanesError("");
    setPlanesMessage("");

    try {
      const updated = await sendAdminAction(`/api/servicios/${plan.id}`, "PUT", {
        ...plan,
        estado: nuevoEstado
      });
      setPlanes((prev) => prev.map((p) => (p.id === plan.id ? { ...p, ...updated, estado: nuevoEstado } : p)));
      setPlanesMessage(`Plan ${plan.id} actualizado a ${nuevoEstado}`);
    } catch (err) {
      setPlanesError(err.message || "No se pudo cambiar estado del plan");
    } finally {
      setPlanesActionKey("");
    }
  };

  return (
    <main className="panel-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Panel psicologa</span>
          <h1>Gestion de reservas y planes</h1>
          <p>
            Acepta, mueve y bloquea horarios en calendario semanal. Tambien puedes crear,
            editar y eliminar planes desde este panel.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Panel profesional</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Resumen general</h3>
          <p>{loadingWeek ? "Cargando semana..." : message}</p>
          {error && <p className="admin-error">{error}</p>}
        </div>

        <div className="cards-grid three-cols">
          <article className="card">
            <h4>Citas confirmadas</h4>
            <p>{resumen.confirmadas} reservas</p>
          </article>

          <article className="card">
            <h4>Citas pendientes</h4>
            <p>{resumen.pendientes} reservas</p>
          </article>

          <article className="card">
            <h4>Sesiones online</h4>
            <p>{resumen.online} reservas</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Calendario semanal</h3>
          <h2 className="admin-month-title">{monthTitle}</h2>
          <p>
            Semana {weekRange.start} a {weekRange.end}. Cada celda representa 1 hora.
          </p>
        </div>

        <div className="admin-toolbar">
          <button className="btn-secondary" type="button" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            Semana anterior
          </button>
          <button className="btn-secondary" type="button" onClick={() => setWeekStart(getWeekStart(new Date()))}>
            Semana actual
          </button>
          <button className="btn-secondary" type="button" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            Semana siguiente
          </button>
        </div>

        <div className="admin-calendar-wrap">
          <table className="admin-calendar">
            <thead>
              <tr>
                <th>Hora</th>
                {weekDays.map((day) => (
                  <th key={day.dateKey}>
                    <div>{day.label}</div>
                    <small>{formatShortDate(day.dateKey)}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="hour-col">{hour}</td>
                  {weekDays.map((day) => {
                    const key = slotKey(day.dateKey, hour);
                    const reserva = reservasBySlot.get(key);
                    const bloqueo = bloqueosBySlot.get(key);
                    const isLoading = actionLoadingKey === `bloqueo_${key}`;

                    return (
                      <td key={key}>
                        {!reserva && !bloqueo && (
                          <div className="slot slot-available">
                            <span className="status-badge">Disponible</span>
                            <button
                              type="button"
                              className="mini-btn"
                              disabled={isLoading}
                              onClick={() => toggleBloqueo(day.dateKey, hour)}
                            >
                              {isLoading ? "..." : "Bloquear"}
                            </button>
                          </div>
                        )}

                        {bloqueo && (
                          <div className="slot slot-bloqueada">
                            <span className="status-badge status-bloqueada">Bloqueada</span>
                            <button
                              type="button"
                              className="mini-btn"
                              disabled={isLoading}
                              onClick={() => toggleBloqueo(day.dateKey, hour)}
                            >
                              {isLoading ? "..." : "Desbloquear"}
                            </button>
                          </div>
                        )}

                        {reserva && (
                          <div className="slot slot-reserva">
                            <strong>{getPacienteNombre(reserva)}</strong>
                            <p className="slot-email">{getPacienteCorreo(reserva)}</p>
                            <p>{reserva.modalidad || "Modalidad"}</p>
                            <p>{reserva.tipoSesion || "Sesion"}</p>
                            <span
                              className={`status-badge ${
                                reserva.estado === "confirmada"
                                  ? "status-confirmada"
                                  : reserva.estado === "pendiente"
                                  ? "status-pendiente"
                                  : "status-cancelada"
                              }`}
                            >
                              {reserva.estado}
                            </span>
                            <div className="slot-actions">
                              {reserva.estado !== "confirmada" && (
                                <button
                                  type="button"
                                  className="mini-btn"
                                  disabled={actionLoadingKey === `estado_${reserva.id}`}
                                  onClick={() => cambiarEstadoReserva(reserva.id, "confirmada")}
                                >
                                  Aceptar
                                </button>
                              )}
                              {reserva.estado !== "rechazada" && (
                                <button
                                  type="button"
                                  className="mini-btn"
                                  disabled={actionLoadingKey === `estado_${reserva.id}`}
                                  onClick={() => cambiarEstadoReserva(reserva.id, "rechazada")}
                                >
                                  Rechazar
                                </button>
                              )}
                              <button
                                type="button"
                                className="mini-btn"
                                disabled={actionLoadingKey === `mover_${reserva.id}`}
                                onClick={() => moverReserva(reserva.id)}
                              >
                                Mover
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Gestion de planes</h3>
          <p>Crea, edita, activa o elimina planes de atencion desde este panel.</p>
          {planesError && <p className="admin-error">{planesError}</p>}
          {planesMessage && <p>{planesMessage}</p>}
        </div>

        <div className="admin-plans-layout">
          <div className="card admin-plan-form-card">
            <h4>{editandoPlanId ? `Editar plan #${editandoPlanId}` : "Nuevo plan"}</h4>

            <form className="admin-plan-form" onSubmit={handlePlanSubmit}>
              <div className="form-group">
                <label htmlFor="titulo">Titulo</label>
                <input id="titulo" value={planForm.titulo} onChange={handlePlanFormChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripcion</label>
                <input id="descripcion" value={planForm.descripcion} onChange={handlePlanFormChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="precio">Precio</label>
                <input id="precio" type="number" min="0" value={planForm.precio} onChange={handlePlanFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="modalidad">Modalidad</label>
                <select id="modalidad" value={planForm.modalidad} onChange={handlePlanFormChange}>
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duracion">Detalle / duracion</label>
                <input id="duracion" value={planForm.duracion} onChange={handlePlanFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select id="estado" value={planForm.estado} onChange={handlePlanFormChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="admin-plan-actions">
                <button type="submit" className="btn-primary" disabled={planesActionKey === "plan_create" || planesActionKey.startsWith("plan_edit_")}>
                  {editandoPlanId ? "Guardar cambios" : "Crear plan"}
                </button>
                {editandoPlanId && (
                  <button type="button" className="btn-secondary" onClick={resetPlanForm}>
                    Cancelar edicion
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card admin-plan-list-card">
            <h4>Planes registrados</h4>
            {planesLoading ? (
              <p>Cargando planes...</p>
            ) : planes.length === 0 ? (
              <p>No hay planes disponibles.</p>
            ) : (
              <div className="admin-plan-list">
                {planes.map((plan) => (
                  <article key={plan.id} className="admin-plan-item">
                    <div>
                      <strong>{plan.titulo}</strong>
                      <p>
                        {plan.modalidad} · {formatPrecio(plan.precio)} · estado: {plan.estado}
                      </p>
                    </div>
                    <div className="admin-plan-item-actions">
                      <button type="button" className="mini-btn" onClick={() => handleEditarPlan(plan)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="mini-btn"
                        disabled={planesActionKey === `plan_estado_${plan.id}`}
                        onClick={() => handleToggleEstadoPlan(plan)}
                      >
                        {plan.estado === "inactivo" ? "Activar" : "Inactivar"}
                      </button>
                      <button
                        type="button"
                        className="mini-btn"
                        disabled={planesActionKey === `plan_delete_${plan.id}`}
                        onClick={() => handleEliminarPlan(plan.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PanelPsicologa;
