import { ArrowDown, MapPin } from "lucide-react";
import { image } from "../config.js";
import { PlanningLink } from "./Shared.jsx";
export default function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-copy">
        <span className="eyebrow">
          <i /> PLANEJADOS CURITIBA
        </span>
        <h1 id="hero-title">
          O seu jeito <br />
          de viver, <br />
          <em>na cozinha.</em>
        </h1>
        <p>
          Inspirações para organizar o espaço e abrir lugar para a rotina.
          Comece uma conversa sobre a sua cozinha planejada.
        </p>
        <PlanningLink>Começar meu planejamento</PlanningLink>
        <a className="hero-explore" href="#cozinhas">
          Conhecer as possibilidades
          <ArrowDown size={16} aria-hidden="true" />
        </a>
        <div className="hero-location">
          <MapPin size={15} aria-hidden="true" />
          <span>
            COZINHAS PLANEJADAS <br />
            <strong>CURITIBA, PARANÁ</strong>
          </span>
        </div>
      </div>
      <figure className="hero-media">
        <img
          src={image("hero")}
          alt="Referência ilustrativa de cozinha com marcenaria integrada, ilha clara e luz natural. Imagem gerada; não é obra da empresa."
          width="1536"
          height="1024"
          fetchPriority="high"
        />
        <span className="hero-caption-index" aria-hidden="true">
          01 / FORMAS DE HABITAR
        </span>
        <figcaption>
          <span>O COTIDIANO, SOB UM NOVO OLHAR.</span>
          <span>Imagem ilustrativa</span>
        </figcaption>
      </figure>
    </section>
  );
}
