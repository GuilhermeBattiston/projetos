# Estação da Tapioca

Atualização do aplicativo existente em React 19 + Vite. Nome oficial, logotipo original e cardápio fornecido foram integrados; o slug técnico `tapioca-estacao-br` foi preservado.

## Versão para apresentação — 25/11/2026

Endereço informado pelo responsável: **Travessa Maria Ramos, Garanhuns, Brasil — CEP 55292-700**, com acesso à busca no mapa. Entregas também pelo **iFood e pela 99**, exibidas como informação sem links, conforme solicitado. Textos de apresentação/demonstração foram removidos da interface; a opção demonstrativa de retirada não é exibida. O catálogo mantém os 27 itens, preços oficiais, identidade original e pedidos pelo WhatsApp.

## Executar e conferir

Requer Node 22.12 ou superior. Dentro desta pasta:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Abra `http://127.0.0.1:5175/`. Verificações:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

TypeScript verifica o JavaScript/JSX com `checkJs`. O build estático fica em `dist/`.

## Marca

Original sem redesenho: `public/brand/logo-original.jpeg`. Cardápio impresso: `public/brand/cardapio-original.jpeg`. Um teste confere o SHA-256 do logotipo original. Versões otimizadas preservam proporções, cores e fundo preto.

Aplicações: cabeçalho desktop/mobile, seção institucional, rodapé, carrinho/finalização, favicon e Open Graph. Paleta preta `#090909`, grafite, branca e amarela `#FFB515`; categorias identificadas por texto e pelas cinco cores do cardápio. Interface em DM Sans e títulos condensados; tipografia dentro do logo preservada.

## Produtos e fotografia

Fonte única: `src/data/products.js`. Preços em centavos inteiros, IDs exclusivos e disponibilidade configurável.

| Categoria | Produtos | Uma unidade de cada |
|---|---:|---:|
| Tapiocas tradicionais | 4 | R$ 30,00 |
| Tapiocas especiais | 12 | R$ 141,00 |
| Tapiocas doces | 3 | R$ 27,00 |
| Sanduíches | 2 | R$ 15,00 |
| Bebidas | 6 | R$ 24,00 |
| Total | 27 | **R$ 237,00** |

O briefing cita R$ 231,00 para uma unidade de cada item, mas os preços individuais fornecidos somam **R$ 237,00**. Foram preservados os preços individuais. O exemplo de pedido do briefing soma corretamente **R$ 63,00**.

Há 27 imagens individuais geradas, identificadas como ilustrativas: 19 tapiocas, dois mistos e seis bebidas. Cada uma tem variantes WebP de 640 e 360 pixels em `public/images/menu/`. Os 54 arquivos somam aproximadamente 1,77 MB. Imagens possuem carregamento sob demanda fora da primeira dobra, dimensões, texto alternativo, seleção responsiva e fallback. Os prompts e caminhos dos originais estão em `IMAGENS-2026.json` e `IMAGENS-BEBIDAS.json`; originais gerados permanecem no diretório do Codex.

**Pendência:** Coca-Cola e Jatobá usam recipientes genéricos sem rótulo, com aviso visível. Não são fotos oficiais nem reproduções das embalagens comercializadas. Substituir pelas fotografias oficiais autorizadas e confirmar a embalagem/sabor do Jatobá. Não foram fabricados rótulos comerciais. As demais imagens também são ilustrativas, não fotos reais do estabelecimento.

## Fluxo do pedido

Quantidade, ingredientes, observações individuais e opção sem tempero para as 19 tapiocas. Sem adicionais pagos ou substituições automáticas. Mistos e bebidas recebem apenas quantidade e observações.

Carrinho, checkout, revisão e mensagem seguem a ordem das cinco categorias. Cada grupo mostra quantidade de unidades e subtotal; linhas mostram preço unitário, quantidade, subtotal e personalizações. Personalizações diferentes permanecem em linhas separadas. Grupos vazios são omitidos. Há alteração de quantidade, remoção e limpeza com confirmação.

Delivery exige nome, rua, número e bairro. Complemento/referência são opcionais; retirada só aparece se confirmada na configuração. Total somente dos produtos, com aviso: **Taxa de entrega a confirmar pelo atendimento.**

O cliente revisa, copia a mensagem e decide abrir o WhatsApp. A URL usa `encodeURIComponent`, preserva acentos e quebras de linha. Abrir o link não confirma recebimento nem apaga o carrinho. Nenhuma mensagem é enviada automaticamente.

Configuração comercial em `src/config.js`: principal provisório `5587988619978`, alternativo `5587981810168`, Instagram `@tapiocaestacaobr`. Confirmar o destino principal antes da operação.

Persistência em `estacao-da-tapioca.cart.v2`: somente itens, quantidades e personalizações. Preços são recalculados pelo catálogo; dados inválidos, produtos removidos e cardápio fictício anterior são descartados. Nome e endereço ficam somente na memória e são descartados ao fechar o carrinho/recarregar.

## Portal e limites

Credenciais, gate e rota existentes foram preservados. O portal tem tela de login, sem catálogo de miniaturas; depois do acesso, o protótipo apresenta o nome oficial e a marca original. Nenhum novo caminho público de publicação foi criado. O gate do GitHub Pages continua sendo uma barreira visual, com arquivos públicos, conforme o escopo anterior.

Não há backend ou painel administrativo de pedidos neste aplicativo. A mensagem agrupada organiza o atendimento/cozinha. Não há recebimento automático, pagamento online, estoque em tempo real ou confirmação de disponibilidade.

Pendências operacionais: horários, área e taxa de entrega, pagamento, retirada e confirmação do contato principal. Esses dados, avaliações e depoimentos não foram inventados. A flag `available` é cadastral, sem consulta de estoque.

## Navegador

O teste Python anterior, com seletores do cardápio fictício e Chromium Linux fixo, foi substituído por Playwright em `tests/browser-smoke.mjs`. Com o servidor ativo:

```sh
npx playwright install chromium
npm run test:browser
```

Outra URL: variável `TAPIOCA_TEST_URL`. Pode-se usar Chromium compatível instalado por `CHROMIUM_PATH`. Nesta máquina Windows:

```powershell
$env:CHROMIUM_PATH='C:/Users/Win/AppData/Local/Programs/Opera GX/opera.exe'
npm run test:browser
```

Cobertura: catálogo, busca, pedido R$ 63,00, quantidades, personalizações distintas, remoção, endereço, retirada, mensagem/URL, cópia, persistência, foco/Escape, limpeza, imagens e larguras 320, 360, 390, 768, 1024 e 1440 px. O teste não abre links de WhatsApp. Capturas e exemplo de mensagem ficam em `tests/artifacts/`, ignorados pelo Git. Os resultados efetivos estão em `VALIDACAO.md`.

## Arquivos e ferramentas

Marca/metadados: `public/brand/`, `index.html`, `src/config.js`. Catálogo/fotos: `src/data/products.js`, `public/images/menu/`. Interface: `src/components/`, `src/App.jsx`, `src/styles.css`. Pedido/persistência: `src/utils/order.js`, `src/hooks/useCart.js`. Verificações: `tests/`, `tsconfig.json`, scripts npm.

Skills utilizadas: Sites (implementação no repositório existente), imagegen (fotografias ilustrativas), React best practices e Verification. Dois subagentes auxiliaram nos dados e motor do pedido. O navegador integrado apresentou timeout e erro de sessão; a validação de ponta a ponta utiliza Playwright e o navegador local instalado. Publicação no GitHub Pages autorizada pelo usuário; rota e credenciais preservadas.
