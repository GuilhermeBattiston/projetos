import test from 'node:test';
import assert from 'node:assert/strict';
import {adicionar,mensagem,restaurar,urlWhatsApp} from '../src/orcamento.ts';
import {calcular} from '../src/calculos.ts';
import {filtrarProdutos,produtos,loja} from '../src/catalogo.ts';
import type {Item} from '../src/orcamento.ts';
const saco:Item={id:'a',produto:'cimento-50',titulo:'Cimento',grupo:'Cimentos',especificacao:'50 kg',quantidade:2,unidade:'saco'};
test('busca sem acento e interseção com departamento',()=>{
 assert.equal(produtos.length,30);
 assert.ok(filtrarProdutos('ceramico','basica').length>0);
 assert.equal(filtrarProdutos('ceramico','eletrica').length,0);
});
test('agrupa mesmo SKU e mesma embalagem; conserva especificações distintas',()=>{
 assert.equal(adicionar([saco],{...saco,id:'b',quantidade:3})[0].quantidade,5);
 assert.equal(adicionar([saco],{...saco,id:'b',especificacao:'25 kg'}).length,2);
});
test('mantém cálculo editável após persistir e rejeita versões/dados inválidos',()=>{
 const valores={area:'60',demaos:'2',rendimento:'10',modoRendimento:'litro',embalagem:'18',margem:'10'};
 const tinta:Item={id:'t',titulo:'Tinta',grupo:'Pintura',especificacao:'18 L',unidade:'embalagem',quantidade:1,calculo:{tipo:'tinta',valores,modo:'direto',medidas:[],contexto:''},resultado:calcular('tinta',valores)};
 assert.deepEqual(restaurar(JSON.stringify({versao:1,itens:[saco,tinta]})),[saco,tinta]);
 assert.deepEqual(restaurar('{'),[]);
 assert.deepEqual(restaurar(JSON.stringify({versao:2,itens:[saco]})),[]);
 assert.deepEqual(restaurar(JSON.stringify({versao:1,itens:[{...saco,quantidade:-1}]})),[]);
});
test('mensagem combina grupos, omite campos vazios e codifica acentos e separadores',()=>{
 const texto=mensagem([saco,{...saco,id:'b',titulo:'Piso',grupo:'Pisos',unidade:'caixa',especificacao:'2,2 m²'}],'','Centro','A&B + ? #');
 assert.ok(texto.includes('*Cimentos*'));assert.ok(texto.includes('*Pisos*'));assert.ok(!texto.includes('Nome:'));
 const url=new URL(urlWhatsApp(loja.whatsapp,texto));
 assert.equal(url.hostname,'wa.me');assert.equal(url.searchParams.get('text'),texto);
});
