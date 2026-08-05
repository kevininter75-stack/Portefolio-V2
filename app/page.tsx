import Nav from "@/components/ui/Nav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/sections/Hero";
import Journey from "@/components/sections/Journey";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Method from "@/components/sections/Method";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="contenu">
        <span id="top" />
        <Hero />
        <Journey />
        <Projects />
        <Skills />
        <Method />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
