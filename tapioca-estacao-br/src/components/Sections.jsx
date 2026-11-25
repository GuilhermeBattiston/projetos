import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Instagram,
  Clock,
  Heart,
  Search,
  MapPin,
} from "lucide-react";
import { Brand } from "./Header";
import ProductCard, { ProductImage } from "./ProductCard";
import { products, categories, categoryInfo } from "../data/products";
import { business } from "../config";
import { whatsappUrl } from "../utils/order";
export function Hero({ onOrder }) {
  const hero = products.find((p) => p.slug === "tapioca-charque-mussarela");
  return (
    <>
      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="little-line" />
            SABOR E TRADIÇÃO
          </span>
          <h1>
            Faça uma parada
            <br />
            <em>cheia de sabor.</em>
          </h1>
          <p>
            A verdadeira tapioca feita na hora. Escolha entre os sabores do
            nosso cardápio e monte seu pedido do seu jeito.
          </p>
          <div className="hero-buttons">
            <a className="button primary" href="#cardapio">
              Ver cardápio <ArrowUpRight size={19} />
            </a>
            <button className="button outline" onClick={onOrder}>
              Fazer meu pedido <ShoppingBag size={19} />
            </button>
          </div>
          <div className="hero-note">
            <Clock size={22} />
            <span>
              Feita na hora, pra você!
              <small>Da escolha ao pedido, sem complicação.</small>
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <ProductImage product={hero} eager />
          <div className="hero-caption">
            <span>CHARQUE COM MUSSARELA</span>
            <small>Imagem ilustrativa do sabor</small>
          </div>
        </div>
      </section>
      <div className="values-strip">
        <div className="section-shell">
          <span>
            <Clock size={18} />
            Feita na hora
          </span>
          <span>
            <Heart size={18} />
            Sabor e tradição
          </span>
          <span>
            <ShoppingBag size={18} />
            Seu pedido pelo WhatsApp
          </span>
        </div>
      </div>
    </>
  );
}
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function MenuSection({ onSelect }) {
  const [category, setCategory] = useState("Todos"),
    [search, setSearch] = useState("");
  const filtered = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      normalize(p.name + " " + p.description).includes(normalize(search)),
  );
  return (
    <section className="menu-section section-shell" id="cardapio">
      <div className="section-heading">
        <div>
          <span className="eyebrow">UMA VONTADE. VÁRIOS SABORES.</span>
          <h2>
            Nosso cardápio<span>.</span>
          </h2>
        </div>
        <label className="search">
          <Search size={20} />
          <input
            aria-label="Buscar por nome ou ingrediente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Encontre seu sabor"
          />
          {search && (
            <button aria-label="Limpar busca" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </label>
      </div>
      <div
        className="category-tabs"
        role="group"
        aria-label="Categorias do cardápio"
      >
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            style={
              /** @type {import('react').CSSProperties} */ ({
                "--category": categoryInfo[c]?.color ?? "#FFB515",
              })
            }
          >
            {c}
          </button>
        ))}
      </div>
      <p className="results" role="status">
        {filtered.length} opções encontradas
      </p>
      {filtered.length ? (
        categories.slice(1).map((c) => {
          const items = filtered.filter((p) => p.category === c);
          return items.length ? (
            <section
              className="menu-category"
              key={c}
              style={
                /** @type {import('react').CSSProperties} */ ({
                  "--category": categoryInfo[c].color,
                })
              }
              aria-label={c}
            >
              <div className="category-heading">
                <h3>{c}</h3>
                <span>{items.length} opções</span>
              </div>
              {c === "Sanduíches" && (
                <p className="category-caption">Mistos quentes</p>
              )}
              <div className="product-grid">
                {items.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={() => onSelect(p)}
                  />
                ))}
              </div>
            </section>
          ) : null;
        })
      ) : (
        <div className="empty-search">
          <h3>Esse sabor não apareceu.</h3>
          <p>Experimente outro nome ou ingrediente.</p>
          <button
            className="button primary"
            onClick={() => {
              setSearch("");
              setCategory("Todos");
            }}
          >
            Ver todo o cardápio
          </button>
        </div>
      )}
      <p className="menu-footnote">
        Fotos ilustrativas. Consulte a disponibilidade e as condições de entrega
        com o atendimento.
      </p>
    </section>
  );
}
export function About() {
  return (
    <section className="about-section" id="sobre">
      <div className="about-inner section-shell">
        <div className="about-art">
          <img
            src={business.logoHero}
            width="420"
            height="420"
            alt="Estação da Tapioca"
            loading="lazy"
          />
        </div>
        <div className="about-copy">
          <span className="eyebrow">SABOR E TRADIÇÃO</span>
          <h2>
            A tapioca é feita
            <br />
            <em>na hora, pra você.</em>
          </h2>
          <p>
            Todas as tapiocas são feitas na hora com ingredientes frescos e de
            qualidade.
          </p>
          <p>
            <b>Tempero:</b> orégano, pimenta-do-reino e azeite. Se preferir,
            selecione “sem tempero” ao escolher sua tapioca.
          </p>
          <a className="inline-link" href="#cardapio">
            Encontrar meu sabor <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
export function Contact() {
  return (
    <section className="contact-section section-shell" id="contato">
      <div>
        <span className="eyebrow">FAÇA SEU PEDIDO</span>
        <h2>
          Uma parada.
          <br />
          <em>Muito sabor.</em>
        </h2>
        <p>
          Peça pelo WhatsApp. Também entregamos pelo{" "}
          {business.deliveryPlatforms.join(" e pela ")}.
        </p>
        <div
          className="delivery-platforms"
          aria-label="Outros canais de delivery"
        >
          {business.deliveryPlatforms.map((platform) => (
            <span key={platform}>{platform}</span>
          ))}
        </div>
        <div className="location-card">
          <MapPin size={23} />
          <div>
            <h3>Onde estamos</h3>
            <address>{business.address}</address>
            <a
              className="inline-link"
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no mapa
            </a>
          </div>
        </div>
        <p className="fine">
          Consulte a área atendida e a taxa de entrega com o atendimento.
        </p>
      </div>
      <div className="contact-links">
        {business.phones.map((p) => (
          <a
            key={p.number}
            href={whatsappUrl(
              p.number,
              "Olá! Gostaria de fazer um pedido na Estação da Tapioca.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShoppingBag size={25} />
            <span>
              <small>{p.name}</small>
              {p.formatted}
            </span>
            <ArrowUpRight size={23} />
          </a>
        ))}
        <a href={business.instagram} target="_blank" rel="noopener noreferrer">
          <Instagram size={25} />
          <span>
            <small>INSTAGRAM</small>
            {business.instagramHandle}
          </span>
          <ArrowUpRight size={23} />
        </a>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-top section-shell">
        <Brand footer />
        <nav aria-label="Navegação do rodapé">
          <a href="#cardapio">Cardápio</a>
          <a href="#sobre">Sabor e tradição</a>
          <a href="#contato">Delivery</a>
        </nav>
        <div className="footer-location">
          <span>A verdadeira tapioca feita na hora!</span>
          <address>{business.address}</address>
          <p>Também entregamos pelo iFood e pela 99.</p>
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© {new Date().getFullYear()} · Estação da Tapioca</span>
        <span>O pedido só é confirmado pelo atendimento.</span>
      </div>
    </footer>
  );
}
