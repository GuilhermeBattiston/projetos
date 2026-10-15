# Tapioca Estação BR — protótipo comercial

Site responsivo React + Vite da Tapioca Estação BR. O repositório contém apenas este projeto, com dependências e configuração próprias.

## Executar

Requer Node >=22.12 (ambiente validado com Node 24) e npm.

```bash
cd /workspace/projetos/tapioca-estacao-br
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 5174 --strictPort
```

```bash
npm run lint
npm test
npm run build
npm run preview -- --host 0.0.0.0 --port 4174 --strictPort
```

O build fica em `dist/` e pode ser hospedado como site estático. Não há backend nem pagamento online.

## Direção visual

Proposta autoral demonstrativa: fundo creme, verde profundo, terracota, títulos em Playfair Display e corpo em DM Sans. A fotografia da tapioca conduz o hero, com assinatura tipográfica, composição assimétrica e cardápio editorial. No mobile, o carrinho ocupa a tela e há um acesso fixo ao pedido quando existem itens. Fontes e imagens são locais; não há dependência de URLs de imagens de terceiros ou do Instagram.

## Informações e transparência

- O nome e o perfil `https://www.instagram.com/tapiocaestacaobr/` foram fornecidos pelo solicitante. O perfil não pôde ser consultado neste ambiente; sua identidade visual e seus dados comerciais não foram verificados.
- Todos os produtos, descrições e preços são fictícios e estão identificados como demonstrativos no site.
- Quatro imagens de tapiocas foram geradas para a apresentação. Elas não representam fotografias de produtos reais da empresa. Produtos sem fotografia possuem um estado ilustrado de ausência de imagem.
- Assinatura visual, cores e texto institucional são propostas, sujeitos à aprovação. Não foram adicionados endereço, horários, avaliações, história, promoções ou telefone fictícios.
- As modalidades retirada e entrega são opções de demonstração, sem afirmação de disponibilidade comercial ou cálculo de frete. Nada é cobrado e nenhum pedido é confirmado.

## Onde configurar

| Conteúdo | Arquivo |
|---|---|
| Nome, Instagram e telefone WhatsApp | `src/config.js` |
| Produtos, preços, categorias, descrições e imagens | `src/data/products.js` |
| Texto e seções institucionais | `src/components/Sections.jsx` |
| Cores, fontes, espaçamentos e responsividade | `src/styles.css` |
| Mensagem e URL WhatsApp | `src/utils/order.js` |
| Metadados SEO | `index.html` |

No campo `business.whatsapp`, use **somente o telefone real confirmado**, com código do país e DDD, sem sinal de `+`, espaços ou pontuação. O valor vazio ou malformado mantém o envio bloqueado. Ao revisar um pedido com telefone válido, o site oferece um link `https://wa.me/...` com mensagem codificada. Abrir esse link não confirma o pedido; o cliente precisa enviá-lo e combinar atendimento com a equipe.

A flag `business.demo` é apenas uma identificação de configuração; não remove automaticamente os avisos do protótipo. Remova ou ajuste esses avisos somente depois de confirmar o cardápio, a identidade e os dados comerciais com a empresa.

## Funcionalidades

Menu mobile, âncoras, filtros, imagens com fallback, feedback ao adicionar, carrinho com limite de 99 unidades por produto, quantidades, remoção, subtotal em centavos, persistência dos itens em localStorage, formulário com campos obrigatórios, retirada/entrega, endereço condicionado à entrega, observações, revisão e cópia da mensagem. Dados pessoais do formulário ficam apenas na memória; somente itens e quantidades são persistidos. Há tratamento para indisponibilidade do armazenamento e da área de transferência.

O modal usa `dialog` nativo para foco e Escape, foco visível, rótulos de campos e botões, aviso de quantidade para leitores de tela, link para pular ao cardápio e respeito a `prefers-reduced-motion`.

## Validação

- `npm run lint`: sem erros no novo projeto.
- `npm test`: quatro testes de cálculos, normalização do carrinho, mensagens e URL WhatsApp; nenhum envio externo é feito.
- `npm run build`: build de produção concluído.
- `python tests/browser-smoke.py`: smoke test com Playwright e Chromium do ambiente. Executar com servidor ativo em 5174; para outra URL, definir `TAPIOCA_TEST_URL`.
- Smoke test: filtros; adicionar/aumentar/diminuir/remover; total; estado vazio; persistência; nome e endereço obrigatórios; retirada e entrega; revisão; bloqueio sem telefone; menu mobile; foco no modal; Escape; movimento reduzido; imagens; console; ausência de overflow em 320, 390, 768, 1024 e 1440 pixels.
- O smoke test também passou no build servido por `npm run preview` na porta 4174. A cópia da mensagem foi verificada no navegador, comparando o conteúdo da área de transferência à revisão do pedido.
- O navegador não envia mensagens reais pelo WhatsApp nem consulta disponibilidade comercial. A URL configurada é verificada em teste unitário com um valor de teste, sem contato externo.
- Capturas de desktop, mobile e carrinho são salvas em `/workspace/artifacts/tapioca/` pelo smoke test.

## Estrutura

`components/`: cabeçalho, seções, cartões e modal. `hooks/`: estado/persistência. `data/`: cardápio. `utils/`: cálculos e mensagem. `tests/`: regras do pedido e teste de navegador. `public/images/`: imagens WebP demonstrativas.

## Próximos passos para produção

Confirmar identidade e dados da empresa, substituir o cardápio e as fotografias, configurar o número real e validar uma conversa com autorização da equipe. Definir condições de retirada/entrega, publicar em domínio próprio com HTTPS e revisar privacidade e operação comercial. Pedidos persistidos em servidor, sincronização, disponibilidade e pagamentos exigem uma etapa própria de backend; não estão incluídos neste protótipo.

Fontes distribuídas pelos pacotes Fontsource, com licenças incluídas nesses pacotes. Ícones Lucide, licença ISC. Imagens geradas para esta demonstração, sem atribuição à produção real da empresa.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` instala, verifica e compila o aplicativo e publica somente `tapioca-estacao-br/dist`. Ele executa em pushes para `main` e também permite execução manual em Actions.

No GitHub, abra **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**. Depois acompanhe **Actions → Publish prototypes to GitHub Pages**. Se a primeira execução falhar porque Pages ainda não estava configurado, execute novamente após selecionar a origem correta.

URL prevista: https://guilhermebattiston.github.io/projetos/

O build de Pages usa `GITHUB_PAGES=true`, configurando a base `/projetos/`, inclusive para imagens e favicon. Builds normais continuam com a base `/`, apropriada para domínio próprio ou desenvolvimento local. Para validar Pages localmente:

```bash
GITHUB_PAGES=true npm run build
GITHUB_PAGES=true npm run preview -- --host 0.0.0.0 --port 4174 --strictPort
TAPIOCA_TEST_URL=http://127.0.0.1:4174/projetos/ python tests/browser-smoke.py
```

A raiz do código-fonte não é uma publicação estática pronta. Não use publicação direta da branch `main` ou da pasta `/docs`; utilize o workflow para publicar o build.
