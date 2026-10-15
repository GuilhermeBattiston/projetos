import { useState } from "react";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import QuoteForm from "./components/QuoteForm";
import {
  About,
  Process,
  Gallery,
  Location,
  FAQ,
  Footer,
} from "./components/Information";
import { business } from "./config";
import { whatsappUrl } from "./utils/quote";
export default function App() {
  const [service, setService] = useState("");
  return (
    <>
      <a className="skip-link" href="#servicos">
        Pular para o conteúdo
      </a>
      <Header />
      <main>
        <Hero />
        <Services chooseService={setService} />
        <About />
        <Process />
        <Gallery />
        <Location />
        <FAQ />
        <QuoteForm service={service} setService={setService} />
      </main>
      <Footer />
      <a
        className="floating-contact"
        href={whatsappUrl(
          business.phone,
          "Olá! Gostaria de conversar com a Lima Climatização.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a Lima Climatização no WhatsApp"
      >
        <MessageCircle size={23} />
        <span>Vamos conversar?</span>
        <ArrowUpRight size={16} />
      </a>
    </>
  );
}
