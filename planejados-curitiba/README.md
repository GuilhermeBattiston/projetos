# Planejados Curitiba — Fábrica de Cozinhas Planejadas

Protótipo novo em React 19/Vite 7, conforme a arquitetura dos projetos existentes. O HTML anexado foi usado como fonte documental de informações comerciais, sem reaproveitar seu layout, estilos, scripts, nota, depoimento ou alegações genéricas. Os outros protótipos e seus acessos foram preservados.

## Executar

Node 24, mesma versão do workflow:

```bash
cd planejados-curitiba
npm ci
npm run dev -- --host 0.0.0.0 --port 5181
```

```bash
npm run lint
npm test
npm run build
python tests/browser-smoke.py
```

O teste de navegador usa `dist` com a base independente, servidor temporário próprio, Python Playwright e `/usr/bin/chromium`. Não envia mensagens nem visita os destinos da empresa. Capturas em `/workspace/artifacts/planejados-curitiba/`.

A stack existente é JavaScript/JSX, sem TypeScript ou comando separado de checagem de tipos; foram mantidos ESLint e build Vite. Não foram acrescentadas dependências ou backend para o organizador de preferências.

## Direção visual

Cozinhas como protagonistas: off-white `#F5F2EC`, madeira, sálvia `#535D4B` e superfícies naturais. Instrument Serif para títulos e Manrope para interface, ambas locais. Assinatura tipográfica proposta, hero assimétrico, apresentação editorial, galeria com proporções variadas, processo conceitual, organizador de preferências e contato. A paleta e a assinatura não são a identidade oficial da empresa.

Seis imagens geradas para este protótipo foram exportadas em WebP e identificadas como referências ilustrativas. Não são obras da empresa, nem comprovação de materiais, equipe ou fabricação própria. Não havia fotografias reais no HTML; fontes externas de fotografia estavam indisponíveis na rede observada. Substituir por fotos reais autorizadas antes da versão definitiva. Licenças OFL das fontes em `public/licenses/`.

## Organizador de preferências

Três etapas reais, sem preço, cálculo fictício ou promessa de orçamento automático:

1. **Seu espaço:** linear, L, U, ilha ou ainda não sei; estilo contemporâneo, minimalista, clássico ou natural.
2. **Sua rotina:** prioridade principal e cidade/bairro.
3. **Sua ideia:** nome e observações opcionais.

Validação por etapa e revisão global antes da geração. Campos inválidos recebem mensagens associadas e foco. É possível voltar, editar e escolher uma referência na galeria sem perder nome, localização ou observações. A etapa ativa anuncia seu título ao teclado. O resumo exibe as escolhas e um esquema de planta original, conceitual e sem escala; não é projeto técnico nem validação de circulação ou viabilidade.

A revisão gera uma mensagem codificada para `5541984172689`, com cópia e tratamento de indisponibilidade de clipboard. O visitante decide quando abrir o WhatsApp. Não se simula envio ou confirmação. Campos ficam apenas no estado React, sem banco, localStorage ou cookies de dados pessoais. A sessão de apresentação do portal é separada e preservada.

## Outras funcionalidades

- Menu mobile: seleção, clique externo, Escape, navegação por teclado e foco visível.
- Galeria: filtros por seis inspirações, modal nativo, próximo/anterior, setas, Escape, contenção e restauração de foco.
- Cada inspiração pode preencher formato e estilo do organizador; não são modelos de um catálogo oficial.
- Âncoras com compensação do cabeçalho, movimento reduzido, imagens dimensionadas e lazy fora do hero.
- Telefone, Maps com CID fornecido, mensagem WhatsApp básica e estruturada; links externos seguros.

## Conteúdo editável

| Arquivo | Responsabilidade |
|---|---|
| `src/config.js` | Nome, telefone, endereço e Maps |
| `src/content.js` | Inspirações, escolhas, presets, etapas e navegação |
| `src/utils/preferences.js` | Validação, mensagem e URL WhatsApp |
| `src/components/PreferenceWizard.jsx` | Etapas, resumo, edição, cópia e revisão |
| `src/components/ChoiceGroup.jsx` | Grupos de escolha com radios nativos |
| `src/components/Shared.jsx` | Marca provisória, CTAs e plantas conceituais |
| `src/components/Gallery.jsx` | Filtros, modal e integração com as preferências |
| `src/components/Hero.jsx`, `KitchenStory.jsx`, `CompanyContact.jsx` | Apresentação e contatos |
| `src/styles.css` | Identidade e responsividade |
| `index.html` | SEO básico, Open Graph e noindex de protótipo |

[Auditoria de conteúdo](docs/content-audit.md): fonte, dados aproveitados, informações descartadas e pendências. A nota 4,8/8 avaliações foi omitida. Não há depoimentos, prazos, garantias, preços, fábrica, equipe ou obras confirmadas além das informações documentais. “Fábrica de Cozinhas Planejadas” foi mantido apenas no nome comercial fornecido.

## Portal e publicação

A conta de apresentação `planejados` aponta para `/projetos/planejados-curitiba/`. O registro e o workflow existentes incluem o novo projeto; não há segundo login, alteração de senhas anteriores ou rota alternativa de apresentação fora do portal.

```bash
# Na raiz, com as dependências de todos os pacotes instaladas:
npm --prefix webforge run build:pages
python webforge/tests/pages-smoke.py
```

A hospedagem atual é GitHub Pages com a barreira visual acordada pelo solicitante, sem proteção real dos arquivos públicos. O mesmo controle visual de sessão e botão Sair é injetado pelo build. A alternativa de servidor/Docker permanece compatível, mas não é a publicação atual. O workflow é quem confirma a atualização remota, não os testes locais.

## Para a versão definitiva

Confirmar nome, telefone/WhatsApp, endereço/CEP e Maps; validar quais serviços são oferecidos, materiais e processo real; aprovar identidade e copy; obter fotografias autorizadas. Somente acrescentar provas sociais, garantias, prazos ou condições quando houver comprovação. Para privacidade efetiva dos arquivos, usar a alternativa com autenticação de servidor.

## Validação desta entrega

Instalação com `npm ci` concluída; lint do novo projeto e do portal aprovado; oito testes de preferências/configuração aprovados; build independente e build conjunto Pages concluídos. Navegador: três etapas, obrigatórios, voltar/editar, pré-seleção por referência sem perder dados, revisão/encoding/cópia/falha de clipboard, filtros, modal/setas/Escape/foco, links, menu mobile, imagens, movimento reduzido e larguras 360/390/768/1024/1440 sem erros ou armazenamento dos campos. Revisão visual de desktop, celular e organizador concluída. O teste do portal validou os seis acessos, destinos, login inválido, refresh, logout e redirecionamento entre projetos. Estes resultados são locais; a conclusão do workflow confirma a publicação remota.
