import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ClubDeCruceros from "./pages/ClubDeCruceros";
import BackOffice from "./pages/BackOffice";

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
          <Route path="/backoffice" element={<BackOffice />} />
        </Routes>
      </main>
      {!isBackOffice && <Footer />}
    </div>
  );
}
