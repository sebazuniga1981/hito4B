import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("role") || localStorage.getItem("rol");

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("rol");
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <Link to="/" className="logo" onClick={closeMenu}>
            PsicoConecta
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Cerrar" : "Menu"}
          </button>
        </div>

        <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>
          <Link to="/sobre-mi" onClick={closeMenu}>
            Sobre mi
          </Link>
          <Link to="/especializaciones" onClick={closeMenu}>
            Especializaciones
          </Link>
          <Link to="/modalidades" onClick={closeMenu}>
            Modalidades
          </Link>
          <Link to="/planes" onClick={closeMenu}>
            Planes
          </Link>
          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>

          {!isAuthenticated && (
            <Link to="/login" onClick={closeMenu}>
              Iniciar sesion
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link to="/reservar" className="btn-nav" onClick={closeMenu}>
                Reservar hora
              </Link>
              <Link to="/panel-paciente" onClick={closeMenu}>
                Mi panel
              </Link>
              {role === "admin" && (
                <Link to="/panel-psicologa" onClick={closeMenu}>
                  Admin
                </Link>
              )}
              <button type="button" className="btn-nav" onClick={handleLogout}>
                Cerrar sesion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
