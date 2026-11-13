import {useEffect,useRef,useState} from 'react';
import {departamentos,filtrarProdutos,loja,produtos} from './catalogo';
import type {Produto} from './catalogo';
import {Calculadora,novo} from './Calculadora';
import {ferramentas,tipos} from './ferramentas';
import type {TipoCalculo,Resultado} from './calculos';
import {adicionar,chave,mensagem,numero,restaurar,urlWhatsApp} from './orcamento';
import type {Item} from './orcamento';
import {Icon} from './Icon';
const dep=(id:string)=>departamentos.find(d=>d.id===id)?.nome??id;
const rotas=['inicio','catalogo','calculadoras','planejar','orcamento','contato'] as const;
type Rota=typeof rotas[number];
const rota=()=>rotas.find(r=>r===location.hash.slice(1))??'inicio';
const objetivos:Record<string,TipoCalculo[]>={'Pintar um ambiente':['tinta'],'Trocar o piso':['piso','argamassa','rejunte'],'Construir uma parede':['tijolo','reboco'],'Reformar um cômodo':['tinta','piso','argamassa','rejunte','rodape']};
function Marca(){return <a className="brand" href="#inicio"><span className="mark"><Icon name="basica" size={27}/></span><span><small>ARMAZÉM</small><strong>DOIS IRMÃOS</strong></span></a>}
function Card({p,onOpen}:{p:Produto;onOpen:()=>void}){return <article className="product"><button className={'product-art art-'+p.departamento} aria-label={'Ver detalhes: '+p.nome} onClick={onOpen}><Icon name={p.departamento} size={72}/></button><div className="product-copy"><span className="tag">{dep(p.departamento)}</span><h3>{p.nome}</h3><p>{p.embalagem}</p><button className="btn outline wide" onClick={onOpen}>Consultar valor <Icon name="arrow" size={16}/></button></div></article>}
function ProdutoDialog({produto:p,onClose,onAdd}:{produto:Produto;onClose:()=>void;onAdd:(p:Produto,q:number)=>void}){
 const dialog=useRef<HTMLDialogElement>(null);const [q,setQ]=useState('1');
 useEffect(()=>{const d=dialog.current;d?.showModal();return ()=>d?.close()},[]);
 return <dialog ref={dialog} onCancel={onClose} aria-labelledby="produto-titulo"><div className="dialog-body"><button className="close" aria-label="Fechar detalhes" onClick={onClose}>×</button><p className="eyebrow">PRODUTO DEMONSTRATIVO</p><h2 id="produto-titulo">{p.nome}</h2><p>{p.descricao}</p><ul>{p.caracteristicas.map(c=><li key={c}>{c}</li>)}</ul><p><b>{p.embalagem}</b> · Unidade: {p.unidade}</p><form onSubmit={e=>{e.preventDefault();onAdd(p,Number(q));onClose()}}><label>Quantidade<input type="number" min="1" max="1000000" step="1" required value={q} onChange={e=>setQ(e.target.value)}/></label><button className="btn orange wide">Adicionar ao orçamento</button></form></div></dialog>
}
function Quantidade({item,onChange}:{item:Item;onChange:(q:number)=>void}){
 const [value,setValue]=useState(String(item.quantidade).replace('.',','));
 return <label className="quantity">Quantidade solicitada<input aria-label={'Quantidade de '+item.titulo} inputMode="decimal" value={value} onChange={e=>{const v=e.target.value;setValue(v);const n=Number(v.replace(',','.'));if(/^\d+(?:[.,]\d+)?$/.test(v)&&n>0&&n<=1e9&&(item.unidade==='m³'||Number.isInteger(n)))onChange(n)}} onBlur={()=>setValue(String(item.quantidade).replace('.',','))}/></label>
}
function Orcamento({itens,onEdit,onRemove,onQty,onClear,onCopy}:{itens:Item[];onEdit:(i:Item)=>void;onRemove:(id:string)=>void;onQty:(id:string,q:number)=>void;onClear:()=>void;onCopy:(copiado:boolean)=>void}){
 const [nome,setNome]=useState(''),[local,setLocal]=useState(''),[notas,setNotas]=useState(''),[resumida,setResumida]=useState(false);
 const [confirmar,setConfirmar]=useState(false);
 const completa=mensagem(itens,nome,local,notas), curta=mensagem(itens,nome,local,notas,true);
 const longa=urlWhatsApp(loja.whatsapp,completa).length>1800;
 const preview=resumida?curta:completa;
 return itens.length?<div className="quote-layout"><div>
 {[...new Set(itens.map(i=>i.grupo))].map(grupo=><section className="panel quote-group" key={grupo}><h2>{grupo}</h2>{itens.filter(i=>i.grupo===grupo).map(i=><article key={i.id} className="quote-item"><h3>{i.titulo}</h3><p>{i.especificacao||i.unidade}</p>{i.resultado&&<p className="muted">Estimativa técnica: {numero(i.resultado.estimativa)} {i.resultado.unidadeTecnica}</p>}<div className="quote-actions"><Quantidade key={i.id+'-'+(i.resultado?.quantidade??'catalogo')} item={i} onChange={q=>onQty(i.id,q)}/>{i.calculo&&<button className="text-button" onClick={()=>onEdit(i)}>Revisar cálculo</button>}<button className="text-button" onClick={()=>onRemove(i.id)}>Remover</button></div></article>)}</section>)}
 {confirmar?<div className="confirm"><p>Remover todos os materiais da lista?</p><button className="btn orange" onClick={()=>{onClear();setConfirmar(false)}}>Confirmar limpeza</button> <button className="btn outline" onClick={()=>setConfirmar(false)}>Cancelar</button></div>:<button className="text-button" onClick={()=>setConfirmar(true)}>Limpar lista</button>}
 </div><section className="panel quote-preview"><div className="eyebrow">REVISE ANTES DE ABRIR</div><h2>Mensagem de orçamento</h2><div className="fields"><label>Nome (opcional)<input value={nome} onChange={e=>setNome(e.target.value)} maxLength={80}/></label><label>Cidade ou bairro (opcional)<input value={local} onChange={e=>setLocal(e.target.value)} maxLength={100}/></label></div><label>Observações (opcional)<textarea value={notas} onChange={e=>setNotas(e.target.value)} maxLength={300} rows={2}/></label>
 {longa&&<label className="check"><input type="checkbox" checked={resumida} onChange={e=>setResumida(e.target.checked)}/>Visualizar versão resumida</label>}
 <label>Prévia da mensagem<textarea readOnly value={preview} rows={9}/></label>
 <button className="btn outline wide" onClick={async()=>{try{await navigator.clipboard.writeText(completa);onCopy(true)}catch{setResumida(false);onCopy(false)}}}>Copiar texto completo</button>
 {urlWhatsApp(loja.whatsapp,longa?curta:completa).length<=1800?<a className="btn orange wide" target="_blank" rel="noopener noreferrer" href={urlWhatsApp(loja.whatsapp,longa?curta:completa)}><Icon name="chat" size={18}/>Abrir WhatsApp {longa?'com resumo':''}</a>:<p className="muted">A lista é longa demais para o link. Copie o texto e cole manualmente após confirmar o contato.</p>}
 <p className="fine">Número demonstrativo: {loja.telefone}. Confirme o contato antes de enviar. Abrir o WhatsApp não envia a mensagem.</p></section></div>:<div className="panel empty"><Icon name="list" size={38}/><h2>Sua lista está vazia</h2><p>Adicione produtos ou resultados das calculadoras para começar.</p><a className="btn orange" href="#catalogo">Explorar catálogo</a></div>
}
export default function App(){
 const [pagina,setPagina]=useState<Rota>(rota),[menu,setMenu]=useState(false);
 const [busca,setBusca]=useState(''),[departamento,setDepartamento]=useState('todos'),[caracteristica,setCaracteristica]=useState('todas');
 const [produto,setProduto]=useState<Produto|null>(null);
 const [itens,setItens]=useState<Item[]>(()=>{try{return restaurar(localStorage.getItem(chave))}catch{return []}});
 const [aviso,setAviso]=useState(''),[storageError,setStorageError]=useState(false);
 const [rascunho,setRascunho]=useState(()=>novo('tinta')),[editando,setEditando]=useState<string|null>(null);
 const [guia,setGuia]=useState<{nome:string;passos:TipoCalculo[];atual:number;area?:number}|null>(null);
 const heading=useRef<HTMLElement>(null);
 useEffect(()=>{function trocar(){setPagina(rota());setMenu(false);window.scrollTo(0,0);heading.current?.focus({preventScroll:true})}window.addEventListener('hashchange',trocar);return()=>window.removeEventListener('hashchange',trocar)},[]);
 useEffect(()=>{try{localStorage.setItem(chave,JSON.stringify({versao:1,itens}));setStorageError(false)}catch{setStorageError(true)}},[itens]);
 useEffect(()=>{if(!aviso)return;const t=window.setTimeout(()=>setAviso(''),3600);return()=>clearTimeout(t)},[aviso]);
 const ir=(dest:Rota)=>{if(location.hash!=='#'+dest)location.hash=dest;else window.scrollTo(0,0)};
 const calc=(t:TipoCalculo,area?:number)=>{setRascunho(novo(t,area));setEditando(null);ir('calculadoras')};
 const abrirCalc=(t:TipoCalculo)=>{setGuia(null);calc(t)};
 const abrirCatalogo=(d='todos',q='')=>{setDepartamento(d);setBusca(q);setCaracteristica('todas');ir('catalogo')};
 function incluirProduto(p:Produto,q:number){setItens(x=>adicionar(x,{id:crypto.randomUUID(),produto:p.id,titulo:p.nome,grupo:dep(p.departamento),especificacao:p.embalagem,unidade:p.unidade,quantidade:q}));setAviso('Produto adicionado à Minha obra.')}
 function salvar(r:Resultado,review=false){
  const t=ferramentas[rascunho.tipo].nome;
  const item:Item={id:editando??crypto.randomUUID(),titulo:t,grupo:rascunho.tipo==='tinta'?'Pintura':t,especificacao:r.unidadeComercial==='m³'?(r.tamanhoComercial===null?'Volume a confirmar':'Incremento de '+numero(r.tamanhoComercial)+' m³'):r.unidadeComercial==='unidade'?'Face e junta conforme cálculo':numero(r.tamanhoComercial??1)+' '+r.unidadeTecnica+' por '+r.unidadeComercial,quantidade:r.quantidade,unidade:r.unidadeComercial,calculo:rascunho,resultado:r};
  setItens(x=>editando?x.map(i=>i.id===editando?item:i):adicionar(x,item));setEditando(null);setAviso('Estimativa salva na Minha obra.');
  if(review){setGuia(null);ir('orcamento');return}
  if(guia){const atual=guia.atual+1,area=r.area??guia.area;if(atual<guia.passos.length){setGuia({...guia,atual,area});calc(guia.passos[atual],area);return}
   setGuia(null);setAviso('Etapas concluídas. Confira sua lista de materiais.');ir('orcamento');
  }else if(editando)ir('orcamento');
 }
 const resultados=filtrarProdutos(busca,departamento,caracteristica);
 const caracteristicas=[...new Set(filtrarProdutos('',departamento).flatMap(p=>p.caracteristicas))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const nav=[['inicio','Início'],['catalogo','Catálogo'],['calculadoras','Calculadoras'],['planejar','Planeje sua obra'],['contato','Sobre e contato']] as const;
 return <>
 <a className="skip" href="#conteudo" onClick={e=>{e.preventDefault();heading.current?.focus()}}>Pular para o conteúdo</a>
 <div className="top"><div className="wrap"><span><Icon name="pin" size={15}/> {loja.cidade}</span><span>Apresentação comercial · Catálogo demonstrativo</span></div></div>
 <header><div className="wrap mast"><Marca/><button className="menu-toggle" aria-label={menu?'Fechar menu':'Abrir menu'} aria-expanded={menu} aria-controls="navegacao" onClick={()=>setMenu(m=>!m)}><Icon name="menu"/></button><nav id="navegacao" className={menu?'nav open':'nav'} aria-label="Principal">{nav.map(([id,label])=><a key={id} href={'#'+id} aria-current={pagina===id?'page':undefined} onClick={()=>setMenu(false)}>{label}</a>)}</nav><a className="quote-nav" href="#orcamento" aria-label={'Minha obra: '+itens.length+' itens'}><Icon name="list" size={21}/><span>Minha obra</span><b>{itens.length}</b></a></div>
 <div className="searchbar"><div className="wrap search-row"><button className="depart-btn" onClick={()=>abrirCatalogo()}><Icon name="menu" size={19}/>Departamentos</button><form role="search" onSubmit={e=>{e.preventDefault();abrirCatalogo('todos',busca)}}><Icon name="search" size={21}/><input aria-label="Buscar no catálogo" placeholder="O que você precisa para sua obra?" value={busca} onChange={e=>setBusca(e.target.value)}/><button>Buscar</button></form><a href="#contato" className="contact-short"><Icon name="chat" size={21}/> WhatsApp</a></div></div></header>
 <main className="wrap" id="conteudo" tabIndex={-1} ref={heading}>
 {pagina==='inicio'&&<>
 <section className="hero"><div className="hero-copy"><p className="hero-label"><span></span> BOM CONSELHO · PERNAMBUCO</p><h1>Tudo para a sua construção.</h1><p>Encontre os materiais, calcule o quanto vai precisar e monte seu orçamento em um só lugar.</p><div className="hero-actions"><button className="btn orange" onClick={()=>abrirCalc('tinta')}><Icon name="calc" size={19}/> Calcular materiais</button><a className="btn ghost" href="#catalogo">Ver catálogo <Icon name="arrow" size={18}/></a></div></div><div className="hero-art"><img src={import.meta.env.BASE_URL+'obra.webp'} alt="Tijolos, sacos e ferramentas em bancada de obra; imagem ilustrativa" width={1100} height={720} fetchPriority="high"/><small>IMAGEM ILUSTRATIVA</small></div></section>
 <div className="steps"><div><Icon name="search"/><span><b>Encontre</b><small>Explore os departamentos</small></span></div><div><Icon name="calc"/><span><b>Calcule</b><small>Estime as quantidades</small></span></div><div><Icon name="list"/><span><b>Monte o orçamento</b><small>Organize sua lista em um lugar</small></span></div></div>
 <section className="section"><div className="section-head"><div><p className="eyebrow">DO BÁSICO AO ACABAMENTO</p><h2>Compre por departamento</h2></div><a className="text-button" href="#catalogo">Ver catálogo <Icon name="arrow" size={17}/></a></div><div className="depts">{departamentos.map(d=><button key={d.id} onClick={()=>abrirCatalogo(d.id)}><span><Icon name={d.icone} size={30}/></span><b>{d.nome}</b></button>)}</div></section>
 <section className="section"><div className="section-head"><div><p className="eyebrow">CATÁLOGO DEMONSTRATIVO</p><h2>Materiais para começar</h2></div></div><div className="products">{['cimento-50','tinta-18','piso-60','bloco-ceramico'].map(id=>produtos.find(p=>p.id===id)).filter((p):p is Produto=>!!p).map(p=><Card key={p.id} p={p} onOpen={()=>setProduto(p)}/>)}</div></section>
 <section className="section tools-section"><div className="section-head"><div><p className="eyebrow">PLANEJAMENTO NA PRÁTICA</p><h2>Calculadoras de materiais</h2></div><a className="text-button" href="#planejar">Começar com um guia <Icon name="arrow" size={17}/></a></div><div className="tool-grid">{tipos.map(t=><button key={t} onClick={()=>abrirCalc(t)}><Icon name={ferramentas[t].icone}/><b>{ferramentas[t].nome}</b><span>{ferramentas[t].desc}</span><Icon name="arrow" size={18}/></button>)}</div></section></>}
 {pagina==='catalogo'&&<><div className="page-title"><p className="eyebrow">MATERIAIS DE CONSTRUÇÃO</p><h1>Catálogo</h1><p>Seleção demonstrativa. Consulte valores e disponibilidade com a loja.</p></div><div className="filter panel"><label>Pesquisar produtos<input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Ex.: cimento, tinta, 20 kg"/></label><label>Departamento<select value={departamento} onChange={e=>{setDepartamento(e.target.value);setCaracteristica('todas')}}><option value="todos">Todos</option>{departamentos.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}</select></label><label>Característica<select value={caracteristica} onChange={e=>setCaracteristica(e.target.value)}><option value="todas">Todas</option>{caracteristicas.map(c=><option key={c}>{c}</option>)}</select></label></div><p role="status" className="muted">{resultados.length} produtos encontrados</p>{resultados.length?<div className="products">{resultados.map(p=><Card key={p.id} p={p} onOpen={()=>setProduto(p)}/>)}</div>:<div className="panel empty"><h2>Nenhum produto encontrado</h2><button className="btn outline" onClick={()=>abrirCatalogo()}>Limpar filtros</button></div>}</>}
 {pagina==='calculadoras'&&<><div className="page-title"><p className="eyebrow">{guia?guia.nome+' · ETAPA '+(guia.atual+1)+' DE '+guia.passos.length:'PLANEJE ANTES DE COMPRAR'}</p><h1>{editando?'Revisar estimativa':'Calculadoras de materiais'}</h1><p>Transforme as medidas da obra em quantidades para o orçamento.</p></div><Calculadora rascunho={rascunho} onChange={setRascunho} onTipo={abrirCalc} onSave={salvar} onQuote={r=>salvar(r,true)} editing={!!editando}/>{guia?.nome==='Pintar um ambiente'&&<p><button className="text-button" onClick={()=>abrirCatalogo('tintas')}>Explorar rolos, pincéis e outros acessórios opcionais</button></p>}</>}
 {pagina==='planejar'&&<><div className="page-title"><p className="eyebrow">ASSISTENTE DE PLANEJAMENTO</p><h1>Planeje sua obra</h1><p>Escolha um objetivo. Vamos organizar as etapas de cálculo para você.</p></div><div className="tool-grid">{Object.entries(objetivos).map(([nome,passos])=><button key={nome} onClick={()=>{setGuia({nome,passos,atual:0});calc(passos[0])}}><Icon name={ferramentas[passos[0]].icone}/><b>{nome}</b><span>{passos.map(t=>ferramentas[t].nome).join(' · ')}</span><Icon name="arrow" size={18}/></button>)}<button onClick={()=>abrirCatalogo()}><Icon name="list"/><b>Preparar lista personalizada</b><span>Escolha itens diretamente no catálogo</span></button></div></>}
 {pagina==='orcamento'&&<><div className="page-title"><p className="eyebrow">LISTA DE ORÇAMENTO</p><h1>Minha obra</h1><p>Revise materiais, quantidades e medidas antes de pedir valores.</p></div>{storageError&&<p className="error" role="status">O navegador não permite salvar a lista neste dispositivo.</p>}<Orcamento itens={itens} onEdit={i=>{if(i.calculo){setGuia(null);setRascunho(i.calculo);setEditando(i.id);ir('calculadoras')}}} onRemove={id=>setItens(x=>x.filter(i=>i.id!==id))} onQty={(id,q)=>setItens(x=>x.map(i=>i.id===id?{...i,quantidade:q}:i))} onClear={()=>setItens([])} onCopy={copiado=>setAviso(copiado?'Mensagem copiada. Nenhum contato foi acionado.':'Cópia indisponível. Selecione e copie o texto da prévia.')}/></>}
 {pagina==='contato'&&<><div className="page-title"><p className="eyebrow">SOBRE E CONTATO</p><h1>{loja.nome}</h1><p>{loja.slogan}</p></div><div className="contact-grid"><section className="panel"><Icon name="pin"/><h2>Localização</h2><p>{loja.endereco}<br/>{loja.cidade}</p><a className="btn outline" href={loja.mapa} target="_blank" rel="noopener noreferrer">Buscar endereço no mapa</a></section><section className="panel"><Icon name="chat"/><h2>WhatsApp</h2><p>{loja.telefone} · número demonstrativo a confirmar</p><a className="btn orange" href={'https://wa.me/'+loja.whatsapp} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a></section></div></>}
 </main><footer><div className="wrap foot"><Marca/><div><b>{loja.slogan}</b><p>{loja.cidade} · {loja.endereco}</p></div><div><a href="#contato">Sobre e contato</a><p>Protótipo demonstrativo · WebForge</p></div></div></footer>
 <div role="status" className={aviso?'toast show':'toast'}>{aviso}</div>
 {produto&&<ProdutoDialog key={produto.id} produto={produto} onClose={()=>setProduto(null)} onAdd={incluirProduto}/>}
 </>;
}
