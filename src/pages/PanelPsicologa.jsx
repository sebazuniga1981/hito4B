function PanelPsicologa() {
  return (
    <main className="panel-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Panel psicóloga</span>
          <h1>Gestión de reservas</h1>
          <p>
            Aquí podrás revisar las citas agendadas, su modalidad y el estado de
            cada reserva.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Panel profesional</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Resumen general</h3>
        </div>

        <div className="cards-grid three-cols">
          <article className="card">
            <h4>Citas confirmadas</h4>
            <p>8 reservas</p>
          </article>

          <article className="card">
            <h4>Citas pendientes</h4>
            <p>3 reservas</p>
          </article>

          <article className="card">
            <h4>Sesiones online</h4>
            <p>5 reservas</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Próximas reservas</h3>
          <p>
            Aquí se mostrará el detalle de las citas registradas por los pacientes.
          </p>
        </div>

        <div className="panel-list">
          <div className="panel-item">
            <div>
              <strong>Paciente: María González</strong>
              <p>15 de abril de 2026 · 16:00 hrs · Online · Terapia individual</p>
            </div>
            <span className="status-badge status-confirmada">Confirmada</span>
          </div>

          <div className="panel-item">
            <div>
              <strong>Paciente: Camila Rojas</strong>
              <p>16 de abril de 2026 · 10:00 hrs · Presencial · Ansiedad</p>
            </div>
            <span className="status-badge status-pendiente">Pendiente</span>
          </div>

          <div className="panel-item">
            <div>
              <strong>Paciente: Javiera Soto</strong>
              <p>18 de abril de 2026 · 12:00 hrs · Online · Estrés</p>
            </div>
            <span className="status-badge status-confirmada">Confirmada</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PanelPsicologa;