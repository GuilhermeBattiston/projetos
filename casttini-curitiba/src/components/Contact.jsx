import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { company, whatsappUrl } from "../config.js";
import { Brand, Label, QuoteLink } from "./Shared.jsx";
import { navigation } from "../content.js";
export function Contact() {
  return (
    <section className="contact section container" id="contato">
      <Label number="06">CURITIBA, PARANÁ</Label>
      <div className="contact-grid">
        <div>
          <span className="eyebrow">BATEL / CURITIBA</span>
          <h2>
            Nos encontramos <br />
            na <em>conversa.</em>
          </h2>
          <p>
            Fale com a Casttini Curitiba e consulte as possibilidades para o seu
            ambiente.
          </p>
          <a className="phone" href={`tel:+${company.phone}`}>
            <Phone size={20} aria-hidden="true" />
            {company.phoneLabel}
            <ArrowUpRight size={21} aria-hidden="true" />
          </a>
          <a
            className="text-link"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversar pelo WhatsApp
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <p className="contact-note">
            O número de WhatsApp foi fornecido no site anterior. Confirme com a
            empresa a disponibilidade desse canal.
          </p>
        </div>
        <aside className="address">
          <span className="address-heading">
            <MapPin size={21} aria-hidden="true" />
            ENDEREÇO INFORMADO
          </span>
          <h3>
            Batel, <br />
            <em>Curitiba.</em>
          </h3>
          <address>
            {company.address} <br />
            {company.neighborhood} <br />
            CEP {company.cep}
          </address>
          <a
            href={company.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Abrir no Google Maps
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <p>
            Antes de uma visita, confirme a localização e as condições de
            atendimento presencial.
          </p>
        </aside>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Brand />
          <nav aria-label="Navegação do rodapé">
            {navigation.map(([id, title]) => (
              <a href={`#${id}`} key={id}>
                {title}
              </a>
            ))}
          </nav>
          <QuoteLink />
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.name}.
          </span>
          <a href={`tel:+${company.phone}`}>{company.phoneLabel}</a>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
        <p className="prototype-note">
          Protótipo comercial. Assinatura tipográfica, paleta e conteúdo
          propostos, sem vínculo com a identidade oficial. Dados de contato
          sujeitos à confirmação. Imagens geradas e ilustrativas, não são obras
          da empresa. Categorias demonstrativas.
        </p>
      </div>
    </footer>
  );
}
