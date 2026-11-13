import {useId} from 'react';
import {calcular} from './calculos';
import {ferramentas,tipos,iniciais} from './ferramentas';
import type {TipoCalculo,Resultado} from './calculos';
import {numero,unidadePlural} from './orcamento';
import type {Rascunho,Medida} from './orcamento';
import {Icon} from './Icon';
export const aviso='Esta ferramenta fornece uma estimativa de materiais. Confirme as quantidades, especificações e condições de aplicação com a loja, o fabricante ou o profissional responsável pela obra.';
const novaMedida=():Medida=>({comprimento:'4',altura:'2,8',largura:'3',quantidade:'1'});
export function novo(tipo:TipoCalculo,area?:number):Rascunho{
 const valores=iniciais(tipo);if(tipo==='rodape')valores.metros='14';if(area&&'area' in valores)valores.area=String(area);
 return {tipo,valores,modo:'direto',medidas:[novaMedida()],contexto:''};
}
export function executar(r:Rascunho){
 const campos={...r.valores};
 if(r.tipo==='tinta'&&campos.modoRendimento==='acabada')delete campos.demaos;
 if(r.tipo==='piso'&&r.modo==='detalhado')delete campos.area;
 if(r.tipo==='rodape'&&r.modo==='direto'){delete campos.comprimento;delete campos.largura;}
 if(r.tipo==='rodape'&&r.modo==='detalhado')delete campos.metros;
 return calcular(r.tipo,{...campos,...(r.modo==='detalhado'&&r.tipo==='tinta'?{paredes:r.medidas.map(m=>({comprimento:m.comprimento,altura:m.altura??'',quantidade:m.quantidade}))}:{}),...(r.modo==='detalhado'&&r.tipo==='piso'?{ambientesDetalhados:r.medidas.map(m=>({comprimento:m.comprimento,largura:m.largura??'',quantidade:m.quantidade}))}:{})});
}
export function Calculadora({rascunho:r,onChange,onTipo,onSave,onQuote,editing}:{rascunho:Rascunho;onChange:(r:Rascunho)=>void;onTipo:(t:TipoCalculo)=>void;onSave:(result:Resultado)=>void;onQuote:(result:Resultado)=>void;editing:boolean}){
 const id=useId(), {tipo,valores,modo,medidas}=r, ferramenta=ferramentas[tipo];
 let resultado:Resultado|undefined, erro='';
 try{resultado=executar(r)}catch(e){erro=e instanceof Error?e.message:'Confira as medidas informadas.'}
 const isArea=tipo==='tinta'||tipo==='piso', isRodape=tipo==='rodape';
 const campos=ferramenta.campos.filter(c=>!(
  (isArea&&modo==='detalhado'&&c.id==='area')||
  (tipo==='tinta'&&valores.modoRendimento==='acabada'&&c.id==='demaos')||
  (isRodape&&modo==='direto'&&['comprimento','largura'].includes(c.id))||
  (tipo==='reboco'&&(valores.modoReboco==='consumo'?['espessura','unidadeEspessura','passoComercial'].includes(c.id):['consumo','embalagem'].includes(c.id)))
 ));
 if(isRodape&&modo==='direto')campos.unshift({id:'metros',label:'Comprimento linear total',unidade:'m',inicial:'14'});
 const mudar=(key:string,value:string)=>onChange({...r,valores:{...valores,[key]:value}});
 return <>
 <div className="calc-tabs" aria-label="Escolher calculadora">{tipos.map(t=><button key={t} className={tipo===t?'active':''} aria-pressed={tipo===t} onClick={()=>onTipo(t)}><Icon name={ferramentas[t].icone} size={19}/>{ferramentas[t].nome}</button>)}</div>
 <div className="calc-layout">
 <section className="panel calc-fields" aria-label={'Parâmetros de '+ferramenta.nome}>
 <div className="eyebrow">MEDIDAS DA OBRA</div><h2>{ferramenta.nome}</h2><p className="muted">Valores iniciais ilustrativos. Use as medidas da sua obra e os dados da embalagem.</p>
 {(isArea||isRodape)&&<fieldset className="mode"><legend>Como quer informar as medidas?</legend>{['direto','detalhado'].map(m=><label key={m}><input type="radio" name={id+'modo'} checked={modo===m} onChange={()=>onChange({...r,modo:m})}/>{m==='direto'?(isRodape?'Metros lineares':'Área conhecida'):(tipo==='tinta'?'Por parede':'Por ambiente')}</label>)}</fieldset>}
 {isArea&&modo==='detalhado'&&<div className="measurements">{medidas.map((m,i)=><fieldset key={i} className="measure"><legend>{tipo==='tinta'?'Parede':'Ambiente'} {i+1}</legend><div className="fields">{(['comprimento',tipo==='tinta'?'altura':'largura','quantidade'] as const).map(k=><label key={k}>{k==='quantidade'?'Quantidade':k==='altura'?'Altura (m)':k==='largura'?'Largura (m)':'Comprimento (m)'}<input inputMode={k==='quantidade'?'numeric':'decimal'} value={m[k]??''} onChange={e=>onChange({...r,medidas:medidas.map((x,j)=>j===i?{...x,[k]:e.target.value}:x)})}/></label>)}</div>{medidas.length>1&&<button className="text-button" onClick={()=>onChange({...r,medidas:medidas.filter((_,j)=>i!==j)})}>Remover {tipo==='tinta'?'parede':'ambiente'} {i+1}</button>}</fieldset>)}<button className="btn outline" disabled={medidas.length>=30} onClick={()=>onChange({...r,medidas:[...medidas,novaMedida()]})}><Icon name="plus" size={17}/>{tipo==='tinta'?'Adicionar parede':'Adicionar ambiente'}</button></div>}
 <div className="fields">{campos.map(c=><label key={c.id}>{c.label}{c.unidade?' ('+c.unidade+')':''}{c.opcoes?<select value={valores[c.id]??c.inicial} onChange={e=>mudar(c.id,e.target.value)}>{c.opcoes.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>:<input inputMode="decimal" value={valores[c.id]??c.inicial} onChange={e=>mudar(c.id,e.target.value)}/>}</label>)}{tipo==='tinta'&&<label>Tipo de superfície (opcional)<input maxLength={120} value={r.contexto} onChange={e=>onChange({...r,contexto:e.target.value})} placeholder="Ex.: parede interna com massa"/></label>}</div>
 <button className="text-button" onClick={()=>onChange({...novo(tipo),valores:Object.fromEntries(ferramenta.campos.map(c=>[c.id,c.opcoes?c.inicial:c.id==='margem'||c.id==='aberturas'?'0':'']).concat([['metros','']]))})}>Limpar campos</button>
 </section>
 <section className="panel calc-result" aria-label="Resultado estimado">
 <div className="eyebrow">RESULTADO ESTIMADO</div>
 {resultado?<><p className="result-number" aria-live="polite"><strong>{numero(resultado.quantidade)}</strong> {unidadePlural(resultado.unidadeComercial,resultado.quantidade)}</p>
 <p>Estimativa técnica: <b>{numero(resultado.estimativa)} {resultado.unidadeTecnica}</b></p>
 <dl>{Object.entries({...resultado.detalhes,["Antes da margem ("+resultado.unidadeTecnica+")"]:resultado.base,"Margem (%)":resultado.margem,["Total comercial ("+resultado.unidadeTecnica+")"]:resultado.totalAdquirido,["Sobra estimada ("+resultado.unidadeTecnica+")"]:resultado.sobra}).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{typeof v==='number'?numero(v):v}</dd></div>)}</dl>
 <details><summary>Como o resultado foi calculado</summary><p>{resultado.formula}</p></details>
 <button className="btn orange wide" onClick={()=>onSave(resultado)}><Icon name="plus" size={18}/>{editing?'Salvar revisão':'Adicionar à minha obra'}</button>
 <button className="btn outline wide" onClick={()=>onQuote(resultado)}>Adicionar e revisar orçamento</button>
 </>:<p className="error" role="status">{erro}</p>}
 {tipo==='piso'&&<p className="muted">Confira paginação, recortes e lote com a loja.</p>}
 {['tijolo','concreto','reboco'].includes(tipo)&&<p className="muted">Estimativa geométrica. Não define traço, resistência, armaduras ou dimensionamento estrutural.</p>}
 <p className="fine">{aviso}</p>
 </section></div></>;
}
