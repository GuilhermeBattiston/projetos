import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { environments } from "../content.js";
import { image } from "../config.js";
import { SectionLabel, WhatsApp } from "./Shared.jsx";
export default function Environments() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const select = (event, index) => {
    let target;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      target = (index + 1) % environments.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      target = (index + environments.length - 1) % environments.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = environments.length - 1;
    if (target !== undefined) {
      event.preventDefault();
      setActive(target);
      tabs.current[target]?.focus();
    }
  };
  return (
    <section className="environments section" id="ambientes">
      <div className="container">
        <SectionLabel number="02">
          POSSIBILIDADES PARA O SEU ESPAÇO
        </SectionLabel>
        <div className="section-heading">
          <h2>
            Uma casa. <br />
            Muitas <em>possibilidades.</em>
          </h2>
          <p>
            Explore ideias para cada ambiente. <br />O primeiro passo é imaginar
            o seu.
          </p>
        </div>
        <div
          className="environment-tabs"
          role="tablist"
          aria-label="Ambientes planejados"
        >
          {environments.map((environment, index) => (
            <button
              key={environment.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              role="tab"
              id={`tab-${environment.id}`}
              aria-selected={active === index}
              aria-controls={`panel-${environment.id}`}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => select(event, index)}
            >
              <span>0{index + 1}</span>
              {environment.name}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        {environments.map((environment, index) => (
          <div
            key={environment.id}
            className="environment-panel"
            id={`panel-${environment.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${environment.id}`}
            hidden={active !== index}
            tabIndex={0}
          >
            <figure>
              <img
                src={image(environment.image)}
                alt={environment.alt}
                width="1536"
                height="1024"
                loading="lazy"
              />
              <figcaption>
                REFERÊNCIA ILUSTRATIVA / {environment.name.toUpperCase()}
              </figcaption>
            </figure>
            <div className="environment-copy">
              <span className="micro-label">
                IDEIAS PARA {environment.name.toUpperCase()}
              </span>
              <h3>{environment.title}</h3>
              <p>{environment.text}</p>
              <WhatsApp className="text-cta" subject={environment.subject}>
                Conversar sobre este ambiente
              </WhatsApp>
              <span className="environment-index" aria-hidden="true">
                0{index + 1}
                <small> / 05</small>
              </span>
            </div>
          </div>
        ))}
        <p className="content-note">
          Categorias sugeridas para esta apresentação, sujeitas à confirmação
          comercial. Consulte a disponibilidade com a Movelaria Batel.
        </p>
      </div>
    </section>
  );
}
