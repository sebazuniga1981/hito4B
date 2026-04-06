import { Link } from "react-router-dom";

function Registro() {
  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <div className="auth-card">
          <span className="page-badge">Registro</span>
          <h1>Crea tu cuenta en PsicoConecta</h1>
          <p className="auth-subtext">
            Regístrate para poder reservar horas y acceder a tu información.
          </p>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                placeholder="Ingresa tu apellido"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Crea una contraseña"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repite tu contraseña"
              />
            </div>

            <button type="submit" className="btn-primary auth-button">
              Registrarse
            </button>
          </form>

          <div className="auth-links">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Registro;