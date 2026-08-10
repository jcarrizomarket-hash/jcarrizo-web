import Hero from "../components/Hero";
import Metodologia from "../components/Metodologia";
import Servicios from "../components/Servicios";
import Proyectos from "../components/Proyectos";
import BlogPreview from "../components/BlogPreview";
import ContactoCTA from "../components/ContactoCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Metodologia />
      <Servicios />
      <Proyectos />
      <BlogPreview />
      <ContactoCTA />
    </>
  );
}
