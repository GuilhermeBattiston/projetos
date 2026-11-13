# Memória técnica das estimativas de materiais

O motor em `src/calculos.ts` é determinístico: não usa API, IA, preço, disponibilidade ou parâmetros de estoque. As referências abaixo fundamentam unidades e métodos, não a disponibilidade dos exemplos no Armazém Dois Irmãos. Use as dimensões da obra e a ficha do produto efetivamente escolhido. As fórmulas são estimativas de compra; não são projeto, especificação ou orientação de execução estrutural.

## Regras comuns

- Valores decimais aceitam vírgula ou ponto, sem separador de milhares. As unidades são informadas ao lado de cada campo. Conversões: cm ÷ 100, mm ÷ 1.000, cm² ÷ 10.000, mL ÷ 1.000.
- `base` é a necessidade antes da perda. `estimativa` = `base × (1 + margem/100)`. A margem é aplicada uma única vez, entre 0% e 100%, sem taxa presumida no motor.
- `quantidade` é a unidade comercial. Para caixas, sacos, embalagens e peças, divide-se a estimativa pelo tamanho comercial e arredonda-se para cima. A implementação corrige apenas o erro numérico de ponto flutuante junto de um inteiro; a estimativa técnica não é arredondada no motor.
- `tamanhoComercial` é o conteúdo em unidade técnica por embalagem/caixa/saco/peça, ou o incremento de venda em m³ (nulo quando não informado). `totalAdquirido` é expresso na unidade técnica; `sobra` é a diferença estimada após a margem. Volume sem incremento comercial permanece em m³ decimais.
- Campos indispensáveis vazios, zeros como divisores, negativos, contagens fracionárias e aberturas que deixam área ou metragem nula são recusados. Os limites computacionais são de 1.000.000 por entrada e 1.000.000.000 por quantidade/área resultante, além de limites de grupos. São proteções do protótipo, não critérios técnicos para a obra.

## Fórmulas e fontes

### Tinta

Área líquida `A` (m²) = área bruta (informada ou `Σ comprimento × altura × quantidade` de cada grupo) menos as aberturas totais. `D` = demãos; `R` = rendimento informado; `V` = volume da embalagem em L:

| Unidade do rendimento | Necessidade em litros |
|---|---:|
| m²/L por demão | `A × D / R` |
| m²/embalagem por demão | `A × D / R × V` |
| m² acabados/embalagem | `A / R × V` |

Escolha a unidade exatamente como aparece no rótulo. No rendimento acabado, as demãos já estão incorporadas e não devem multiplicar a estimativa. Rendimento por embalagem exige o rendimento da embalagem selecionada. A superfície é contexto, sem coeficiente presumido de absorção. As referências da Suvinil demonstram a medição com desconto de portas/janelas e a diferença entre [rendimento por demão](https://cdn.suvinil.com.br/institucional/dotnet/upload/2021/bt_suvinil-esmalte-multissuperficies_2021_pt.pdf) e [rendimento acabado](https://cdn.suvinil.com.br/institucional/dotnet/upload/2021/bt_suvinil-rende-e-cobre-muito_2021_pt_v2.pdf); ver também [medição e explicação do rendimento](https://www.suvinil.com.br/blog/como-calcular-tinta).

### Piso

Área = `Σ comprimento × largura × quantidade`, ou área total informada. Caixas = `ceil(área com margem / m² por caixa)`. A cobertura vem da embalagem escolhida. A margem depende de recortes, paginação e das peças de reposição desejadas. Confira o lote e a tonalidade. Base: [Manual do Especificador Portobello, seção 3.4 sobre paginação e perdas](https://www.portobello.com.br/produtos/download/6123/ManualdoEspecificadorPortobellorev082020.pdf).

### Tijolo/bloco

Área da parede = `comprimento × altura − aberturas` em m². Módulo = `(comprimento da face + junta vertical) × (altura da face + junta horizontal) / 10.000`, com entradas em cm. Contagem técnica = `área da parede / módulo`; unidades comerciais = teto após margem. A largura (espessura da parede) não compõe a face no cálculo da área. Um bloco de face 19 × 19 cm com juntas de 1 cm forma módulo de 0,04 m² e estimativa de 25 peças/m², coerente com a ordem de grandeza do [catálogo da Cerâmica Rex](https://ceramicarex.com.br/produtos/). Não calcula amarração, modulação detalhada, argamassa de junta, capacidade de carga ou segurança estrutural.

### Argamassa e rejunte

Massa = `área (m²) × consumo informado (kg/m²)`. Unidades = `ceil(massa com margem / peso da embalagem em kg)`. Para argamassa, consulte consumo do produto e método de aplicação: o [boletim Quartzolit Cimentcola Interno, item 8](https://www.quartzolit.weber/files/br/2026-05/01._cimentcola_interno.pdf) diferencia consumos de camada simples e dupla. Para rejunte, obtenha o consumo para o revestimento e a junta reais na [ficha ou calculadora do fabricante](https://www.quartzolit.weber/ajuda-e-dicas-para-construir/tudo-sobre-os-tipos-de-rejuntes-e-suas-funcoes/dicas-importantes-sobre-rejuntes). O motor não aplica densidade ou consumo universal. Se o rótulo fornecer faixa de consumo, escolha o parâmetro correspondente à aplicação com o fabricante.

### Concreto e reboco geométrico

Concreto: `comprimento × largura × espessura` com as três medidas em metros; reboco: `área da superfície (m²) × espessura (m)`. A espessura é sempre informada pelo usuário. Quando o fornecedor tiver incremento comercial, arredonda-se o volume com margem para cima ao múltiplo desse incremento. O volume é apenas geométrico, como exemplificado no [memorial público da Prefeitura de Sorocaba](https://www.sorocaba.sp.gov.br/anexos/Obras%20Publicas/%2FObras%20-%20Construcao%20de%20Viadutos%2C%20Pontes%20e%20Obras%20de%20Mobilidade%2FObras%20Concluidas%2FCPL%20788%202018%20-%20Viaduto%20Av.%20Itavuvu%2F2021%2F2021.10%20-%20Outubro/MEMORIAL%20DE%20C%C3%81LCULO%2010%C2%B0%20MED.%2001-09-2021%20%C3%80%2030-09-2021%20-%20REV%200.pdf). Não infere traço, resistência, espessura necessária, armaduras, fundações ou componentes da mistura.

No modo de **reboco industrializado**, a massa segue a fórmula de consumo (kg/m²) acima. Se a ficha fornecer kg por cm de espessura por m², converta para kg/m² na espessura da sua aplicação antes de informar. Exemplo dessa unidade: [Multimassa Quartzolit, seção Consumo](https://www.quartzolit.weber/argamassas-e-rejuntes-quartzolit/argamassas-e-revestimentos-decorativos/mutimassa-uso-geral-quartzolit). Volume em m³ e massa em kg são modos independentes, sem conversão por densidade presumida.

### Rodapé

Metragem líquida = `2 × (comprimento + largura) − vãos` ou `metragem direta − vãos`, em metros lineares. Peças = `ceil(metragem com margem / comprimento de cada peça)`. As portas são descontadas apenas se não receberem rodapé; se a metragem informada já estiver líquida, deixe o desconto em zero. A [orientação de instalação Santa Luzia, desenho de perímetro e seções de corte](https://cdn2.madeiramadeira.com.br/atributo/santa-luzia/696981-manual-instalacao-rodapes-santaluzia-2021.pdf) descreve a medição por lados. O resultado não otimiza plano de corte ou aproveitamento de sobras.

## Exemplos de verificação

| Ferramenta | Cenário | Resultado |
|---|---|---|
| Tinta | 60 m², 2 demãos, 10 m²/L por demão, 10%, 18 L | 12 L antes da perda; 13,2 L estimados; 1 embalagem |
| Tinta acabada | 25 m², 25 m² acabados por embalagem de 3,6 L, 0% | 3,6 L; 1 embalagem |
| Piso | 20 m², 10%, 2,2 m²/caixa | 22 m²; 10 caixas |
| Tijolo | 1 m², face 19 × 19 cm, juntas de 1 cm, 0% | 25 unidades |
| Argamassa | 20 m², 5 kg/m² demonstrativos, 10%, 20 kg/saco | 110 kg; 6 sacos |
| Rejunte | 10 m², 0,25 kg/m² demonstrativos, 0%, 1 kg/embalagem | 2,5 kg; 3 embalagens |
| Concreto | 4 × 3 m, 10 cm, 0%, sem incremento | 1,2 m³ |
| Reboco | 30 m², 2 cm, 0% | 0,6 m³ |
| Rodapé | 4 × 3 m, 1 m de vãos, 10%, peças de 2,4 m | 13 m líquidos, 14,3 m com margem; 6 peças |

Validação automatizada: `node --test armazem-dois-irmaos/tests/calculos.test.ts` a partir da raiz. Os exemplos não substituem quantidades, especificações ou condições definidas pela loja, pelo fabricante ou pelo profissional responsável pela obra.
