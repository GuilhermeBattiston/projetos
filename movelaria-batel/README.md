# Movelaria Batel - Planejados Curitiba

Protótipo comercial inteiramente novo em React 19/Vite 7. O HTML anexado foi usado exclusivamente como fonte de informações comerciais; layout, CSS, scripts, nota, depoimento e alegações genéricas foram descartados.

## Executar

Node 24, seguindo o workflow existente:

```bash
cd movelaria-batel
npm ci
npm run dev -- --host 0.0.0.0 --port 5179
```

```bash
npm run lint
npm test
npm run build
python tests/browser-smoke.py
```

O teste de navegador usa o próprio servidor temporário sobre `dist`, Python Playwright e `/usr/bin/chromium`. Não visita os links da empresa nem envia mensagens. Capturas em `/workspace/artifacts/movelaria-batel/`.

## Direção de arte

Catálogo editorial claro: marfim `#F4F0E9`, areia `#E8E1D7`, grafite `#292A27` e madeira `#725A46`. Títulos em Cormorant Garamond e interface em Manrope; ambas locais, via Fontsource. Hero com imagem ampla, introdução assimétrica, navegação por ambientes, galeria com proporções distintas, seção escura pontual e encerramento tipográfico. A aparência sofisticada é uma proposta visual, sem afirmar posicionamento comercial premium da empresa.

Cinco imagens foram geradas para este protótipo e exportadas em WebP. Estão identificadas como ilustrações, não são trabalhos, materiais utilizados ou portfólio da Movelaria Batel. Não havia fotos reais no HTML e o acesso à fonte externa de fotografias consultada retornou bloqueio de rede. Substituir por fotografias reais autorizadas antes da versão definitiva.

## Funcionalidades

- Menu mobile por botão, Escape, clique externo e seleção; navegação por teclado e foco visível.
- Cinco ambientes em abas acessíveis: Cozinhas, Dormitórios, Salas, Home office e Integrados. Teclas direcionais, Home/End e texto/CTA individuais.
- Galeria ampliável via `dialog` nativo; próximo/anterior por botão ou setas, Escape, contenção e restauração de foco. Sem biblioteca de slider.
- WhatsApp `5541996318510` com mensagem codificada e assunto do ambiente; nova aba segura, sem envio automático.
- Telefone, Maps com CID fornecido, âncoras, fontes locais, imagens dimensionadas/lazy fora do hero e respeito a movimento reduzido.
- Sem carrinho, checkout, formulário de coleta, backend ou cadastro de usuários no site institucional.

## Conteúdo editável

| Arquivo | Conteúdo |
|---|---|
| `src/config.js` | Dados comerciais, telefone, Maps e WhatsApp |
| `src/content.js` | Ambientes sugeridos, referências, passos e navegação |
| `src/components/Environments.jsx` | Abas e apresentação de cada ambiente |
| `src/components/InspirationGallery.jsx` | Galeria e ampliação |
| `src/App.jsx` | Hero, apresentação, planejamento, localização, CTA e rodapé |
| `src/styles.css` | Direção visual e responsividade |
| `index.html` | Title, description, Open Graph e noindex de protótipo |
| `public/images/` | Cinco imagens WebP demonstrativas |

[Auditoria de conteúdo](docs/content-audit.md): dados transcritos, alegações descartadas e pendências. Nome, endereço/CEP, telefone, Maps e categorias de ambientes precisam da confirmação do proprietário. Sem nota, depoimentos, portfólio real, materiais comerciais, fabricação própria, equipe técnica, showroom, cobertura regional, garantias, condições ou prazos não verificados. Dados estruturados comerciais foram omitidos por não haver comprovação independente nesta sessão.

## Portal existente

A conta de apresentação `batel` aponta para `/projetos/movelaria-batel/`. Os acessos anteriores foram preservados. A raiz mantém o fluxo GitHub Actions/Pages; `webforge/prototypes.json` registra o build, `webforge/pages/access.json` contém o verificador de senha e `.github/workflows/deploy-pages.yml` instala e valida este projeto antes da publicação.

```bash
# Na raiz, com dependências dos cinco pacotes instaladas:
npm --prefix webforge run build:pages
python webforge/tests/pages-smoke.py
```

GitHub Pages oferece a barreira visual de acesso acordada; arquivos são públicos. A alternativa de servidor/Docker foi mantida compatível, mas não é usada na hospedagem atual. O protótipo e sua configuração foram preparados para o workflow existente; apenas o resultado do workflow confirma a publicação externa.

## Validação desta entrega

Lint do projeto e do portal aprovados; quatro testes de contato/configuração aprovados; build de produção e build conjunto Pages concluídos. Navegador real: cinco ambientes, abas e teclado, modal e foco, links, menu mobile, imagens, movimento reduzido e larguras 360/390/768/1024/1440 sem erros de execução. O teste do portal validou os quatro destinos, login inválido, refresh, saída e redirecionamentos. A publicação remota depende do workflow; estes resultados validam os artefatos locais.
