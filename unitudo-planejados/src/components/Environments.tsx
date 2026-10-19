import { ArrowUpRight } from "lucide-react";
import { gallery } from "../content.ts";
import Photo from "./Photo.tsx";
import { Label } from "./Shared.tsx";
export default function Environments({
  onChoose,
}: {
  onChoose: (environment: string) => void;
}) {
  return (
    <section className="environments section container" id="ambientes">
      <Label number="01">IMAGINE O SEU AMBIENTE</Label>
      <div className="section-heading">
        <h2>
          O que pode mudar <br />
          no seu <em>espaço?</em>
        </h2>
        <p>
          Referências para começar a conversa. <br />
          Cada ideia tem o seu ponto de partida.
        </p>
      </div>
      <div className="environment-grid">
        {gallery.slice(0, 3).map((item, index) => (
          <article key={item.id} className={`environment environment-${index}`}>
            <a
              className="environment-image"
              href="#briefing"
              onClick={() => onChoose(item.environment)}
              aria-label={`Começar briefing para ${item.category}`}
            >
              <Photo
                name={item.image}
                alt={`${item.alt} Não é projeto da Unitudo.`}
              />
              <span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </span>
              <small>ILUSTRATIVA</small>
            </a>
            <div className="environment-caption">
              <span>0{index + 1}</span>
              <h3>{item.category}</h3>
              <a
                href="#briefing"
                onClick={() => onChoose(item.environment)}
                aria-label={`Conversar sobre ${item.category}`}
              >
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="environment-foot">
        <p>
          Ambientes ilustrativos, não um catálogo oficial. <br />
          Consulte quais soluções são oferecidas pela Unitudo.
        </p>
        <a className="text-link" href="#inspiracoes">
          Ver todas as inspirações
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
