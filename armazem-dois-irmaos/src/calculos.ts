export type TipoCalculo = 'tinta' | 'piso' | 'tijolo' | 'argamassa' | 'rejunte' | 'concreto' | 'reboco' | 'rodape'
type Numero = number | string
export type Parede = { comprimento: Numero; altura: Numero; quantidade?: Numero }
export type Ambiente = { comprimento: Numero; largura: Numero; quantidade?: Numero }
export type Campos = Record<string, Numero | readonly Parede[] | readonly Ambiente[] | undefined>

export interface Resultado {
  base: number
  estimativa: number
  unidadeTecnica: string
  quantidade: number
  unidadeComercial: string
  tamanhoComercial: number | null
  totalAdquirido: number
  sobra: number
  area?: number
  margem: number
  detalhes: Record<string, string | number>
  formula: string
}

const LIMITE_ENTRADA = 1_000_000
const LIMITE_RESULTADO = 1_000_000_000
const LIMITE_GRUPOS = 100
const DECIMAL = /^\+?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/

export class ErroCalculo extends Error {
  readonly campo: string

  constructor(campo: string, mensagem: string) {
    super(mensagem)
    this.name = 'ErroCalculo'
    this.campo = campo
  }
}

interface Regra {
  minimo?: number
  maximo?: number
  inteiro?: boolean
  padrao?: number
}

const ausente = (valor: unknown) => valor === undefined || (typeof valor === 'string' && !valor.trim())

function ler(valor: unknown, campo: string, nome: string, regra: Regra = {}): number {
  if (ausente(valor)) {
    if (regra.padrao !== undefined) return regra.padrao
    throw new ErroCalculo(campo, `Informe ${nome}.`)
  }
  const texto = typeof valor === 'string' ? valor.trim() : ''
  const n = typeof valor === 'number' ? valor : DECIMAL.test(texto) ? Number(texto.replace(',', '.')) : NaN
  if (!Number.isFinite(n)) throw new ErroCalculo(campo, `Use um número válido para ${nome}, com vírgula ou ponto decimal.`)
  const minimo = regra.minimo ?? 0.000001
  const maximo = regra.maximo ?? LIMITE_ENTRADA
  if (n < minimo || n > maximo) {
    throw new ErroCalculo(campo, `Informe ${nome} entre ${minimo.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} e ${maximo.toLocaleString('pt-BR')}.`)
  }
  if (regra.inteiro && !Number.isInteger(n)) throw new ErroCalculo(campo, `Informe um número inteiro para ${nome}.`)
  return n
}

function escolha(c: Campos, campo: string, opcoes: readonly string[], padrao: string): string {
  const valor = ausente(c[campo]) ? padrao : c[campo]
  if (typeof valor !== 'string' || !opcoes.includes(valor)) throw new ErroCalculo(campo, 'Selecione uma unidade ou modalidade válida.')
  return valor
}

function desconto(bruto: number, aberturas: number, unidade: 'área' | 'metragem'): number {
  if (aberturas >= bruto) throw new ErroCalculo('aberturas', `As aberturas devem ser menores que a ${unidade} total.`)
  return bruto - aberturas
}

function dimensoes(
  grupos: readonly Parede[] | readonly Ambiente[],
  segundo: 'altura' | 'largura',
  campo: 'paredes' | 'ambientesDetalhados',
): number {
  if (grupos.length < 1 || grupos.length > LIMITE_GRUPOS) {
    throw new ErroCalculo(campo, `Informe de 1 a ${LIMITE_GRUPOS} grupos de medidas.`)
  }
  return grupos.reduce((soma, grupo, i) => {
    if (!grupo || typeof grupo !== 'object') throw new ErroCalculo(campo, `Revise as medidas do grupo ${i + 1}.`)
    const medida = segundo === 'altura' && 'altura' in grupo ? grupo.altura : segundo === 'largura' && 'largura' in grupo ? grupo.largura : undefined
    const c = ler(grupo.comprimento, campo, `o comprimento do grupo ${i + 1}`)
    const l = ler(medida, campo, `a ${segundo} do grupo ${i + 1}`)
    const n = ler(grupo.quantidade, campo, `a quantidade do grupo ${i + 1}`, { minimo: 1, maximo: 10_000, inteiro: true, padrao: 1 })
    return soma + c * l * n
  }, 0)
}

// Compensa apenas a imprecisão do ponto flutuante perto de um inteiro.
// Não arredonda a estimativa, nem elimina diferenças comerciais significativas.
function teto(valor: number): number {
  const inteiro = Math.round(valor)
  const tolerancia = Number.EPSILON * Math.max(1, Math.abs(valor)) * 4
  return inteiro >= 1 && Math.abs(inteiro - valor) <= tolerancia ? inteiro : Math.ceil(valor)
}

function concluir(opcoes: {
  base: number; margem: number; unidadeTecnica: string; unidadeComercial: string;
  tamanhoComercial: number | null; area?: number; detalhes?: Resultado['detalhes']; formula: string;
}): Resultado {
  const { base, margem, unidadeTecnica, unidadeComercial, tamanhoComercial, area, detalhes, formula } = opcoes
  const estimativa = base * (1 + margem / 100)
  const pacotes = tamanhoComercial === null ? null : teto(estimativa / tamanhoComercial)
  const totalAdquirido = pacotes === null || tamanhoComercial === null ? estimativa : pacotes * tamanhoComercial
  const quantidade = unidadeComercial === 'm³' || pacotes === null ? totalAdquirido : pacotes
  if ([base, estimativa, quantidade, totalAdquirido, ...(area === undefined ? [] : [area])].some(n => !Number.isFinite(n) || n <= 0 || n > LIMITE_RESULTADO)) {
    throw new ErroCalculo('resultado', 'O resultado excede o limite desta ferramenta ou não é positivo. Revise as unidades e medidas informadas.')
  }
  return { base, estimativa, margem, unidadeTecnica, unidadeComercial, quantidade, tamanhoComercial,
    totalAdquirido, sobra: Math.max(0, totalAdquirido - estimativa), area, detalhes: detalhes ?? {}, formula }
}

export function calcular(tipo: TipoCalculo, c: Campos): Resultado {
  const num = (campo: string, nome: string, regra?: Regra) => ler(c[campo], campo, nome, regra)
  const margem = num('margem', 'a margem de perda (%)', { minimo: 0, maximo: 100, padrao: 0 })
  const aberturas = (u: string) => num('aberturas', `a medida das aberturas (${u})`, { minimo: 0, padrao: 0 })
  const metragem = () => num('comprimento', 'o comprimento (m)') * num('largura', 'a largura (m)')
  const espessura = () => {
    const unidade = escolha(c, 'unidadeEspessura', ['m', 'cm', 'mm'], 'cm')
    return num('espessura', `a espessura (${unidade})`) / (unidade === 'm' ? 1 : unidade === 'cm' ? 100 : 1000)
  }
  const passo = () => ausente(c.passoComercial) ? null : num('passoComercial', 'o incremento comercial (m³)')
  const consumo = () => {
    const area = num('area', 'a área de aplicação (m²)')
    const coeficiente = num('consumo', 'o consumo do fabricante (kg/m²)')
    const embalagem = num('embalagem', 'o peso da embalagem (kg)')
    return concluir({ base: area * coeficiente, margem, unidadeTecnica: 'kg',
      unidadeComercial: tipo === 'rejunte' ? 'embalagem' : 'saco', tamanhoComercial: embalagem, area,
      detalhes: { 'Área (m²)': area, 'Consumo informado (kg/m²)': coeficiente, 'Peso por embalagem (kg)': embalagem },
      formula: 'Área × consumo informado; acrescente a margem uma vez e arredonde para cima (kg necessários ÷ kg por embalagem).' })
  }

  switch (tipo) {
    case 'tinta': {
      const bruto = Array.isArray(c.paredes) ? dimensoes(c.paredes, 'altura', 'paredes') : num('area', 'a área bruta (m²)')
      const aberturasM2 = aberturas('m²')
      const area = desconto(bruto, aberturasM2, 'área')
      const modo = escolha(c, 'modoRendimento', ['litro', 'embalagem', 'acabada'], 'litro')
      const unidade = escolha(c, 'unidadeEmbalagem', ['L', 'mL'], 'L')
      const volume = num('embalagem', `o volume da embalagem (${unidade})`) / (unidade === 'mL' ? 1000 : 1)
      const rendimento = num('rendimento', 'o rendimento informado pelo fabricante')
      const demaos = modo === 'acabada' ? 1 : num('demaos', 'o número de demãos', { minimo: 1, maximo: 100, inteiro: true })
      const base = area * demaos / rendimento * (modo === 'litro' ? 1 : volume)
      const unidadeRendimento = modo === 'litro' ? 'm²/L por demão' : modo === 'embalagem' ? 'm²/embalagem por demão' : 'm² acabados/embalagem'
      const formulaBase = modo === 'litro' ? 'Área líquida × demãos ÷ rendimento por litro' : modo === 'embalagem' ? 'Área líquida × demãos ÷ rendimento por embalagem × volume da embalagem' : 'Área líquida ÷ rendimento acabado por embalagem × volume da embalagem (não multiplica por demãos)'
      const superficie = typeof c.superficie === 'string' && c.superficie.trim() ? c.superficie.trim().slice(0, 120) : undefined
      return concluir({ base, margem, unidadeTecnica: 'L', unidadeComercial: 'embalagem', tamanhoComercial: volume, area,
        detalhes: { 'Área bruta (m²)': bruto, 'Aberturas (m²)': aberturasM2, 'Área líquida (m²)': area,
          Demãos: modo === 'acabada' ? 'Já incluídas no rendimento' : demaos,
          [`Rendimento (${unidadeRendimento})`]: rendimento, 'Volume por embalagem (L)': volume, ...(superficie ? { Superfície: superficie } : {}) },
        formula: `${formulaBase}. Aplique a margem uma vez e arredonde para cima (litros necessários ÷ litros por embalagem).` })
    }
    case 'piso': {
      const area = Array.isArray(c.ambientesDetalhados) ? dimensoes(c.ambientesDetalhados, 'largura', 'ambientesDetalhados')
        : !ausente(c.area) ? num('area', 'a área total (m²)')
          : metragem() * num('ambientes', 'a quantidade de ambientes iguais', { minimo: 1, maximo: 10_000, inteiro: true, padrao: 1 })
      const cobertura = num('cobertura', 'a área coberta por caixa (m²)')
      return concluir({ base: area, margem, unidadeTecnica: 'm²', unidadeComercial: 'caixa', tamanhoComercial: cobertura, area,
        detalhes: { 'Área total (m²)': area, 'Cobertura por caixa (m²)': cobertura },
        formula: 'Some as áreas dos ambientes, aplique a margem e arredonde para cima (área necessária ÷ cobertura por caixa). Considere recortes, paginação e lotes.' })
    }
    case 'tijolo': {
      const bruto = num('comprimento', 'o comprimento da parede (m)') * num('altura', 'a altura da parede (m)')
      const area = desconto(bruto, aberturas('m²'), 'área')
      const bc = num('blocoComprimento', 'o comprimento da face do bloco (cm)')
      const ba = num('blocoAltura', 'a altura da face do bloco (cm)')
      const jv = num('juntaVertical', 'a espessura da junta vertical (cm)', { minimo: 0, maximo: bc, padrao: 0 })
      const jh = num('juntaHorizontal', 'a espessura da junta horizontal (cm)', { minimo: 0, maximo: ba, padrao: 0 })
      const modulo = (bc + jv) * (ba + jh) / 10_000
      return concluir({ base: area / modulo, margem, unidadeTecnica: 'un.', unidadeComercial: 'unidade', tamanhoComercial: 1, area,
        detalhes: { 'Área líquida (m²)': area, 'Área modular (m²)': modulo, 'Blocos por m²': 1 / modulo, 'Comprimento da face (cm)': bc, 'Altura da face (cm)': ba, 'Junta vertical (cm)': jv, 'Junta horizontal (cm)': jh },
        formula: 'Área líquida ÷ área modular [(comprimento + junta vertical) × (altura + junta horizontal)], convertida para m². Aplique a margem e arredonde a contagem para cima. Não substitui paginação nem projeto estrutural.' })
    }
    case 'argamassa':
    case 'rejunte':
      return consumo()
    case 'concreto': {
      const area = metragem()
      const camada = espessura()
      const incremento = passo()
      return concluir({ base: area * camada, margem, unidadeTecnica: 'm³', unidadeComercial: 'm³', tamanhoComercial: incremento, area,
        detalhes: { 'Área da base (m²)': area, 'Espessura (m)': camada, ...(incremento === null ? {} : { 'Incremento comercial (m³)': incremento }) },
        formula: 'Comprimento × largura × espessura, em metros; acrescente a margem. Volume geométrico somente: não dimensiona espessura, traço, resistência ou armadura.' })
    }
    case 'reboco': {
      const modo = escolha(c, 'modoReboco', ['volume', 'consumo'], 'volume')
      if (modo === 'consumo') return consumo()
      const area = num('area', 'a área da superfície (m²)')
      const camada = espessura()
      const incremento = passo()
      return concluir({ base: area * camada, margem, unidadeTecnica: 'm³', unidadeComercial: 'm³', tamanhoComercial: incremento, area,
        detalhes: { 'Área da superfície (m²)': area, 'Espessura da camada (m)': camada, ...(incremento === null ? {} : { 'Incremento comercial (m³)': incremento }) },
        formula: 'Área × espessura em metros; acrescente a margem. O volume não é convertido automaticamente em cimento, areia ou sacos.' })
    }
    case 'rodape': {
      const bruto = !ausente(c.metros) ? num('metros', 'a metragem linear bruta (m)') : 2 * (num('comprimento', 'o comprimento do ambiente (m)') + num('largura', 'a largura do ambiente (m)'))
      const liquido = desconto(bruto, aberturas('m'), 'metragem')
      const peca = num('peca', 'o comprimento por peça (m)')
      return concluir({ base: liquido, margem, unidadeTecnica: 'm', unidadeComercial: 'peça', tamanhoComercial: peca,
        detalhes: { 'Metragem bruta (m)': bruto, 'Trecho a revestir (m)': liquido, 'Comprimento por peça (m)': peca },
        formula: 'Perímetro [2 × (comprimento + largura)] ou metragem direta, menos aberturas. Aplique a margem e arredonde para cima (metragem necessária ÷ comprimento por peça).' })
    }
    default:
      throw new ErroCalculo('tipo', 'Selecione uma calculadora válida.')
  }
}
