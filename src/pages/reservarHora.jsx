function ReservarHora() {
  return (
    <main className="reservar-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Reservar hora</span>
          <h1>Agenda tu sesión</h1>
          <p>
            Selecciona la fecha, horario y modalidad que prefieras para reservar tu atención.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Reserva</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Formulario de reserva</h3>
          <p>
            Esta es una versión visual inicial. Más adelante la conectaremos con horarios reales.
          </p>
        </div>

        <div className="booking-card">
          <form className="booking-form">
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input type="date" id="fecha" />
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <select id="hora">
                <option value="">Selecciona una hora</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modalidad">Modalidad</label>
              <select id="modalidad">
                <option value="">Selecciona una modalidad</option>
                <option>Presencial</option>
                <option>Online</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tipoSesion">Tipo de sesión</label>
              <select id="tipoSesion">
                <option value="">Selecciona un tipo de sesión</option>
                <option>Terapia individual</option>
                <option>Ansiedad</option>
                <option>Estrés</option>
                <option>Autoestima</option>
                <option>Duelo</option>
              </select>
            </div>

            <button type="submit" className="btn-primary auth-button">
              Confirmar reserva
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Información importante</h3>
          <p>
            Una vez conectemos esta vista con el backend, aquí se mostrarán horarios disponibles
            reales y la confirmación de la cita.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ReservarHora;