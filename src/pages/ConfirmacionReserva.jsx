function ConfirmacionReserva() {
  return (
    <main className="confirmacion-page">
      <section className="section">
        <div className="confirmacion-card">
          <div className="confirmacion-icon">✓</div>

          <span className="page-badge">Reserva confirmada</span>
          <h1>Tu hora fue agendada con éxito</h1>
          <p className="confirmacion-texto">
            Tu sesión ha quedado registrada correctamente. A continuación puedes
            revisar el resumen de tu reserva.
          </p>

          <div className="confirmacion-resumen">
            <div className="resumen-item">
              <span>Fecha</span>
              <strong>15 de abril de 2026</strong>
            </div>

            <div className="resumen-item">
              <span>Hora</span>
              <strong>16:00 hrs</strong>
            </div>

            <div className="resumen-item">
              <span>Modalidad</span>
              <strong>Online</strong>
            </div>

            <div className="resumen-item">
              <span>Tipo de sesión</span>
              <strong>Terapia individual</strong>
            </div>
          </div>

          <div className="confirmacion-botones">
            <a href="/#/panel-paciente" className="btn-primary">
              Ir a mi panel
            </a>

            <a href="/#/reservar" className="btn-secondary">
              Reservar otra hora
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ConfirmacionReserva;