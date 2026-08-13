import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ClubDeCruceros from "./pages/ClubDeCruceros";
import Shell from "./pages/backoffice/Shell";
import Dashboard from "./pages/backoffice/Dashboard";
import Leads from "./pages/backoffice/Leads";
import Clientes from "./pages/backoffice/Clientes";
import Agenda from "./pages/backoffice/Agenda";
import WhatsApp from "./pages/backoffice/WhatsApp";
import Metricas from "./pages/backoffice/Metricas";
import Configuracion from "./pages/backoffice/Configuracion";

export default function App() {
  const location = useLocation();
  const isBackOffice = location.pathname.startsWith("/backoffice");

  return (
    <div className="flex min-h-screen flex-col">
      {!isBackOffice && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/club-de-cruceros" element={<ClubDeCruceros />} />
          <Route path="/backoffice" element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="metricas" element={<Metricas />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </main>
      {!isBackOffice && <Footer />}
    </div>
  );
}
