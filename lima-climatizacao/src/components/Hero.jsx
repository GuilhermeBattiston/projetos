import {
  ArrowUpRight,
  ArrowDown,
  MapPin,
  MessageCircle,
  ClipboardList,
  SlidersHorizontal,
} from "lucide-react";
import { asset } from "../config";
export default function Hero() {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> LIMA CLIMATIZAÇÃO · CURITIBA
            </span>
            <h1>
              Climatização
              <br />
              começa com uma
              <br />
              <span>boa conversa.</span>
            </h1>
            <p>
              Seu ambiente tem necessidades próprias.
              <br className="desktop-break" /> Conte o que precisa e dê o
              primeiro passo para
              <br className="desktop-break" /> conversar sobre o seu orçamento.
            </p>
            <div className="hero-actions">
              <a href="#orcamento" className="button orange">
                Solicitar orçamento <ArrowUpRight size={19} />
              </a>
              <a className="hero-secondary" href="#servicos">
                Conhecer a proposta <ArrowDown size={17} />
              </a>
            </div>
            <div className="hero-location">
              <MapPin size={17} />
              <span>Curitiba, Paraná</span>
              <span className="location-note">
                Dados comerciais a confirmar
              </span>
            </div>
          </div>
          <div className="hero-media">
            <img
              src={asset("images/hero.webp")}
              alt="Fotografia ilustrativa gerada: técnico inspecionando um ar-condicionado split"
              width="1122"
              height="1402"
              fetchPriority="high"
            />
            <div className="photo-label">
              <span className="corner-mark" />
              <span>
                ATENÇÃO A CADA DETALHE
                <small>
                  Imagem ilustrativa · não representa a equipe da empresa
                </small>
              </span>
            </div>
            <div className="hero-index">
              <span>01 — 03</span>
              <i />
              <span>PROPOSTA INSTITUCIONAL</span>
            </div>
          </div>
        </div>
      </section>
      <div className="principles">
        <div className="container">
          <div>
            <MessageCircle size={23} />
            <span>
              <strong>Contato direto</strong>
              <small>Uma conversa pelo WhatsApp</small>
            </span>
          </div>
          <div>
            <ClipboardList size={23} />
            <span>
              <strong>Necessidade bem descrita</strong>
              <small>Informações para iniciar o atendimento</small>
            </span>
          </div>
          <div>
            <SlidersHorizontal size={23} />
            <span>
              <strong>Condições a combinar</strong>
              <small>Escopo e orçamento com a equipe</small>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
