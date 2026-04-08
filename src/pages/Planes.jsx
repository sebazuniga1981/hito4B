import { Link } from "react-router-dom";

const planesPresenciales = [
  {
    titulo: "Plan Individual 4 sesiones",
    detalle: "4 sesiones mensuales individuales",
    descripcion:
      "AtenciÃ³n presencial, ideal para un acompaÃ±amiento constante y cercano.",
    precio: "$45.000 CLP"
  },
  {
    titulo: "Plan Individual 8 sesiones",
    detalle: "8 sesiones mensuales individuales",
    descripcion:
      "Pensado para quienes necesitan un seguimiento mÃ¡s frecuente durante el mes.",
    precio: "$80.000 CLP"
  },
  {
    titulo: "Plan Familiar 4 sesiones",
    detalle: "4 sesiones mensuales familiares",
    descripcion:
      "Espacio de acompaÃ±amiento familiar para fortalecer la comunicaciÃ³n y el bienestar.",
    precio: "$90.000 CLP"
  }
];

const planesOnline = [
  {
    titulo: "Plan Online 4 sesiones",
    detalle: "4 sesiones mensuales individuales",
    descripcion:
      "AtenciÃ³n online con mayor flexibilidad horaria y acompaÃ±amiento profesional.",
    precio: "$30.000 CLP"
  },
  {
    titulo: "Plan Online 8 sesiones",
    detalle: "8 sesiones mensuales individuales",
    descripcion:
      "Seguimiento online continuo para un proceso terapÃ©utico mÃ¡s intensivo.",
    precio: "$50.000 CLP"
  },
  {
    titulo: "Plan Familiar Online",
    detalle: "Sesiones familiares online",
    descripcion:
      "Modalidad familiar a distancia. El valor se define segÃºn evaluaciÃ³n del caso.",
    precio: "Consultar valor"
  }
];

function Planes() {
  return (
    <main className="planes-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Planes y packs</span>
          <h1>Planes de atenciÃ³n psicolÃ³gica</h1>
          <p>
            Revisa las distintas alternativas de atenciÃ³n presencial y online.
            Puedes elegir planes individuales o familiares segÃºn tus necesidades.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Planes de sesiones</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Planes presenciales</h3>
          <p>
            Opciones de atenciÃ³n en consulta, con acompaÃ±amiento individual y familiar.
          </p>
        </div>

        <div className="cards-grid">
          {planesPresenciales.map((plan) => (
            <article className="card plan-card" key={plan.titulo}>
              <span className="plan-tag">Presencial</span>
              <h4>{plan.titulo}</h4>
              <p className="plan-detail">{plan.detalle}</p>
              <p>{plan.descripcion}</p>
              <strong className="plan-price">{plan.precio}</strong>
              <Link to="/contacto" className="btn-primary">
                Consultar plan
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-intro center">
          <h3>Planes online</h3>
          <p>
            Alternativas flexibles para acompaÃ±arte desde cualquier lugar.
          </p>
        </div>

        <div className="cards-grid">
        {planesOnline.map((plan) => (
  <article className="card plan-card" key={plan.titulo}>
    <span className="plan-tag online">Online</span>
    <h4>{plan.titulo}</h4>
    <p className="plan-detail">{plan.detalle}</p>
    <p>{plan.descripcion}</p>
    <strong className="plan-price">{plan.precio}</strong>

    {plan.titulo === "Plan Familiar Online" ? (
      <Link to="/contacto" className="btn-primary">
        Consultar plan
      </Link>
    ) : (
      <Link to="/reservar" className="btn-primary">
        Reservar plan
      </Link>
    )}
  </article>
))}
        </div>
      </section>

      <section className="section">
        <div className="cta-box">
          <h3>Â¿No sabes quÃ© plan elegir?</h3>
          <p>
            Puedes escribirme para evaluar tu caso y encontrar la modalidad mÃ¡s adecuada
            para ti o tu familia.
          </p>

          <Link to="/contacto" className="btn-primary">
            Ir a contacto
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Planes;
