import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Introduction from "./components/Introduction.jsx";
import Environments from "./components/Environments.jsx";
import Gallery from "./components/Gallery.jsx";
import Process from "./components/Process.jsx";
import QuoteForm from "./components/QuoteForm.jsx";
import { Contact, Footer } from "./components/Contact.jsx";
export default function App() {
  const [environment, setEnvironment] = useState("");
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Introduction />
        <Environments onChoose={setEnvironment} />
        <Gallery />
        <Process />
        <QuoteForm environment={environment} setEnvironment={setEnvironment} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
