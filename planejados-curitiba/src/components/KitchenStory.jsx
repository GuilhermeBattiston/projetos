import { ArrowUpRight } from "lucide-react";
import { image } from "../config.js";
import { Label } from "./Shared.jsx";
export default function KitchenStory() {
  return (
    <section className="kitchen-story section container" id="cozinhas">
      <Label number="01">PENSAR O ESPAÇO, VIVER A COZINHA</Label>
      <div className="story-top">
        <h2>
          Mais espaço <br />
          para o que <em>importa.</em>
        </h2>
        <p>
          Preparar o café. Dividir a mesa. <br />
          Encontrar cada coisa no seu lugar.
        </p>
      </div>
      <div className="story-grid">
        <figure>
          <img
            src={image("natural")}
            alt="Detalhe ilustrativo de armários de madeira, bancada e tons naturais. Não representa materiais da empresa."
            width="1024"
            height="1536"
            loading="lazy"
          />
          <figcaption>
            TEXTURAS & POSSIBILIDADES / REFERÊNCIA ILUSTRATIVA
          </figcaption>
        </figure>
        <div>
          <span className="eyebrow">A COZINHA ACOMPANHA A SUA ROTINA</span>
          <h3>
            Antes das formas, <br />
            vem o seu jeito de usar.
          </h3>
          <p>
            O que você precisa guardar? Como gosta de cozinhar? A cozinha é
            também um lugar de hábitos, encontros e escolhas.
          </p>
          <p>
            Pensar um ambiente planejado é olhar para organização, circulação e
            preferências em conjunto. As referências deste site ajudam a começar
            essa conversa — as soluções devem ser consultadas com a empresa.
          </p>
          <a href="#preferencias" className="text-link">
            Organize suas preferências
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div className="story-topics">
            <span>ORGANIZAÇÃO</span>
            <span>INTEGRAÇÃO</span>
            <span>ROTINA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
