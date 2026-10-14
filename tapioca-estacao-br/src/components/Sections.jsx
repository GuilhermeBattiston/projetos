import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Leaf,
  Heart,
  ShoppingBag,
  Instagram,
  ArrowRight,
} from "lucide-react";
import { Brand } from "./Header";
import ProductCard from "./ProductCard";
import { products, categories } from "../data/products";
import { business } from "../config";
import { whatsappUrl } from "../utils/order";
export function Hero({ onOrder }) {
  return (
    <>
      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span className="little-line" /> BRASIL NO SABOR. LEVEZA NA PAUSA.
          </div>
          <h1>
            Uma boa pausa
            <br />
            pede <em>tapioca.</em>
          </h1>
          <p>
            Massa leve, recheio generoso e espaço para o seu gosto. Encontre a
            combinação que combina com o seu dia.
          </p>
          <div className="hero-buttons">
            <a className="button primary" href="#cardapio">
              Ver cardápio <ArrowUpRight size={19} />
            </a>
            <button className="button text-button" onClick={onOrder}>
              Fazer pedido <ArrowRight size={18} />
            </button>
          </div>
          <div className="hero-note">
            <span className="note-icon">
              <Leaf size={20} strokeWidth={1.5} />
            </span>
            <span>
              Um ingrediente brasileiro.
              <br />
              <strong>Um mundo de possibilidades.</strong>
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            className="hero-image"
            src="/images/tapioca-frango.webp"
            alt="Imagem gerada para demonstração: tapioca de frango e queijo em um prato verde"
            fetchPriority="high"
          />
          <div className="hero-stamp">
            <span>DO SEU JEITO</span>
            <Heart size={24} strokeWidth={1.4} />
            <span>NO SEU TEMPO</span>
          </div>
          <div className="hero-caption">
            <span>Frango & queijo</span>
            <small>Uma sugestão do nosso cardápio demonstrativo</small>
            <a href="#cardapio" aria-label="Conhecer cardápio">
              <ArrowDown size={20} />
            </a>
          </div>
          <span className="image-disclosure">
            Imagem ilustrativa gerada para este protótipo
          </span>
        </div>
      </section>
      <div className="values-strip">
        <span>
          <Leaf size={18} />A tapioca é protagonista
        </span>
        <i />
        <span>
          <Heart size={18} />
          Combinações para o seu gosto
        </span>
        <i />
        <span>
          <ShoppingBag size={18} />
          Seu pedido, sem complicação
        </span>
      </div>
    </>
  );
}

export function MenuSection({ cart, change }) {
  const [category, setCategory] = useState("Todos");
  return (
    <section className="menu-section section-shell" id="cardapio">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ESCOLHA SUA PRÓXIMA PAUSA</span>
          <h2>
            O que vai ser hoje<span>?</span>
          </h2>
        </div>
        <p>
          Do salgado ao doce, tem uma
          <br />
          combinação esperando por você.
        </p>
      </div>
      <div className="menu-toolbar">
        <div className="category-tabs" aria-label="Filtrar cardápio">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="demo-label">
          <span /> Produtos e preços demonstrativos
        </span>
      </div>
      <div className="product-grid">
        {products
          .filter((p) => category === "Todos" || p.category === category)
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={change}
              quantity={cart[product.id] || 0}
            />
          ))}
      </div>
      <p className="menu-footnote">
        Cardápio fictício para apresentação. Produtos, preços e imagens precisam
        de confirmação pela empresa.
      </p>
    </section>
  );
}

export function About() {
  return (
    <section className="about-section" id="sobre">
      <div className="about-inner section-shell">
        <div className="about-art">
          <span className="eyebrow">TAPIOCA · BRASIL · BOAS PAUSAS</span>
          <div className="about-word">
            O simples
            <br />
            tem muito
            <br />
            <em>sabor.</em>
          </div>
          <div className="about-signature">
            <span /> ESTAÇÃO BR
          </div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">UMA PROPOSTA PARA A MARCA</span>
          <h2>
            Um pequeno intervalo.
            <br />
            Uma boa combinação.
          </h2>
          <p>
            Esta proposta coloca a tapioca no centro: uma base brasileira,
            combinações cheias de possibilidades e um jeito prático de escolher
            o que dá vontade.
          </p>
          <p>
            Da primeira olhada ao pedido, a ideia é deixar tudo mais próximo,
            mais fácil e com a cara da Tapioca Estação BR.
          </p>
          <span className="concept-note">
            Texto e identidade visual demonstrativos, sujeitos à aprovação da
            empresa.
          </span>
          <a
            href={business.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Conheça o perfil da marca <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const contact = whatsappUrl(
    business.whatsapp,
    "Olá! Gostaria de saber mais sobre a Tapioca Estação BR.",
  );
  return (
    <section className="contact-section section-shell" id="contato">
      <div>
        <span className="eyebrow">VAMOS CONTINUAR ESSA CONVERSA?</span>
        <h2>
          Sua próxima pausa
          <br />
          começa por aqui<span>.</span>
        </h2>
        <p>Acompanhe a Tapioca Estação BR no Instagram.</p>
      </div>
      <div className="contact-links">
        <a href={business.instagram} target="_blank" rel="noopener noreferrer">
          <Instagram size={25} />
          <span>
            <small>ENCONTRE A MARCA</small>@tapiocaestacaobr
          </span>
          <ArrowUpRight size={24} />
        </a>
        {contact ? (
          <a href={contact} target="_blank" rel="noopener noreferrer">
            <ShoppingBag size={25} />
            <span>
              <small>FALE COM A EQUIPE</small>WhatsApp
            </span>
            <ArrowUpRight size={24} />
          </a>
        ) : (
          <div className="contact-unavailable">
            <ShoppingBag size={25} />
            <span>
              <small>EM BREVE, MAIS PERTO</small>WhatsApp a configurar
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-top section-shell">
        <Brand />
        <nav aria-label="Navegação do rodapé">
          <a href="#cardapio">Cardápio</a>
          <a href="#sobre">Nossa proposta</a>
          <a href="#contato">Contato</a>
        </nav>
        <span>Uma pausa com sabor brasileiro.</span>
      </div>
      <div className="footer-bottom section-shell">
        <span>
          © {new Date().getFullYear()} · Tapioca Estação BR — proposta de site
        </span>
        <span>Protótipo demonstrativo · sem pedidos reais</span>
      </div>
    </footer>
  );
}
