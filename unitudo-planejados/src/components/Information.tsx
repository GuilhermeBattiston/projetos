import { ArrowUpRight, MapPin, Phone, Instagram } from "lucide-react";
import { company, mapSearch, whatsappUrl } from "../config.ts";
import { solutions, journey, navigation } from "../content.ts";
import Photo from "./Photo.tsx";
import { Label, Brand, BriefLink } from "./Shared.tsx";
export function Solutions() {
  return (
    <section className="solutions section" id="solucoes">
      <div className="container">
        <Label number="02">O PLANEJADO COMEÇA NA SUA ROTINA</Label>
        <div className="solutions-layout">
          <div>
            <h2>
              Não é só <br />
              sobre <em>móveis.</em>
            </h2>
            <p className="solutions-lead">
              É também sobre o que você precisa guardar, fazer, compartilhar e
              viver.
            </p>
            <Photo
              name="detail"
              alt="Detalhe ilustrativo de marcenaria com superfícies em tons naturais. Não são materiais confirmados da Unitudo."
            />
            <span className="small-caption">
              TEXTURAS COMO REFERÊNCIA / IMAGEM ILUSTRATIVA
            </span>
          </div>
          <div className="solutions-list">
            {solutions.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
            <div className="solutions-note">
              Aproveitamento, organização e integração são ideias para orientar
              a conversa. Soluções e condições devem ser consultadas diretamente
              com a Unitudo.
            </div>
            <BriefLink className="button-dark">
              Começar pelo meu espaço
            </BriefLink>
          </div>
        </div>
      </div>
    </section>
  );
}
export function About() {
  return (
    <section className="about section container" id="sobre">
      <Label number="05">UNITUDO PLANEJADOS / CURITIBA</Label>
      <div className="about-grid">
        <h2>
          Um novo olhar <br />
          para o seu <br />
          <em>lugar no mundo.</em>
        </h2>
        <div>
          <p className="about-lead">
            Móveis planejados, projetos personalizados e design exclusivo: os
            serviços informados da Unitudo Planejados.
          </p>
          <p>
            Com endereço divulgado em Curitiba, a Unitudo tem o Instagram
            @unitudo.planejados como canal informado. Esta proposta de site
            organiza as informações de contato e abre espaço para conversar
            sobre o que você procura.
          </p>
          <p>
            Explore referências, organize suas ideias e consulte com a empresa
            as possibilidades para o seu ambiente.
          </p>
          <a
            className="text-link"
            href={company.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conhecer o Instagram
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="journey">
        <span className="eyebrow">
          COMO COMEÇAR / SUGESTÃO DE PRIMEIRO CONTATO
        </span>
        <div>
          {journey.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="content-note">
          Fluxo demonstrativo de conversa. Etapas e disponibilidade de
          atendimento devem ser confirmadas com a empresa.
        </p>
      </div>
    </section>
  );
}
export function Contact() {
  return (
    <section className="contact section" id="contato">
      <div className="container">
        <Label number="06">VAMOS NOS ENCONTRAR NA CONVERSA</Label>
        <div className="contact-grid">
          <div>
            <span className="eyebrow">CURITIBA, PARANÁ</span>
            <h2>
              Qual é a sua <br />
              próxima <em>ideia?</em>
            </h2>
            <p>
              Fale com a Unitudo Planejados e conte o que procura para o seu
              espaço.
            </p>
            <a className="phone-link" href={`tel:+${company.phone}`}>
              <Phone size={20} aria-hidden="true" />
              {company.phoneLabel}
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a
              className="button button-clay"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversar pelo WhatsApp
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              className="instagram-link"
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={17} aria-hidden="true" />
              {company.instagramLabel}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <aside className="address">
            <span className="eyebrow">
              <MapPin size={19} aria-hidden="true" />
              ENDEREÇO DIVULGADO
            </span>
            <h3>
              Curitiba. <br />
              <em>O começo da conversa.</em>
            </h3>
            <address>
              {company.address} <br />
              {company.city}
            </address>
            <a
              className="text-link"
              href={mapSearch}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pesquisar endereço no Maps
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <p>
              Link de pesquisa do endereço, não uma ficha comercial verificada.
              Confirme localização e condições de atendimento antes de uma
              visita.
            </p>
          </aside>
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
          {navigation.map(([id, title]) => (
            <a key={id} href={`#${id}`}>
              {title}
            </a>
          ))}
        </nav>
        <a href={company.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="footer-word" aria-hidden="true">
        unitudo<span>.</span>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Unitudo Planejados.</span>
        <span>Curitiba, Paraná</span>
        <a href="#inicio">Voltar ao início ↑</a>
      </div>
      <p className="prototype-note">
        Protótipo comercial. Assinatura, cores e conceito propostos, não uma
        identidade oficial verificada. Imagens geradas e ilustrativas, sem
        atribuição à Unitudo. Categorias de ambientes demonstrativas;
        informações comerciais fornecidas e sujeitas à confirmação.
      </p>
    </footer>
  );
}
