function Modalidades() {
  return (
    <main className="modalidades-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Modalidades</span>
          <h1>Atención presencial y online</h1>
          <p>
            La terapia puede adaptarse a tus necesidades, tiempos y preferencias,
            manteniendo siempre un espacio de acompañamiento cercano, respetuoso y profesional.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Atención psicológica</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Formas de atención</h3>
          <p>
            Puedes elegir la modalidad que mejor se acomode a tu rutina y a la forma
            en que prefieres vivir tu proceso terapéutico.
          </p>
        </div>

        <div className="two-columns">
          <article className="card">
            <h4>Atención presencial</h4>
            <p>
              Las sesiones presenciales se realizan en consulta, en un espacio cómodo,
              privado y preparado para brindarte un entorno de confianza y contención.
            </p>
            <p>
              Esta modalidad es ideal si prefieres un encuentro cara a cara y valoras
              el espacio físico como parte del proceso terapéutico.
            </p>
          </article>

          <article className="card">
            <h4>Atención online</h4>
            <p>
              Las sesiones online se realizan por videollamada, permitiéndote acceder
              a atención psicológica desde cualquier lugar, con la misma cercanía,
              confidencialidad y acompañamiento profesional.
            </p>
            <p>
              Es una buena alternativa si necesitas mayor flexibilidad de horario o si
              prefieres realizar el proceso desde tu hogar.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>¿Cómo elegir la modalidad?</h3>
        </div>

        <div className="card">
          <p>
            No existe una única forma correcta. La mejor modalidad será aquella que se
            ajuste mejor a tus tiempos, necesidades y comodidad. Lo importante es que
            puedas contar con un espacio terapéutico constante, seguro y adecuado para ti.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Reserva tu hora según tu preferencia</h3>
          <p>
            Al momento de agendar, podrás elegir si prefieres una sesión presencial u online.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Modalidades;