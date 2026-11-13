import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcular, ErroCalculo } from '../src/calculos.ts'

function aproximado(valor: number, esperado: number) {
  assert.ok(Math.abs(valor - esperado) < 1e-10, `${valor} ≠ ${esperado}`)
}

test('tinta por litro: 60 m², duas demãos, 10 m²/L, 10% e 18 L', () => {
  const r = calcular('tinta', { area: 60, demaos: 2, rendimento: 10, margem: 10, embalagem: 18 })
  assert.equal(r.base, 12)
  aproximado(r.estimativa, 13.2)
  assert.equal(r.quantidade, 1)
  assert.equal(r.totalAdquirido, 18)
  aproximado(r.sobra, 4.8)
})

test('tinta por embalagem por demão: usa as demãos e converte mL para L', () => {
  const r = calcular('tinta', { area: '9,0', demaos: '2', rendimento: '10', modoRendimento: 'embalagem', embalagem: '900', unidadeEmbalagem: 'mL', margem: '0' })
  aproximado(r.estimativa, 1.62)
  assert.equal(r.tamanhoComercial, 0.9)
  assert.equal(r.quantidade, 2)
  assert.equal(r.totalAdquirido, 1.8)
})

test('tinta de rendimento acabado: paredes diferentes, aberturas e demãos já incluídas', () => {
  const r = calcular('tinta', { paredes: [{ comprimento: 4, altura: '2,5', quantidade: 2 }, { comprimento: '3.2', altura: 2.5 }], aberturas: 3, modoRendimento: 'acabada', demaos: 3, rendimento: 25, embalagem: '3,6' })
  assert.equal(r.area, 25)
  assert.equal(r.base, 3.6)
  assert.equal(r.quantidade, 1)
  assert.equal(r.detalhes['Área bruta (m²)'], 28)
})

test('piso: 20 m², 10%, cobertura de 2,2 m² e exatamente 10 caixas', () => {
  const r = calcular('piso', { area: 20, margem: 10, cobertura: '2,2' })
  assert.equal(r.estimativa, 22)
  assert.equal(r.quantidade, 10)
  assert.equal(r.sobra, 0)
})

test('piso: soma ambientes de medidas diferentes e multiplica grupos iguais', () => {
  assert.equal(calcular('piso', { ambientesDetalhados: [{ comprimento: 2, largura: 3, quantidade: 2 }, { comprimento: 4, largura: 2 }], cobertura: 2 }).area, 20)
  assert.equal(calcular('piso', { comprimento: '3,2', largura: '2,5', ambientes: 2, cobertura: 2 }).quantidade, 8)
})

test('tijolos: junta no eixo correspondente e face convertida de cm² para m²', () => {
  const r = calcular('tijolo', { comprimento: 4, altura: 3, aberturas: 1, blocoComprimento: 29, blocoAltura: 19, juntaVertical: '1', juntaHorizontal: '0,5', margem: 10 })
  assert.equal(r.area, 11)
  aproximado(r.detalhes['Área modular (m²)'] as number, 0.0585)
  aproximado(r.base, 11 / 0.0585)
  assert.equal(r.quantidade, 207)
  const padrao = calcular('tijolo', { comprimento: 1, altura: 1, blocoComprimento: 19, blocoAltura: 19, juntaVertical: 1, juntaHorizontal: 1 })
  assert.equal(padrao.quantidade, 25)
})

test('argamassa: 20 m², 5 kg/m², margem de 10%, 6 sacos de 20 kg', () => {
  const r = calcular('argamassa', { area: 20, consumo: 5, embalagem: 20, margem: 10 })
  assert.equal(r.base, 100)
  aproximado(r.estimativa, 110)
  assert.equal(r.quantidade, 6)
  assert.equal(r.totalAdquirido, 120)
})

test('rejunte usa consumo informado sem densidade presumida', () => {
  const r = calcular('rejunte', { area: 10, consumo: '0,25', embalagem: 1, margem: 0 })
  assert.equal(r.estimativa, 2.5)
  assert.equal(r.quantidade, 3)
  assert.equal(r.sobra, 0.5)
})

test('concreto: 4 × 3 × 10 cm são 1,2 m³ antes da margem', () => {
  for (const [espessura, unidadeEspessura] of [[10, 'cm'], [100, 'mm'], ['0,10', 'm']] as const) {
    const r = calcular('concreto', { comprimento: 4, largura: 3, espessura, unidadeEspessura })
    aproximado(r.base, 1.2)
    aproximado(r.quantidade, 1.2)
    assert.equal(r.unidadeComercial, 'm³')
  }
})

test('concreto: arredonda para o incremento do fornecedor quando informado', () => {
  const r = calcular('concreto', { comprimento: 4, largura: 3, espessura: 10, margem: 10, passoComercial: '0,25' })
  aproximado(r.estimativa, 1.32)
  assert.equal(r.quantidade, 1.5)
})

test('reboco: 30 m² por 2 cm são 0,6 m³; consumo industrializado é um modo separado', () => {
  const r = calcular('reboco', { area: 30, espessura: 2 })
  assert.equal(r.base, 0.6)
  assert.equal(r.quantidade, 0.6)
  assert.equal(r.unidadeTecnica, 'm³')
  const industrial = calcular('reboco', { modoReboco: 'consumo', area: 10, consumo: 4, embalagem: 15, margem: 10 })
  assert.equal(industrial.estimativa, 44)
  assert.equal(industrial.quantidade, 3)
  assert.equal(industrial.unidadeTecnica, 'kg')
})

test('rodapé: perímetro, desconto de vãos e equivalente em metros informados', () => {
  const dimensoes = calcular('rodape', { comprimento: 4, largura: 3, aberturas: 1, peca: '2,4', margem: 10 })
  const direto = calcular('rodape', { metros: 14, aberturas: 1, peca: '2,4', margem: 10 })
  assert.equal(dimensoes.base, 13)
  assert.equal(dimensoes.quantidade, 6)
  assert.deepEqual(dimensoes, direto)
})

test('arredondamento tolera apenas ruído numérico; uma fração acima exige outra caixa', () => {
  assert.equal(calcular('piso', { area: '0,3', cobertura: '0,1' }).quantidade, 3)
  assert.equal(calcular('piso', { area: '0,3000000001', cobertura: '0,1' }).quantidade, 4)
})

test('rejeita entradas vazias, negativas, exponenciais, ambíguas e não finitas', () => {
  for (const valor of ['', -10, '1e6', '1.000,5', Infinity, NaN, '10 m²']) {
    assert.throws(() => calcular('piso', { area: valor, cobertura: 2 }), ErroCalculo)
  }
})

test('rejeita zero como divisor e não aceita margem negativa ou acima de 100%', () => {
  assert.throws(() => calcular('argamassa', { area: 20, consumo: 5, embalagem: 0 }), ErroCalculo)
  assert.throws(() => calcular('tinta', { area: 20, demaos: 2, rendimento: 0, embalagem: 18 }), ErroCalculo)
  for (const margem of [-1, 101]) assert.throws(() => calcular('piso', { area: 20, cobertura: 2, margem }), ErroCalculo)
})

test('aberturas iguais ou maiores invalidam área ou comprimento líquido', () => {
  for (const aberturas of [10, 11]) {
    assert.throws(() => calcular('tinta', { area: 10, aberturas, demaos: 2, rendimento: 10, embalagem: 18 }), { campo: 'aberturas' })
    assert.throws(() => calcular('rodape', { metros: 10, aberturas, peca: 2 }), { campo: 'aberturas' })
  }
})

test('recusa contagens fracionárias, unidades inválidas, grupos vazios e escala extrema', () => {
  assert.throws(() => calcular('piso', { comprimento: 2, largura: 2, ambientes: '1,5', cobertura: 2 }), { campo: 'ambientes' })
  assert.throws(() => calcular('tinta', { paredes: [], demaos: 2, rendimento: 10, embalagem: 18 }), { campo: 'paredes' })
  assert.throws(() => calcular('concreto', { comprimento: 2, largura: 2, espessura: 20, unidadeEspessura: 'kg' }), { campo: 'unidadeEspessura' })
  assert.throws(() => calcular('concreto', { comprimento: 1e50, largura: 2, espessura: 10 }), { campo: 'comprimento' })
  assert.throws(() => calcular('concreto', { comprimento: 1e6, largura: 1e6, espessura: 100 }), { campo: 'resultado' })
})
