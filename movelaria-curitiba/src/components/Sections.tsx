import { ArrowUpRight, ArrowDown } from "lucide-react";
import { gallery, furniture, navigation } from "../content.ts";
import { company, whatsappUrl } from "../config.ts";
import { BriefLink, Brand, Eyebrow } from "./Shared.tsx";
import Photo from "./Photo.tsx";
export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-top">
        <div>
          <p className="eyebrow">MARCENARIA & MÓVEIS SOB MEDIDA · CURITIBA</p>
          <h1>
            O detalhe transforma <br />o <em>espaço.</em>
          </h1>
        </div>
        <div className="hero-intro">
          <p>
            Entre o que você imagina e o lugar onde vive, existe um móvel
            pensado para fazer parte.
          </p>
          <BriefLink />
          <a href="#projetos" className="text-link">
            Explorar projetos <ArrowDown size={16} />
          </a>
        </div>
      </div>
      <div className="hero-photograph">
        <Photo
          name="hero"
          alt="Imagem ilustrativa de cozinha contemporânea com ilha e marcenaria de madeira, gerada para esta proposta."
          priority
        />
        <div className="hero-caption">
          <span>01 / UM NOVO OLHAR PARA O SOB MEDIDA</span>
          <span>REFERÊNCIA ILUSTRATIVA</span>
        </div>
      </div>
      <div className="hero-foot container">
        <p>
          Da primeira ideia <br />a novas possibilidades.
        </p>
        <p>
          Proposta de experiência digital <br />
          para Movelaria Curitiba.
        </p>
        <a
          href="#ambientes"
          className="round-link"
          aria-label="Conhecer ambientes"
        >
          <ArrowDown size={21} />
        </a>
      </div>
    </section>
  );
}
export function Environments({
  onChoose,
}: {
  onChoose: (value: string) => void;
}) {
  return (
    <section className="section container environments" id="ambientes">
      <Eyebrow number="01">ENCONTRE O SEU PONTO DE PARTIDA</Eyebrow>
      <div className="section-heading">
        <h2>
          Cada ambiente. <br />
          <em>Um universo de ideias.</em>
        </h2>
        <p>
          Comece pelo espaço que você quer transformar. <br />
          As referências ajudam a abrir a conversa.
        </p>
      </div>
      <div className="environment-links">
        {gallery.map((item, index) => (
          <a
            key={item.id}
            href="#briefing"
            onClick={() => onChoose(item.environment)}
          >
            <span className="environment-number">0{index + 1}</span>
            <span>{item.category}</span>
            <ArrowUpRight size={20} />
          </a>
        ))}
      </div>
      <p className="note">
        Categorias informadas no briefing comercial, pendentes de conferência no
        site oficial. Imagens e composições são demonstrativas.
      </p>
    </section>
  );
}
export function Furniture() {
  return (
    <section className="section furniture" id="moveis">
      <div className="container furniture-layout">
        <div>
          <Eyebrow number="03">ALÉM DAS MEDIDAS</Eyebrow>
          <h2>
            Móveis que <br />
            <em>encontram lugar.</em>
          </h2>
          <p>
            O espaço tem suas medidas. <br />A sua rotina dá sentido a elas.
          </p>
          <BriefLink>Conversar sobre um móvel</BriefLink>
        </div>
        <div className="furniture-list">
          {furniture.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
          <p className="note">
            Tipos de móveis informados pelo solicitante. Modelos e
            possibilidades de execução devem ser confirmados no atendimento.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Details() {
  return (
    <section className="section container details">
      <div className="details-image">
        <Photo
          name="detail"
          alt="Referência ilustrativa de detalhe de marcenaria, com madeira e bancada."
        />
        <span className="image-tag">IMAGEM ILUSTRATIVA</span>
      </div>
      <div className="details-copy">
        <Eyebrow number="04">UM OLHAR MAIS PRÓXIMO</Eyebrow>
        <h2>
          É no detalhe <br />
          que o conjunto <br />
          <em>ganha sentido.</em>
        </h2>
        <p>
          Proporção, textura e organização mudam a forma de perceber um
          ambiente. Observe como as partes conversam — e guarde o que faz
          sentido para você.
        </p>
        <div className="detail-notes">
          <p>
            <span>01 / PROPORÇÃO</span>Uma composição que respeita o espaço.
          </p>
          <p>
            <span>02 / ORGANIZAÇÃO</span>Um lugar para o que pertence à sua
            rotina.
          </p>
          <p>
            <span>03 / INTEGRAÇÃO</span>Mobiliário como parte da arquitetura.
          </p>
        </div>
        <p className="note">
          Referências conceituais. Não especificam materiais, ferragens ou
          técnicas utilizadas pela empresa.
        </p>
      </div>
    </section>
  );
}
export function About() {
  return (
    <section className="section container about" id="sobre">
      <Eyebrow number="06">MOVELARIA CURITIBA</Eyebrow>
      <div className="about-layout">
        <h2>
          Sob medida <br />
          para o <em>seu espaço.</em>
        </h2>
        <div>
          <p className="lead">Marcenaria e móveis sob medida em Curitiba.</p>
          <p>
            Esta proposta reúne referências para explorar ambientes e um caminho
            simples para organizar sua solicitação de orçamento.
          </p>
          <p>
            Conheça os canais da Movelaria Curitiba e converse com a empresa
            para confirmar serviços, condições e possibilidades para o seu
            projeto.
          </p>
          <a
            className="text-link"
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visitar o site oficial <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
export function Contact() {
  return (
    <section className="contact section" id="contato">
      <div className="container">
        <p className="eyebrow">VAMOS TIRAR A IDEIA DO PAPEL?</p>
        <div className="contact-layout">
          <h2>
            Um espaço novo <br />
            começa com <br />
            <em>uma conversa.</em>
          </h2>
          <div>
            <a
              className="contact-phone"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {company.phone}
              <ArrowUpRight size={23} />
            </a>
            <p>WhatsApp · Movelaria Curitiba</p>
            <a href={`mailto:${company.email}`} className="contact-email">
              {company.email}
            </a>
            <p>{company.city}</p>
            <BriefLink>Organizar meu briefing</BriefLink>
          </div>
        </div>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <Brand />
        <nav aria-label="Navegação do rodapé">
          {navigation.map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <a href={company.website} target="_blank" rel="noopener noreferrer">
          Site oficial <ArrowUpRight size={14} />
        </a>
      </div>
      <p className="footer-statement">O detalhe transforma o espaço.</p>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} · Proposta WEBFORGE</span>
        <span>Protótipo comercial · Conteúdo e imagens demonstrativos</span>
        <a href="#inicio">Voltar ao início ↑</a>
      </div>
      <p className="note">
        Direção de arte e assinatura tipográfica propostas, sem vínculo com uma
        identidade oficial aprovada. Dados de contato fornecidos pelo
        solicitante.
      </p>
    </footer>
  );
}
