function PanelPaciente() {
  return (
    <main className="panel-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Mi panel</span>
          <h1>Bienvenido/a a tu espacio en PsicoConecta</h1>
          <p>
            Aquí podrás revisar tus próximas reservas y el estado de tus sesiones
            agendadas.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Mi cuenta</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Resumen de tu cuenta</h3>
        </div>

        <div className="cards-grid three-cols">
          <article className="card">
            <h4>Próxima sesión</h4>
            <p>15 de abril de 2026</p>
            <p>16:00 hrs</p>
          </article>

          <article className="card">
            <h4>Modalidad</h4>
            <p>Online</p>
          </article>

          <article className="card">
            <h4>Estado</h4>
            <p>Confirmada</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Mis reservas</h3>
          <p>
            Aquí se mostrarán las sesiones agendadas por el paciente.
          </p>
        </div>

        <div className="panel-list">
          <div className="panel-item">
            <div>
              <strong>15 de abril de 2026</strong>
              <p>16:00 hrs · Online · Terapia individual</p>
            </div>
            <span className="status-badge status-confirmada">Confirmada</span>
          </div>

          <div className="panel-item">
            <div>
              <strong>22 de abril de 2026</strong>
              <p>10:00 hrs · Presencial · Ansiedad</p>
            </div>
            <span className="status-badge status-pendiente">Pendiente</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PanelPaciente;