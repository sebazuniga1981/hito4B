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

function slotKey(dateKey, hour) {
  return `${dateKey}_${hour}`;
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

function normalizeBloqueos(payload) {
  if (Array.isArray(payload?.bloqueos)) return payload.bloqueos;
  if (Array.isArray(payload?.blocks)) return payload.blocks;
  return [];
}

function PanelPsicologa() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [reservas, setReservas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        const response = await fetch(`${API_URL}/api/admin/reservas?${query}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          throw new Error(data?.error || "No se pudo cargar el calendario");
        }

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
        if (isMounted) {
          setLoadingWeek(false);
        }
      }
    };

    fetchWeek();

    return () => {
      isMounted = false;
    };
  }, [token, weekRange.end, weekRange.start, weekStart]);

  const sendAdminAction = async (path, method, body) => {
    if (!API_URL) return;

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      throw new Error(data?.error || "No se pudo ejecutar la accion");
    }
  };

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

  return (
    <main className="panel-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Panel psicologa</span>
          <h1>Gestion de reservas</h1>
          <p>
            Acepta, mueve y bloquea horarios en calendario semanal. Jornada habilitada de lunes a
            sabado entre 08:00 y 22:00.
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
                            <strong>{reserva.paciente || "Paciente"}</strong>
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
    </main>
  );
}

export default PanelPsicologa;
