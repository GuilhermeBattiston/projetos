import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, Menu, X, Plus, Minus, MapPin, Phone, MessageCircle, MoveUpRight } from 'lucide-react';
import { company, asset, whatsappUrl } from './config.js';
import { gallery, services, steps } from './content.js';
const links = [['sobre', 'A empresa'], ['servicos', 'Atuação'], ['referencias', 'Referências'], ['contato', 'Contato']];

function Brand({ footer = false }) {
  return <a className={`brand${footer ? ' brand-footer' : ''}`} href="#inicio" aria-label="Lucas Construções, início"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span><span><strong>LUCAS<span className="brand-dot">.</span></strong><small>CONSTRUÇÕES & REFORMAS</small></span></a>;
}
function QuoteLink({ children = 'Solicitar orçamento', className = '', subject = '' }) {
  return <a className={`button ${className}`} href={whatsappUrl(subject)} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={19} aria-hidden="true" /></a>;
}
function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const nav = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
      if (event.key === 'Tab' && nav.current && window.innerWidth < 900) {
        const items = [button.current, ...nav.current.querySelectorAll('a')];
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
      }
    };
    const outside = (event) => { if (!event.target.closest('header')) setOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header className="header"><div className="container nav-layout"><Brand /><button ref={button} className="menu-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="main-nav" ref={nav} className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navegação principal">{links.map(([id, text]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{text}</a>)}<QuoteLink className="nav-quote" /></nav></div></header>;
}
function Hero() {
  return <section className="hero container" id="inicio" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><span /> EMPREITEIRA EM CURITIBA, PR</div><h1 id="hero-title">Sua obra começa{' '}<br />com uma <span>boa{' '}<br className="desktop-break" /> escolha.</span></h1><p>Construções e reformas em Curitiba.{' '}<br className="desktop-break" /> Conte o que você tem em mente.{' '}<br className="desktop-break" /> Vamos conversar sobre o seu projeto.</p><div className="hero-actions"><QuoteLink /><a className="text-link" href="#sobre">Conhecer a empresa <ArrowDown size={16} aria-hidden="true" /></a></div><div className="hero-bottom"><span className="small-cross" aria-hidden="true">+</span><span>DO PRIMEIRO CONTATO{' '}<br /><strong>À SUA PRÓXIMA IDEIA.</strong></span></div></div><figure className="hero-media"><div className="image-corner" aria-hidden="true">L / C</div><img src={asset('obra.webp')} alt="Referência ilustrativa de uma residência em construção, com concreto aparente e alvenaria de tijolos." width="1536" height="1024" fetchPriority="high" /><figcaption><span>01 / CONSTRUIR NOVAS POSSIBILIDADES</span><span>Imagem ilustrativa</span></figcaption></figure><div className="hero-side" aria-hidden="true">CONSTRUÇÃO · REFORMA · NOVOS ESPAÇOS</div></section>;
}
function About() {
  return <section className="about section container" id="sobre"><div className="section-label"><span>01 / A EMPRESA</span><span className="section-line" /></div><div className="about-grid"><h2>Um novo olhar{' '}<br />para o seu <span>espaço.</span></h2><div className="about-copy"><p className="large-copy">Construir ou reformar é dar um próximo passo. E tudo começa por entender o que você precisa.</p><p>A Lucas Construções e Reformas em Geral é uma empreiteira localizada no bairro Santa Cândida, em Curitiba. Este é o espaço para conhecer a empresa e iniciar uma conversa sobre construção e reforma.</p><p>Tem uma ideia, uma necessidade ou um ambiente que precisa mudar? Entre em contato e consulte a possibilidade de atendimento para o seu projeto.</p><a href="#contato" className="text-link">Vamos conversar <ArrowUpRight size={17} aria-hidden="true" /></a></div></div><div className="about-foot"><span><MapPin size={17} aria-hidden="true" /> CURITIBA, PARANÁ</span><span>CONSTRUÇÕES E REFORMAS EM GERAL</span></div></section>;
}
function Services() {
  const [active, setActive] = useState(0);
  return <section className="services section" id="servicos"><div className="container"><div className="section-label"><span>02 / POSSIBILIDADES</span><span className="section-line" /></div><div className="services-grid"><div className="services-intro"><h2>O que você{' '}<br />quer <span>construir?</span></h2><p>Cada espaço tem um ponto de partida.{' '}<br />Encontre o seu e comece a conversa.</p><div className="editorial-note"><span>UMA PROPOSTA DE ATUAÇÃO</span><p>Categorias ilustrativas, pendentes de confirmação com a empresa. Consulte a disponibilidade de cada serviço.</p></div><div className="line-mark" aria-hidden="true"><i /><i /><i /></div></div><div className="service-list">{services.map((service, index) => <article key={service.title} className={active === index ? 'service active' : 'service'}><h3><button aria-expanded={active === index} aria-controls={`service-${index}`} id={`service-title-${index}`} onClick={() => setActive(active === index ? null : index)}><span className="service-number">0{index + 1}</span><span>{service.title}</span>{active === index ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}</button></h3><div id={`service-${index}`} role="region" aria-labelledby={`service-title-${index}`} hidden={active !== index}><p>{service.text}</p><QuoteLink className="service-link" subject={service.subject}>Conversar sobre esta ideia</QuoteLink></div></article>)}</div></div></div></section>;
}
function Gallery() {
  const [filter, setFilter] = useState('Todas');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);
  const close = () => { dialog.current?.close(); setSelected(null); trigger.current?.focus(); };
  return <section className="references section container" id="referencias"><div className="section-label"><span>03 / REFERÊNCIAS VISUAIS</span><span className="section-line" /></div><div className="references-top"><h2>Espaços que abrem{' '}<br /><span>novas ideias.</span></h2><p>Materiais, formas e possibilidades.{' '}<br />Uma seleção visual para inspirar a conversa{' '}<br className="desktop-break" /> sobre o que você quer fazer.</p></div><div className="gallery-toolbar"><div className="filters" role="group" aria-label="Filtrar referências">{['Todas', 'Construção', 'Interiores', 'Detalhes'].map((category) => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div><span className="gallery-notice">REFERÊNCIAS ILUSTRATIVAS · NÃO SÃO OBRAS DA EMPRESA</span></div><div className="gallery-grid">{gallery.filter((item) => filter === 'Todas' || filter === item.category).map((item) => <figure className={`gallery-item gallery-${item.id}`} key={item.id}><button className="gallery-open" aria-label={`Ampliar referência: ${item.title}`} onClick={(event) => { trigger.current = event.currentTarget; setSelected(item); }}><img src={asset(item.image)} alt={item.description} width="1200" height="1000" loading="lazy" /><span className="gallery-zoom"><Plus size={21} aria-hidden="true" /></span><span className="image-label">ILUSTRATIVA</span></button><figcaption><span><small>{item.category}</small><strong>{item.title}</strong></span><MoveUpRight size={20} aria-hidden="true" /></figcaption></figure>)}</div><p className="gallery-disclaimer">Imagens geradas para esta apresentação. O portfólio será composto por fotografias reais após envio e autorização da empresa.</p><dialog ref={dialog} className="lightbox" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === dialog.current) close(); }} aria-labelledby="lightbox-title"><button className="lightbox-close" onClick={close} aria-label="Fechar imagem"><X aria-hidden="true" /></button>{selected && <><img src={asset(selected.image)} alt={selected.description} /><div className="lightbox-caption"><h3 id="lightbox-title">{selected.title}</h3><p>{selected.description}</p></div></>}</dialog></section>;
}
function Process() {
  return <section className="process section"><div className="container"><div className="section-label"><span>04 / POR ONDE COMEÇAR</span><span className="section-line" /></div><div className="process-heading"><h2>Antes da obra,{' '}<br /><span>uma boa conversa.</span></h2><p>Não precisa ter todas as respostas.{' '}<br />Comece contando a sua ideia.</p></div><div className="steps">{steps.map(([title, text], index) => <article key={title}><div className="step-index"><span>0{index + 1}</span>{index < 2 ? <ArrowRight size={23} aria-hidden="true" /> : <MessageCircle size={23} aria-hidden="true" />}</div><h3>{title}</h3><p>{text}</p></article>)}</div><p className="process-note">Sugestão de primeiro contato. Condições, etapas e disponibilidade devem ser combinadas diretamente com a empresa.</p></div></section>;
}
function Contact() {
  return <section className="contact section container" id="contato"><div className="section-label"><span>05 / VAMOS CONVERSAR</span><span className="section-line" /></div><div className="contact-grid"><div><h2>De Curitiba.{' '}<br />Para a sua{' '}<br /><span>próxima ideia.</span></h2><p>Fale com a Lucas Construções e Reformas em Geral e conte o que você pretende construir ou reformar.</p><a className="phone-link" href={`tel:+${company.phone}`}><Phone size={21} aria-hidden="true" />{company.phoneLabel}<ArrowUpRight size={21} aria-hidden="true" /></a><QuoteLink className="contact-button">Conversar pelo WhatsApp</QuoteLink></div><aside className="address-panel" aria-labelledby="address-title"><div className="address-top"><MapPin size={23} aria-hidden="true" /><span>ONDE ESTAMOS</span><span>PR / BR</span></div><div className="address-type" aria-hidden="true">CTB<span>CURITIBA / PARANÁ / BRASIL</span></div><div className="address-details"><h3 id="address-title">Santa Cândida</h3><address>{company.address}{' '}<br />{company.neighborhood}{' '}<br />CEP {company.cep}</address><a className="text-link" href={company.maps} target="_blank" rel="noopener noreferrer">Ver endereço no Google Maps <ArrowUpRight size={19} aria-hidden="true" /></a></div></aside></div></section>;
}
function Footer() {
  return <><section className="final-cta"><div className="container"><span className="eyebrow">O SEU PROJETO COMEÇA AQUI</span><div><h2>Pensando em construir{' '}<br />ou <span>reformar?</span></h2><QuoteLink className="button-light">Solicitar orçamento</QuoteLink></div></div></section><footer className="footer container"><div className="footer-top"><Brand footer /><nav aria-label="Navegação do rodapé">{links.map(([id, text]) => <a key={id} href={`#${id}`}>{text}</a>)}</nav><a href={`tel:+${company.phone}`}>{company.phoneLabel}<ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {company.name}.</span><span>Curitiba, Paraná</span><a href="#inicio">Voltar ao início ↑</a></div><p className="prototype-note">Protótipo de apresentação comercial. Identidade visual proposta; informações de contato fornecidas no material de referência e sujeitas à confirmação. Serviços sugeridos e imagens ilustrativas.</p></footer></>;
}
export default function App() {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><div className="topline"><div className="container"><span>CONSTRUÇÕES & REFORMAS EM GERAL</span><span>CURITIBA, PARANÁ <span className="top-dot" /></span></div></div><Header /><main id="conteudo"><Hero /><About /><Services /><Gallery /><Process /><Contact /></main><Footer /></>;
}
