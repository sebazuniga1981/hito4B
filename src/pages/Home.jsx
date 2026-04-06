import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-badge">Bienestar emocional · Atención psicológica</span>
          <h1>PsicoConecta</h1>
          <h2>
            Acompañamiento psicológico en un espacio seguro, cercano y profesional.
          </h2>
          <p>
            Te acompaño en tu proceso emocional a través de una atención psicológica
            enfocada en el bienestar, la escucha y el crecimiento personal.
          </p>

          <div className="hero-buttons">
            <Link to="/reservar" className="btn-primary">
              Reservar hora
            </Link>
            <Link to="/sobre-mi" className="btn-secondary">
              Conoce más
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="photo-placeholder">Foto profesional</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro">
          <h3>Un espacio de confianza para tu bienestar emocional</h3>
          <p>
            La terapia puede ser un lugar de escucha, contención y crecimiento
            personal, donde puedas comprender lo que estás viviendo y avanzar con
            mayor claridad.
          </p>
        </div>

        <div className="about-preview">
          <p>
            Soy psicóloga y ofrezco un espacio terapéutico de confianza, respeto y
            contención, orientado a acompañar a cada persona en su proceso personal.
            Mi enfoque busca promover el bienestar emocional, fortalecer herramientas
            personales y brindar una atención cercana y profesional.
          </p>

          <Link to="/sobre-mi" className="text-link">
            Ver más
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Áreas de atención</h3>
          <p>
            Cada proceso es único. Estas son algunas de las áreas en las que puedo
            acompañarte.
          </p>
        </div>

        <div className="cards-grid">
          <article className="card">
            <h4>Ansiedad</h4>
            <p>
              Acompañamiento para comprender y manejar síntomas de ansiedad en la vida
              cotidiana.
            </p>
          </article>

          <article className="card">
            <h4>Estrés</h4>
            <p>
              Espacio para trabajar el agotamiento emocional y recuperar equilibrio en
              tu día a día.
            </p>
          </article>

          <article className="card">
            <h4>Autoestima</h4>
            <p>
              Fortalecimiento de la confianza personal y de la relación contigo
              mismo/a.
            </p>
          </article>

          <article className="card">
            <h4>Relaciones interpersonales</h4>
            <p>
              Orientación para abordar vínculos, comunicación y dificultades en las
              relaciones.
            </p>
          </article>

          <article className="card">
            <h4>Duelo</h4>
            <p>
              Acompañamiento emocional en procesos de pérdida y adaptación a nuevos
              escenarios.
            </p>
          </article>

          <article className="card">
            <h4>Terapia individual</h4>
            <p>
              Un espacio personal para explorar emociones, pensamientos y herramientas
              de bienestar.
            </p>
          </article>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Modalidades de atención</h3>
          <p>
            La atención se adapta a tus necesidades, tiempos y forma de
            acompañamiento.
          </p>
        </div>

        <div className="two-columns">
          <article className="card">
            <h4>Atención presencial</h4>
            <p>
              Sesiones en consulta, en un espacio privado, cómodo y pensado para tu
              proceso terapéutico.
            </p>
          </article>

          <article className="card">
            <h4>Atención online</h4>
            <p>
              Sesiones por videollamada, con la misma cercanía, confidencialidad y
              acompañamiento profesional.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Dónde atiendo</h3>
          <p>
            Atención presencial en <strong>[aquí va la dirección exacta]</strong>.
            También puedes reservar sesiones en modalidad online.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="cta-box">
          <h3>Dar el primer paso también es parte del proceso</h3>
          <p>
            Si estás buscando un espacio de escucha, orientación y acompañamiento
            profesional, puedes agendar tu hora de forma simple.
          </p>

          <Link to="/reservar" className="btn-primary">
            Reservar hora
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;