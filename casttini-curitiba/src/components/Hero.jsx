import { ArrowDown } from "lucide-react";
import { image } from "../config.js";
import { QuoteLink } from "./Shared.jsx";
export default function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <img
        className="hero-photo"
        src={image("kitchen")}
        alt="Cozinha contemporânea ilustrativa com marcenaria integrada, tons de madeira e ilha clara. Imagem gerada, não é projeto da Casttini."
        width="1536"
        height="1024"
        fetchPriority="high"
      />
      <div className="hero-panel">
        <span className="eyebrow">UM NOVO OLHAR PARA O SEU ESPAÇO</span>
        <h1 id="hero-title">
          Planejar o espaço. <br />
          <em>Mudar o viver.</em>
        </h1>
        <p>
          Ideias para organizar a casa e dar lugar à sua rotina. Conheça a
          Casttini Curitiba e comece uma conversa sobre móveis planejados.
        </p>
        <QuoteLink className="button-light">
          Vamos planejar seu ambiente
        </QuoteLink>
        <a className="hero-explore" href="#ambientes">
          Explore as possibilidades
          <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="hero-location">
        <span>CURITIBA, PARANÁ</span>
        <span>
          REFERÊNCIA VISUAL / COZINHA <br />
          <small>Imagem gerada e ilustrativa</small>
        </span>
      </div>
    </section>
  );
}
