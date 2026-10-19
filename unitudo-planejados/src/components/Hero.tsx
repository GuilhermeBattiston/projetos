import { ArrowDown } from "lucide-react";
import Photo from "./Photo.tsx";
import { BriefLink } from "./Shared.tsx";
export default function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-top">
          <span className="eyebrow">MÓVEIS PLANEJADOS / CURITIBA, PR</span>
          <span className="hero-edition">UM NOVO OLHAR PARA HABITAR</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Seu espaço. <br />
              Novas <br />
              <em>possibilidades.</em>
            </h1>
            <p>
              O mobiliário acompanha a vida. <br />
              Vamos conversar sobre a sua?
            </p>
            <BriefLink className="button-clay">
              Conversar sobre meu projeto
            </BriefLink>
            <a href="#ambientes" className="hero-explore">
              Explorar ambientes
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <figure className="hero-photo">
            <Photo
              name="living"
              alt="Sala de estar ilustrativa com marcenaria integrada, madeira natural e luz do dia. Imagem gerada; não é trabalho da Unitudo."
              priority
            />
            <figcaption>
              <span>01 / ESPAÇOS PARA VIVER</span>
              <span>Referência ilustrativa</span>
            </figcaption>
          </figure>
          <figure className="hero-detail">
            <Photo
              name="detail"
              alt="Detalhe ilustrativo de encontro entre marcenaria e superfícies claras. Não são materiais confirmados da Unitudo."
            />
            <figcaption>UM OLHAR MAIS PRÓXIMO.</figcaption>
          </figure>
        </div>
        <div className="hero-bottom">
          <span>MÓVEIS PLANEJADOS</span>
          <span>PROJETOS PERSONALIZADOS</span>
          <span>DESIGN EXCLUSIVO</span>
          <span className="hero-bottom-location">CURITIBA / BRASIL</span>
        </div>
      </div>
    </section>
  );
}
