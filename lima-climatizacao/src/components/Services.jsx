import {
  AirVent,
  ShieldCheck,
  Wrench,
  Wind,
  DraftingCompass,
  ArrowUpRight,
} from "lucide-react";
import { services } from "../data/content";
import { asset } from "../config";
const icons = {
  air: AirVent,
  shield: ShieldCheck,
  tool: Wrench,
  wind: Wind,
  plan: DraftingCompass,
};
export default function Services({ chooseService }) {
  return (
    <section className="services section container" id="servicos">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / POSSIBILIDADES EM CLIMATIZAÇÃO</span>
          <h2>
            Um olhar técnico.
            <br />
            Para cada necessidade.
          </h2>
        </div>
        <div className="section-description">
          <p>
            Conheça uma seleção de soluções comuns ao setor e converse sobre o
            que seu ambiente precisa.
          </p>
          <span className="demo-tag">
            SELEÇÃO DEMONSTRATIVA · SERVIÇOS A CONFIRMAR
          </span>
        </div>
      </div>
      <div className="services-layout">
        <article className="service-feature">
          <div className="feature-media">
            <img
              src={asset("images/interior.webp")}
              alt="Imagem ilustrativa de um ar-condicionado instalado em ambiente residencial"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span>IMAGEM ILUSTRATIVA</span>
          </div>
          <div className="feature-content">
            <div className="service-number">
              01 <AirVent size={23} />
            </div>
            <h3>{services[0].title}</h3>
            <p>{services[0].description}</p>
            <a
              href="#orcamento"
              onClick={() => chooseService(services[0].title)}
              className="inline-link"
            >
              Consultar possibilidades <ArrowUpRight size={18} />
            </a>
          </div>
        </article>
        <div className="service-list">
          {services.slice(1).map((s) => {
            const Icon = icons[s.icon];
            return (
              <article key={s.id}>
                <span className="row-number">{s.label}</span>
                <div className="service-row-copy">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <a href="#orcamento" onClick={() => chooseService(s.title)}>
                    Solicitar informações <ArrowUpRight size={15} />
                  </a>
                </div>
                <Icon className="service-icon" size={28} strokeWidth={1.3} />
              </article>
            );
          })}
        </div>
      </div>
      <p className="section-note">
        O material original não confirma estas atividades. A disponibilidade de
        cada serviço deve ser consultada com a Lima Climatização.
      </p>
    </section>
  );
}
