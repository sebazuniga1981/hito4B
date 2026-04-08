import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SobreMi from "./pages/SobreMi";
import Especializaciones from "./pages/Especializaciones";
import Modalidades from "./pages/Modalidades";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ReservarHora from "./pages/reservarHora";
import PanelPaciente from "./pages/PanelPaciente";
import PanelPsicologa from "./pages/PanelPsicologa";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConfirmacionReserva from "./pages/ConfirmacionReserva";
import Planes from "./pages/Planes";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-mi" element={<SobreMi />} />
        <Route path="/especializaciones" element={<Especializaciones />} />
        <Route path="/modalidades" element={<Modalidades />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/planes" element={<Planes />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/reservar" element={<ReservarHora />} />
          <Route path="/panel-paciente" element={<PanelPaciente />} />
          <Route path="/confirmacion-reserva" element={<ConfirmacionReserva />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/panel-psicologa" element={<PanelPsicologa />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
