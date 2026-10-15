import { ArrowDown, ArrowUpRight, MapPin, Phone } from "lucide-react";
import Header from "./components/Header.jsx";
import Environments from "./components/Environments.jsx";
import InspirationGallery from "./components/InspirationGallery.jsx";
import { Brand, SectionLabel, WhatsApp } from "./components/Shared.jsx";
import { company, image } from "./config.js";
import { navigation, steps } from "./content.js";

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container hero-heading">
        <div>
          <div className="micro-label hero-eyebrow">
            <span /> MÓVEIS PLANEJADOS, CURITIBA — PR
          </div>
          <h1 id="hero-title">
            Seu espaço merece <br />
            um projeto <em>à altura.</em>
          </h1>
        </div>
        <div className="hero-intro">
          <p>
            Conheça a Movelaria Batel e encontre inspiração para planejar seus
            ambientes em Curitiba.
          </p>
          <WhatsApp />
          <a className="explore-link" href="#ambientes">
            Explorar ambientes <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <figure className="hero-image">
        <img
          src={image("living")}
          alt="Referência ilustrativa de sala de estar e jantar com móveis amadeirados integrados e luz natural. Imagem gerada, não é projeto da empresa."
          width="1536"
          height="1024"
          fetchPriority="high"
        />
        <div className="hero-image-index" aria-hidden="true">
          MB<span>ESTUDO DE AMBIENTE / 01</span>
        </div>
        <figcaption>
          <span>
            <i /> ESPAÇOS PARA VIVER, IDEIAS PARA COMEÇAR.
          </span>
          <span>Imagem ilustrativa</span>
        </figcaption>
      </figure>
      <div className="container hero-caption">
        <span>UM OLHAR SOBRE O SEU ESPAÇO.</span>
        <a href="#sobre">
          Conheça a Movelaria Batel <ArrowDown size={13} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
function Introduction() {
  return (
    <section className="introduction section container" id="sobre">
      <figure className="introduction-image">
        <img
          src={image("detail")}
          alt="Detalhe ilustrativo de marcenaria, com madeira, nicho e bancada clara. Não é trabalho da empresa."
          width="1024"
          height="1536"
          loading="lazy"
        />
        <figcaption>TEXTURAS QUE INSPIRAM / IMAGEM ILUSTRATIVA</figcaption>
      </figure>
      <div className="introduction-copy">
        <SectionLabel number="01">MOVELARIA BATEL</SectionLabel>
        <h2>
          Mobiliário que conversa <br />
          com o seu <em>espaço.</em>
        </h2>
        <p className="intro-lead">
          Um ambiente diz muito sobre quem vive nele. Planejá-lo começa por
          olhar para a sua rotina.
        </p>
        <p>
          A Movelaria Batel - Planejados Curitiba é uma loja de móveis
          localizada no Batel, em Curitiba. Conheça referências de ambientes e
          entre em contato para conversar sobre o que você procura.
        </p>
        <p>
          Reunimos aqui ideias para começar esse diálogo. Compartilhe as suas e
          consulte com a empresa as possibilidades para o seu espaço.
        </p>
        <a href="#contato" className="inline-link">
          Vamos nos conhecer <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
function Planning() {
  return (
    <section className="planning section container">
      <SectionLabel number="04">O COMEÇO DA CONVERSA</SectionLabel>
      <div className="section-heading">
        <h2>
          Antes de planejar, <br />
          <em>vamos ouvir.</em>
        </h2>
        <p>
          Não é preciso ter tudo definido. <br />
          Sua ideia já é um ponto de partida.
        </p>
      </div>
      <div className="planning-steps">
        {steps.map((step, index) => (
          <article key={step.title}>
            <span className="step-number">
              0{index + 1}
              <i />
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
      <p className="content-note">
        Sugestão de primeiro contato, não um processo oficial. Etapas, condições
        e disponibilidade devem ser confirmadas diretamente com a empresa.
      </p>
    </section>
  );
}
function VisualFeature() {
  return (
    <section className="visual-feature" aria-labelledby="feature-title">
      <figure>
        <img
          src={image("bedroom")}
          alt="Referência ilustrativa de dormitório com armários e nichos de madeira. Imagem gerada, não é projeto da empresa."
          width="1024"
          height="1536"
          loading="lazy"
        />
        <figcaption>REFERÊNCIA DE DORMITÓRIO / IMAGEM ILUSTRATIVA</figcaption>
      </figure>
      <div className="feature-copy">
        <span className="micro-label">FORMAS DE HABITAR</span>
        <h2 id="feature-title">
          Cada ambiente <br />
          tem sua própria <br />
          <em>personalidade.</em>
        </h2>
        <span className="feature-rule" />
        <p>
          As referências abrem caminhos. <br />O seu jeito de viver dá o próximo
          passo.
        </p>
        <a href="#inspiracoes" className="inline-link">
          Encontre sua inspiração <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
function Contact() {
  return (
    <section className="contact section container" id="contato">
      <SectionLabel number="05">ENCONTRE A MOVELARIA BATEL</SectionLabel>
      <div className="contact-grid">
        <div className="contact-intro">
          <span className="micro-label">BATEL, CURITIBA</span>
          <h2>
            A conversa começa <br />
            <em>por aqui.</em>
          </h2>
          <p>
            Entre em contato para falar sobre seu ambiente e confirmar as
            informações de atendimento.
          </p>
          <a className="phone-link" href={`tel:+${company.phone}`}>
            <Phone size={17} aria-hidden="true" />
            {company.phoneLabel}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <WhatsApp className="text-cta">Conversar pelo WhatsApp</WhatsApp>
        </div>
        <div className="contact-address">
          <div className="address-heading">
            <MapPin size={20} aria-hidden="true" />
            <span>UM ENDEREÇO NO BATEL</span>
          </div>
          <address>
            <strong>{company.address}</strong>
            <span>{company.neighborhood}</span>
            <span>CEP {company.cep}</span>
          </address>
          <a
            href={company.maps}
            className="map-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Ver localização no Google Maps</span>
            <span>
              <ArrowUpRight size={23} aria-hidden="true" />
            </span>
          </a>
          <p>
            Antes de se deslocar, confirme com a empresa a possibilidade e as
            condições de atendimento presencial.
          </p>
        </div>
      </div>
    </section>
  );
}
function FinalCTA() {
  return (
    <section className="final-cta container">
      <span className="cta-ornament" aria-hidden="true">
        m<span>b</span>
      </span>
      <span className="micro-label">O PRÓXIMO PASSO É UMA CONVERSA</span>
      <h2>
        Vamos conversar sobre <br />o seu <em>ambiente?</em>
      </h2>
      <p>Conte o que você procura para o seu espaço.</p>
      <WhatsApp>Conversar pelo WhatsApp</WhatsApp>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Brand />
          <nav aria-label="Navegação do rodapé">
            {navigation.map(([id, text]) => (
              <a href={`#${id}`} key={id}>
                {text}
              </a>
            ))}
          </nav>
          <a href={`tel:+${company.phone}`}>
            {company.phoneLabel}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-address">
          <span>
            {company.address} · {company.neighborhood} · {company.cep}
          </span>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.name}.
          </span>
          <span>Design pensado para cada espaço.</span>
        </div>
        <p className="prototype-note">
          Protótipo comercial · Identidade e conteúdo propostos. Dados
          comerciais fornecidos no material de referência, sujeitos à
          confirmação. Imagens geradas e ilustrativas; não representam projetos
          da empresa. Categorias de ambientes dependem de validação comercial.
        </p>
      </div>
    </footer>
  );
}
export default function App() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Introduction />
        <Environments />
        <InspirationGallery />
        <Planning />
        <VisualFeature />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
