import { ArrowUpRight } from "lucide-react";
import { image } from "../config.js";
import { Label } from "./Shared.jsx";
export default function Introduction() {
  return (
    <section className="introduction section container" id="sobre">
      <Label number="01">A CASTTINI CURITIBA</Label>
      <div className="intro-heading">
        <span className="eyebrow">ESPAÇO, ROTINA E POSSIBILIDADES</span>
        <h2>
          O espaço muda. <br />A vida encontra <em>lugar.</em>
        </h2>
      </div>
      <div className="intro-grid">
        <div className="intro-copy">
          <h3>
            Planejar começa por <br />
            olhar para a sua rotina.
          </h3>
          <p>
            O que precisa estar por perto? O que merece mais espaço? Um ambiente
            planejado começa por perguntas sobre o seu jeito de viver, organizar
            e habitar.
          </p>
          <p>
            A Casttini Curitiba Móveis Planejados é uma loja de móveis
            localizada no Batel, em Curitiba. Conheça as referências desta
            apresentação e entre em contato para conversar sobre o que procura.
          </p>
          <p>
            Estética, organização e funcionalidade são pontos de partida para
            essa conversa. As soluções e as possibilidades de personalização
            devem ser consultadas diretamente com a empresa.
          </p>
          <a className="text-link" href="#contato">
            Conheça nossos contatos
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <figure>
          <img
            src={image("detail")}
            alt="Referência ilustrativa de encontro entre madeira, superfície oliva e pedra clara. Não representa materiais oferecidos pela empresa."
            width="1024"
            height="1536"
            loading="lazy"
          />
          <figcaption>
            UM OLHAR PARA OS DETALHES / IMAGEM ILUSTRATIVA
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
