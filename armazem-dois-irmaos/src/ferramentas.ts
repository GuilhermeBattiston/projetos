import type {TipoCalculo} from './calculos';
export type Campo = {id:string; label:string; unidade?:string; inicial:string; opcoes?:[string,string][]};
const f=(id:string,label:string,unidade:string,inicial:string):Campo=>({id,label,unidade,inicial});
const s=(id:string,label:string,inicial:string,opcoes:[string,string][]):Campo=>({id,label,inicial,opcoes});
const area=f('area','Área','m²','20'), perdas=f('margem','Margem de perda','%','10');
const comp=f('comprimento','Comprimento','m','4'), larg=f('largura','Largura','m','3');
const esp=f('espessura','Espessura','', '10'), ue=s('unidadeEspessura','Unidade da espessura','cm',[['mm','Milímetros'],['cm','Centímetros'],['m','Metros']]);
export const ferramentas:Record<TipoCalculo,{nome:string; desc:string; icone:string; campos:Campo[]}> = {
 tinta:{nome:'Tinta',desc:'Calcule litros e embalagens.',icone:'tintas',campos:[{...area,inicial:'60'},f('aberturas','Portas e janelas a descontar','m²','0'),f('demaos','Demãos','','2'),s('modoRendimento','Formato do rendimento','litro',[['litro','m²/L por demão'],['embalagem','m²/embalagem por demão'],['acabada','m² de pintura acabada por embalagem']]),f('rendimento','Rendimento da embalagem ou ficha','','10'),s('unidadeEmbalagem','Unidade da embalagem','L',[['L','Litros'],['mL','Mililitros']]),f('embalagem','Volume da embalagem','','18'),perdas]},
 piso:{nome:'Pisos e revestimentos',desc:'Converta área em caixas.',icone:'pisos',campos:[area,f('cobertura','Cobertura por caixa','m²','2,2'),perdas]},
 tijolo:{nome:'Tijolos e blocos',desc:'Estime unidades pela área da parede.',icone:'basica',campos:[comp,f('altura','Altura da parede','m','2,8'),f('aberturas','Aberturas a descontar','m²','0'),f('blocoComprimento','Comprimento da face','cm','19'),f('blocoAltura','Altura da face','cm','19'),f('juntaVertical','Junta vertical','cm','1'),f('juntaHorizontal','Junta horizontal','cm','1'),perdas]},
 argamassa:{nome:'Argamassa',desc:'Estime sacos pelo consumo da ficha.',icone:'cimentos',campos:[area,f('consumo','Consumo do fabricante','kg/m²','5'),f('embalagem','Peso do saco','kg','20'),perdas]},
 rejunte:{nome:'Rejunte',desc:'Estime embalagens pelo consumo.',icone:'acabamentos',campos:[area,f('consumo','Consumo do fabricante','kg/m²','0,3'),f('embalagem','Peso da embalagem','kg','1'),perdas]},
 concreto:{nome:'Concreto',desc:'Calcule volume sem dimensionar a estrutura.',icone:'cimentos',campos:[comp,larg,esp,ue,f('passoComercial','Incremento comercial (opcional)','m³',''),perdas]},
 reboco:{nome:'Reboco',desc:'Calcule volume ou consumo industrializado.',icone:'acabamentos',campos:[{...area,inicial:'30'},s('modoReboco','Modo de cálculo','volume',[['volume','Volume geométrico'],['consumo','Consumo industrializado']]),{...esp,inicial:'2'},ue,f('passoComercial','Incremento comercial (opcional)','m³',''),f('consumo','Consumo do fabricante','kg/m²',''),f('embalagem','Peso da embalagem','kg',''),perdas]},
 rodape:{nome:'Rodapé',desc:'Converta perímetro em peças.',icone:'pisos',campos:[comp,larg,f('aberturas','Trechos sem rodapé','m','0'),f('peca','Comprimento por peça','m','2,4'),perdas]},
};
export const tipos=Object.keys(ferramentas) as TipoCalculo[];
export const iniciais=(tipo:TipoCalculo)=>Object.fromEntries(ferramentas[tipo].campos.map(c=>[c.id,c.inicial]));
