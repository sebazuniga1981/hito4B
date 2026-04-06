function SobreMi() {
  return (
    <main className="sobre-mi-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Sobre mí</span>
          <h1>Un espacio terapéutico cercano, seguro y profesional</h1>
          <p>
            Mi objetivo es acompañarte en tu proceso emocional desde la escucha,
            la confianza y el respeto por tu historia personal.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Foto profesional</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Presentación</h3>
        </div>

        <div className="about-layout">
          <div className="about-text-block">
            <p>
              Soy psicóloga y ofrezco un espacio de atención terapéutica centrado
              en la confianza, la escucha y el respeto por el proceso de cada
              persona. Mi objetivo es acompañar de manera cercana y profesional,
              promoviendo el bienestar emocional y el desarrollo de herramientas
              personales.
            </p>

            <p>
              Entiendo la terapia como un espacio de apoyo y reflexión, donde cada
              persona puede explorar lo que está viviendo, comprender sus emociones
              y fortalecer recursos para enfrentar distintas situaciones de la vida.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Mi enfoque terapéutico</h3>
        </div>

        <div className="card">
          <p>
            Creo en la importancia de brindar un espacio seguro, cálido y
            confidencial, donde cada persona pueda expresarse con libertad y
            sentirse acompañada en su proceso. La terapia es una oportunidad para
            comprender lo que estamos viviendo, fortalecer recursos personales y
            avanzar hacia un mayor bienestar emocional.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>A quién está dirigida la atención</h3>
        </div>

        <div className="card">
          <p>
            La atención está orientada a personas que buscan apoyo psicológico para
            enfrentar momentos de ansiedad, estrés, dificultades emocionales,
            procesos personales, relaciones interpersonales o situaciones de cambio
            que impactan su bienestar.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Pilares de mi trabajo</h3>
        </div>

        <div className="cards-grid four-cols">
          <article className="card">
            <h4>Confianza</h4>
            <p>
              Un espacio terapéutico basado en el respeto y la confidencialidad.
            </p>
          </article>

          <article className="card">
            <h4>Escucha activa</h4>
            <p>
              Acompañamiento centrado en comprender cada experiencia de forma genuina.
            </p>
          </article>

          <article className="card">
            <h4>Cercanía</h4>
            <p>
              Una atención humana, cálida y profesional.
            </p>
          </article>

          <article className="card">
            <h4>Bienestar emocional</h4>
            <p>
              Orientación al crecimiento personal y al fortalecimiento interno.
            </p>
          </article>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Modalidad de atención</h3>
        </div>

        <div className="card">
          <p>
            Las sesiones pueden realizarse de forma presencial u online, según las
            necesidades y preferencias de cada persona.
          </p>
        </div>
      </section>
    </main>
  );
}

export default SobreMi;