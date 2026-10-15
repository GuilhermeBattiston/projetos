import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { environments } from "../content.js";
import { image } from "../config.js";
import { Label } from "./Shared.jsx";
export default function Environments({ onChoose }) {
  const [active, setActive] = useState(0);
  const environment = environments[active];
  return (
    <section className="environments section" id="ambientes">
      <div className="container">
        <Label number="02">POSSIBILIDADES DE PLANEJAR</Label>
        <div className="section-heading">
          <h2>
            Para cada parte <br />
            da sua <em>vida.</em>
          </h2>
          <p>
            Encontre uma referência. <br />
            Comece a imaginar o seu ambiente.
          </p>
        </div>
        <div className="environment-layout">
          <div
            className="environment-list"
            role="group"
            aria-label="Selecionar ambiente"
          >
            {environments.map((item, index) => (
              <button
                key={item.id}
                aria-pressed={active === index}
                aria-controls="environment-detail"
                onClick={() => setActive(index)}
              >
                <span>0{index + 1}</span>
                {item.name}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div id="environment-detail" className="environment-detail">
            <figure>
              <img
                key={environment.image}
                src={image(environment.image)}
                alt={`${environment.alt} Não é projeto da empresa.`}
                width="1536"
                height="1024"
                loading="lazy"
              />
              <figcaption>
                REFERÊNCIA ILUSTRATIVA / {environment.name.toUpperCase()}
              </figcaption>
            </figure>
            <div className="environment-description">
              <div aria-live="polite">
                <h3>{environment.title}</h3>
                <p>{environment.text}</p>
              </div>
              <a
                className="text-link"
                href="#orcamento"
                onClick={() => onChoose(environment.id)}
              >
                Planejar este ambiente
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <p className="content-note">
          Categorias demonstrativas, pendentes de confirmação comercial.
          Consulte quais ambientes e serviços são oferecidos pela Casttini
          Curitiba.
        </p>
      </div>
    </section>
  );
}
