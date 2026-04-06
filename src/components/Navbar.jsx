import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

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
          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>
          <Link to="/login" onClick={closeMenu}>
            Iniciar sesion
          </Link>
          <Link to="/reservar" className="btn-nav" onClick={closeMenu}>
            Reservar hora
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
