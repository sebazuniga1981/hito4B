function Especializaciones() {
  return (
    <main className="especializaciones-page">
      <section className="page-hero">
        <div className="page-hero-text">
          <span className="page-badge">Especializaciones</span>
          <h1>Áreas en las que puedo acompañarte</h1>
          <p>
            Cada proceso es único. Estas son algunas de las áreas de atención en
            las que puedo ofrecer acompañamiento psicológico.
          </p>
        </div>

        <div className="page-hero-image">
          <div className="photo-placeholder small">Espacio visual</div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>Áreas de atención</h3>
          <p>
            El acompañamiento terapéutico se adapta a las necesidades, vivencias y
            objetivos de cada persona.
          </p>
        </div>

        <div className="cards-grid">
          <article className="card">
            <h4>Ansiedad</h4>
            <p>
              Apoyo para comprender pensamientos, emociones y síntomas asociados a
              la ansiedad, desarrollando herramientas para afrontarla.
            </p>
          </article>

          <article className="card">
            <h4>Estrés</h4>
            <p>
              Espacio terapéutico para trabajar el agotamiento emocional, la
              sobrecarga y la búsqueda de mayor equilibrio cotidiano.
            </p>
          </article>

          <article className="card">
            <h4>Autoestima</h4>
            <p>
              Acompañamiento orientado a fortalecer la confianza personal, la
              autoimagen y el vínculo contigo mismo/a.
            </p>
          </article>

          <article className="card">
            <h4>Relaciones interpersonales</h4>
            <p>
              Trabajo terapéutico en torno a vínculos, comunicación, límites y
              dificultades en las relaciones personales.
            </p>
          </article>

          <article className="card">
            <h4>Duelo</h4>
            <p>
              Contención y acompañamiento en procesos de pérdida, cambios vitales y
              adaptación emocional.
            </p>
          </article>

          <article className="card">
            <h4>Terapia individual</h4>
            <p>
              Un espacio personal para explorar emociones, experiencias y recursos,
              promoviendo bienestar y crecimiento personal.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-intro">
          <h3>Un proceso personalizado</h3>
        </div>

        <div className="card">
          <p>
            Cada persona vive su proceso de manera distinta. Por eso, la atención
            se orienta a comprender tu situación particular, tus necesidades y tus
            objetivos terapéuticos, construyendo un espacio de trabajo respetuoso,
            cercano y profesional.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-intro center">
          <h3>¿No sabes por dónde empezar?</h3>
          <p>
            Si no tienes claridad sobre qué área se relaciona más con lo que estás
            viviendo, la terapia también puede ser un espacio para descubrirlo y
            trabajarlo en conjunto.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Especializaciones;