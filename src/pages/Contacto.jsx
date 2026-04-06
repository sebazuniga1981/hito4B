function Contacto() {
  return (
    <main className="contacto-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Contacto</span>
          <h1>Estoy aquí para acompañarte</h1>
          <p>
            Si quieres resolver dudas o agendar una sesión, puedes revisar la
            información de contacto y la dirección de atención.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Contacto</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Información de contacto</h3>
          <p>
            Puedes comunicarte por los siguientes medios o reservar tu hora
            directamente desde la web.
          </p>
        </div>

        <div className="cards-grid">
          <article className="card">
            <h4>Correo electrónico</h4>
            <p>contacto@psicoconecta.cl</p>
          </article>

          <article className="card">
            <h4>Teléfono / WhatsApp</h4>
            <p>+56 9 1234 5678</p>
          </article>

          <article className="card">
            <h4>Horario de atención</h4>
            <p>Lunes a viernes</p>
            <p>09:00 a 18:00 hrs</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Dónde atiendo</h3>
        </div>

        <div className="card">
          <p>
            Atención presencial en:
            <strong> [aquí va la dirección exacta]</strong>
          </p>
          <p>
            También puedes reservar sesiones en modalidad online, según tu
            preferencia.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Reserva tu hora</h3>
          <p>
            Si ya estás listo/a para comenzar, puedes agendar tu sesión desde la
            sección de reservas.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Contacto;