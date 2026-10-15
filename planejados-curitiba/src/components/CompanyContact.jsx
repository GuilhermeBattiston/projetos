import { ArrowUpRight, Phone, MapPin } from "lucide-react";
import { company, whatsappUrl } from "../config.js";
import { navigation } from "../content.js";
import { Brand, Label, PlanningLink } from "./Shared.jsx";
export function CompanyContact() {
  return (
    <>
      <section className="about section container" id="sobre">
        <Label number="05">PLANEJADOS CURITIBA</Label>
        <div className="about-grid">
          <h2>
            Uma cozinha. <br />
            Muitas formas <br />
            de <em>viver.</em>
          </h2>
          <div>
            <p className="about-lead">
              Planejados Curitiba — Fábrica de Cozinhas Planejadas é uma loja de
              móveis com endereço no Centro de Curitiba.
            </p>
            <p>
              A empresa está localizada no Centro de Curitiba. Esta apresentação
              reúne referências de cozinhas e um organizador de preferências
              para facilitar o primeiro contato.
            </p>
            <p>
              Conte o que procura e consulte as possibilidades diretamente com a
              empresa. As soluções, materiais e condições precisam ser
              confirmados para o seu espaço.
            </p>
            <a className="text-link" href="#contato">
              Vamos conversar
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="contact section" id="contato">
        <div className="container">
          <Label number="06">A CONVERSA CONTINUA POR AQUI</Label>
          <div className="contact-grid">
            <div>
              <span className="eyebrow">CURITIBA / PARANÁ</span>
              <h2>
                O próximo passo <br />é <em>seu.</em>
              </h2>
              <p>
                Entre em contato com a Planejados Curitiba e converse sobre sua
                cozinha planejada.
              </p>
              <a className="phone-link" href={`tel:+${company.phone}`}>
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
            </div>
            <aside className="address">
              <span className="address-label">
                <MapPin size={20} aria-hidden="true" />
                ENDEREÇO INFORMADO
              </span>
              <h3>
                Centro, <br />
                <em>Curitiba.</em>
              </h3>
              <address>
                {company.address} <br />
                {company.neighborhood} <br />
                CEP {company.cep}
              </address>
              <a
                className="text-link"
                href={company.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Google Maps
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <p>
                Confirme a localização e as condições de atendimento antes de
                uma visita.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <Brand />
        <nav aria-label="Navegação do rodapé">
          {navigation.map(([id, text]) => (
            <a key={id} href={`#${id}`}>
              {text}
            </a>
          ))}
        </nav>
        <PlanningLink>Organizar minha ideia</PlanningLink>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {company.name}.
        </span>
        <a href={`tel:+${company.phone}`}>{company.phoneLabel}</a>
        <a href="#inicio">Voltar ao início ↑</a>
      </div>
      <p className="prototype-note">
        Protótipo de apresentação comercial. Identidade proposta; fotos geradas
        e ilustrativas, não são obras da empresa. Contatos e endereço fornecidos
        no HTML, sujeitos à confirmação.
      </p>
    </footer>
  );
}
