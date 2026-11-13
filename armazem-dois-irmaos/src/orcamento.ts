import type {TipoCalculo, Resultado} from './calculos';
export type Medida = {comprimento:string; altura?:string; largura?:string; quantidade:string};
export type Rascunho = {tipo:TipoCalculo; valores:Record<string,string>; modo:string; medidas:Medida[]; contexto:string};
export type Item = {id:string; titulo:string; grupo:string; especificacao:string; quantidade:number; unidade:string; produto?:string; calculo?:Rascunho; resultado?:Resultado};
export const chave='armazem-dois-irmaos-orcamento-v1';
export const numero=(n:number)=>n.toLocaleString('pt-BR',{maximumFractionDigits:5});
export const unidadePlural=(u:string,n:number)=>n===1?u:({embalagem:'embalagens',caixa:'caixas',saco:'sacos',unidade:'unidades',peça:'peças'} as Record<string,string>)[u]??u;
const texto=(v:unknown)=>typeof v==='string' && v.length<=2000;
export function restaurar(raw:string|null):Item[]{
 try {
  const data=JSON.parse(raw??'null');
  if(data?.versao!==1||!Array.isArray(data.itens))return [];
  return data.itens.slice(0,250).filter((x:Item)=>{
   if(!x||![x.id,x.titulo,x.grupo,x.especificacao,x.unidade].every(texto)||!Number.isFinite(x.quantidade)||x.quantidade<=0||x.quantidade>1e9)return false;
   if(x.produto!==undefined&&!texto(x.produto))return false;
   if(!x.calculo)return !x.resultado;
   const c=x.calculo,r=x.resultado;
   return Boolean(c&&r&&['tinta','piso','tijolo','argamassa','rejunte','concreto','reboco','rodape'].includes(c.tipo)&&texto(c.modo)&&texto(c.contexto)&&c.valores&&Object.values(c.valores).every(texto)&&Array.isArray(c.medidas)&&c.medidas.length<=30&&c.medidas.every(m=>m&&texto(m.comprimento)&&texto(m.quantidade)&&(m.altura===undefined||texto(m.altura))&&(m.largura===undefined||texto(m.largura)))&&Number.isFinite(r.estimativa)&&texto(r.unidadeTecnica)&&r.detalhes&&Object.values(r.detalhes).every(v=>texto(v)||Number.isFinite(v)));
  });
 } catch {return []}
}
export function adicionar(lista:Item[],item:Item):Item[]{
 const i=lista.find(x=>item.produto&&x.produto===item.produto&&x.unidade===item.unidade&&x.especificacao===item.especificacao);
 return i?lista.map(x=>x===i?{...x,quantidade:Math.min(1e9,x.quantidade+item.quantidade)}:x):lista.length<250?[...lista,item]:lista;
}
export function mensagem(lista:Item[],nome:string,local:string,notas:string,resumida=false){
 const grupos=new Map<string,Item[]>();
 for(const item of lista){const grupo=grupos.get(item.grupo);if(grupo)grupo.push(item);else grupos.set(item.grupo,[item]);}
 return ['Olá! Gostaria de solicitar um orçamento no Armazém Dois Irmãos.','*LISTA DE MATERIAIS*',
 ...Array.from(grupos,([grupo,itens])=>['*'+grupo+'*',...itens.map(i=>[
  '- '+i.titulo+': '+numero(i.quantidade)+' '+unidadePlural(i.unidade,i.quantidade)+(i.especificacao?' · '+i.especificacao:''),
  !resumida&&i.resultado?'  Estimativa: '+numero(i.resultado.estimativa)+' '+i.resultado.unidadeTecnica:'',
  !resumida&&i.resultado?Object.entries({...i.resultado.detalhes,'Margem (%)':i.resultado.margem}).map(([k,v])=>'  '+k+': '+(typeof v==='number'?numero(v):v)).join('\n'):'',
  !resumida&&i.calculo?.contexto?'  Superfície: '+i.calculo.contexto:'',
 ].filter(Boolean).join('\n'))].join('\n')),
 [nome.trim()&&'Nome: '+nome.trim(),local.trim()&&'Cidade ou bairro: '+local.trim(),notas.trim()&&'Observações: '+notas.trim()].filter(Boolean).join('\n'),
 'Podem confirmar as quantidades, os produtos disponíveis e os valores?'].filter(Boolean).join('\n\n');
}
export const urlWhatsApp=(numeroLoja:string,texto:string)=>'https://wa.me/'+numeroLoja+'?text='+encodeURIComponent(texto);
