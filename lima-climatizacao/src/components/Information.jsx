import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Plus,
  MessageCircle,
} from "lucide-react";
import { business, asset } from "../config";
import { steps, faqs, gallery } from "../data/content";
import { whatsappUrl } from "../utils/quote";
import { Brand } from "./Header";
export function About() {
  return (
    <section className="about-section" id="sobre">
      <div className="container about-layout">
        <div className="about-visual">
          <div className="technical-frame">
            <span>UMA PROPOSTA PARA A MARCA</span>
            <div className="technical-monogram">
              L<span>+</span>
            </div>
            <div className="technical-caption">
              LIMA
              <br />
              <small>CLIMATIZAÇÃO</small>
            </div>
            <i className="drawing-line line-one" />
            <i className="drawing-line line-two" />
          </div>
          <div className="technical-footer">
            <span>PRECISÃO NA FORMA.</span>
            <span>CLAREZA NA CONVERSA.</span>
          </div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">02 / UMA APRESENTAÇÃO MAIS CLARA</span>
          <h2>
            Seu espaço.
            <br />O ponto de partida.
          </h2>
          <p>
            Uma necessidade bem compreendida começa com informações claras: o
            ambiente, o equipamento e o que você deseja resolver.
          </p>
          <p>
            Esta proposta para a Lima Climatização organiza essa primeira
            conversa e aproxima o contato da empresa das necessidades de cada
            cliente.
          </p>
          <div className="about-facts">
            <div>
              <strong>
                Curitiba<span> / PR</span>
              </strong>
              <small>Cidade informada no material de origem</small>
            </div>
            <div>
              <strong>WhatsApp</strong>
              <small>Canal de contato informado</small>
            </div>
          </div>
          <p className="disclosure">
            Apresentação conceitual demonstrativa. Identidade visual e
            informações comerciais devem ser aprovadas pela empresa.
          </p>
          <a href="#contato" className="inline-link">
            Conheça os canais de contato <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section className="section container process-section" id="atendimento">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / DO PRIMEIRO CONTATO AO ACORDO</span>
          <h2>
            Menos dúvidas.
            <br />
            Uma conversa organizada.
          </h2>
        </div>
        <div className="section-description">
          <p>
            Um fluxo simples para explicar sua necessidade e combinar os
            próximos passos.
          </p>
          <span className="demo-tag">FLUXO DE ATENDIMENTO DEMONSTRATIVO</span>
        </div>
      </div>
      <ol className="process-steps">
        {steps.map((step, i) => (
          <li key={step.title}>
            <div className="step-top">
              <span>0{i + 1}</span>
              {i < 3 && <ArrowRight size={19} />}
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function Gallery() {
  return (
    <section className="gallery-section section" id="referencias">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">04 / REFERÊNCIAS VISUAIS</span>
            <h2>
              A técnica encontra
              <br />o ambiente.
            </h2>
          </div>
          <div className="section-description">
            <p>
              Um espaço preparado para receber os registros reais dos trabalhos
              da empresa.
            </p>
            <span className="demo-tag">
              IMAGENS GERADAS · NÃO SÃO PROJETOS DA LIMA
            </span>
          </div>
        </div>
        <div className="gallery-grid">
          {gallery.map((item, i) => (
            <figure key={item.image}>
              <div className="gallery-image">
                <img
                  src={asset(item.image)}
                  alt={`Imagem ilustrativa: ${item.title.toLowerCase()}`}
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
                <span>REFERÊNCIA {String(i + 1).padStart(2, "0")}</span>
              </div>
              <figcaption>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Location() {
  return (
    <section className="location-section section container" id="localizacao">
      <div className="location-copy">
        <span className="eyebrow">05 / LOCALIZAÇÃO INFORMADA</span>
        <h2>
          Em Curitiba.
          <br />
          Perto da conversa.
        </h2>
        <p>
          Curitiba é a cidade apresentada no material de origem. Consulte a
          equipe para confirmar o atendimento no seu endereço.
        </p>
        <div className="address">
          <MapPin size={20} />
          <div>
            <strong>{business.address}</strong>
            <span>CEP {business.postalCode}</span>
            <small>
              Endereço extraído do HTML anterior; confirme antes de se deslocar.
            </small>
          </div>
        </div>
        <a
          href={business.map}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-link"
        >
          Consultar endereço no Google Maps <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="location-panel">
        <div className="location-panel-top">
          <span>
            <MapPin size={16} />
            CURITIBA / PARANÁ
          </span>
          <span>DADOS A CONFIRMAR</span>
        </div>
        <div className="map-art" aria-hidden="true">
          <div className="map-roads" />
          <div className="map-marker">
            <MapPin size={27} />
          </div>
          <span className="map-city">CURITIBA</span>
          <small>COMPOSIÇÃO ILUSTRATIVA · SEM ESCALA</small>
        </div>
        <div className="location-hours">
          <h3>
            <Clock size={17} /> Horários informados
          </h3>
          {business.hours.map(([day, hour]) => (
            <div key={day}>
              <span>{day}</span>
              <strong>{hour}</strong>
            </div>
          ))}
          <p>Horários do material de origem, sujeitos à confirmação.</p>
        </div>
      </div>
    </section>
  );
}
export function FAQ() {
  return (
    <section className="faq-section section" id="duvidas">
      <div className="container faq-layout">
        <div>
          <span className="eyebrow">06 / ANTES DE ENTRAR EM CONTATO</span>
          <h2>
            Vamos esclarecer
            <br />o primeiro passo.
          </h2>
          <p>
            Informações úteis para começar
            <br />
            uma boa conversa.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ContactDetails() {
  return (
    <div className="contact-details">
      <a
        href={whatsappUrl(
          business.phone,
          "Olá! Gostaria de conversar com a Lima Climatização.",
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={20} />
        <span>
          <small>CONVERSE NO WHATSAPP</small>
          {business.phoneDisplay}
        </span>
        <ArrowUpRight size={20} />
      </a>
      <a href={`tel:+${business.phone}`}>
        <Phone size={20} />
        <span>
          <small>PREFERE LIGAR?</small>
          {business.phoneDisplay}
        </span>
        <ArrowUpRight size={20} />
      </a>
      <p>
        Contato informado no HTML anterior.
        <br />
        Confirme os dados com a empresa antes da publicação definitiva.
      </p>
    </div>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <Brand light />
        <p>
          Informação clara.
          <br />
          Uma conversa para começar.
        </p>
        <nav aria-label="Navegação do rodapé">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
          <a href="#duvidas">Dúvidas</a>
        </nav>
        <a className="back-top" href="#inicio">
          Voltar ao topo <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Lima Climatização · proposta
          institucional
        </span>
        <span>Protótipo demonstrativo · dados e serviços a confirmar</span>
      </div>
    </footer>
  );
}
