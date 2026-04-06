import { Link } from "react-router-dom";

function Login() {
  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <div className="auth-card">
          <span className="page-badge">Iniciar sesión</span>
          <h1>Bienvenido/a a PsicoConecta</h1>
          <p className="auth-subtext">
            Ingresa a tu cuenta para revisar tu información y gestionar tus reservas.
          </p>

          <form className="auth-form">
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
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button type="submit" className="btn-primary auth-button">
              Iniciar sesión
            </button>
          </form>

          <div className="auth-links">
            <p>
              ¿Aún no tienes cuenta?{" "}
              <Link to="/registro" className="text-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;