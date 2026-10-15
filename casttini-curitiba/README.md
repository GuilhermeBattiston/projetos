# Casttini Curitiba — Móveis Planejados

Protótipo institucional novo em React 19/Vite 7, seguindo a stack JavaScript existente. O HTML anexado foi usado apenas para extrair informações comerciais; layout, CSS, scripts e alegações não foram reaproveitados. A assinatura tipográfica e a direção de arte são propostas, não a identidade oficial da empresa.

## Executar

Node 24, como no workflow do repositório:

```bash
cd casttini-curitiba
npm ci
npm run dev -- --host 0.0.0.0 --port 5180
```

```bash
npm run lint
npm test
npm run build
python tests/browser-smoke.py
```

O teste de navegador usa o `dist` independente, um servidor temporário próprio, Python Playwright e `/usr/bin/chromium`. Não envia mensagens nem visita o WhatsApp ou Maps da empresa. Capturas em `/workspace/artifacts/casttini-curitiba/`. Não há TypeScript ou script separado de verificação de tipos; foram mantidos JavaScript, ESLint e build Vite conforme a stack existente.

## Direção visual

Conceito de espaços que acompanham a rotina, em marfim `#F4F0E9`, oliva `#454B3F`, areia e grafite. Instrument Serif para títulos e Manrope para interface, servidas localmente com licenças OFL. Hero fotográfico com painel de leitura, apresentação editorial, seleção de ambientes com imagem e texto, galeria assimétrica filtrável, processo sugerido, formulário com revisão e contatos. Sem e-commerce ou biblioteca de slider/animação.

Seis imagens foram geradas para este protótipo e exportadas em WebP. São referências ilustrativas; não são projetos executados pela Casttini, materiais oferecidos ou instalações da empresa. Referências corporativas e de home office compartilham uma imagem de ambiente de trabalho. Substitua por fotografias reais autorizadas antes da versão definitiva. Fontes externas de fotografia não estavam disponíveis pela política de rede observada neste ambiente; não houve confirmação comercial independente.

## Funcionalidades

- Menu mobile por botão, Escape, seleção e clique externo; teclado, foco visível e movimento reduzido.
- Seis categorias demonstrativas com conteúdo/imagem próprios e pré-seleção do ambiente no formulário.
- Galeria com filtros, modal nativo, anterior/próxima, setas, Escape, contenção/restauração de foco e legenda.
- Formulário com nome, ambiente, cidade/bairro e descrição; validação de campos obrigatórios e espaços em branco, erros associados e foco no primeiro inválido.
- Revisão da mensagem, edição sem perder dados, cópia com tratamento de indisponibilidade e URL do WhatsApp codificada. Nenhuma mensagem é enviada automaticamente; não há confirmação fictícia de envio.
- Campos permanecem só na memória da página: sem backend, banco, cookies ou armazenamento persistente dos dados. O portal continua usando sua sessão de apresentação já existente.
- Contato `554130422121`, telefone e Maps com CID fornecido. A disponibilidade do número no WhatsApp precisa ser confirmada; só a formação correta dos links foi testada.

## Onde editar

| Arquivo | Responsabilidade |
|---|---|
| `src/config.js` | Dados comerciais e destino WhatsApp |
| `src/content.js` | Categorias, referências, etapas e navegação |
| `src/utils/quote.js` | Validação e mensagem estruturada |
| `src/components/QuoteForm.jsx` | Formulário, revisão, cópia e feedback |
| `src/components/Gallery.jsx` | Filtros, imagens e modal |
| `src/components/Environments.jsx` | Seleção e pré-preenchimento do formulário |
| `src/components/Hero.jsx`, `Introduction.jsx`, `Contact.jsx` | Apresentação e dados institucionais |
| `src/styles.css` | Identidade, breakpoints, interação e acessibilidade |
| `index.html` | Metadados, Open Graph e noindex de protótipo |

[Auditoria do conteúdo](docs/content-audit.md) registra origem, alegações descartadas e informações pendentes. Não foram incluídas avaliações estruturadas, depoimentos, certificações, histórico, fabricação própria, garantias, prazos, preços ou parceiros sem comprovação.

## Integração com WebForge

O acesso de apresentação `casttini` aponta para `/projetos/casttini-curitiba/`, conforme o registro existente. Credenciais, sessões e projetos anteriores foram preservados. O build Pages injeta o mesmo controle visual de navegação e o botão Sair; não foi criado um segundo login nem um link alternativo de apresentação fora do portal.

A hospedagem atual é GitHub Pages com a barreira visual aprovada pelo solicitante. Seus arquivos são públicos e o controle pode ser contornado; não há autorização real de arquivos no Pages. A alternativa de servidor/Docker foi mantida compatível, mas não é a publicação atual.

```bash
# Na raiz, com dependências de todos os pacotes instaladas:
npm --prefix webforge run build:pages
python webforge/tests/pages-smoke.py
```

O workflow instala e valida o novo projeto e publica `pages-dist` junto dos anteriores. O resultado do workflow confirma a publicação externa; validação local não prova que o site público foi atualizado.

## Antes da versão definitiva

Aprovar identidade e copy; confirmar nome, endereço/CEP, Maps, telefone e WhatsApp; definir categorias e processo reais; obter fotografias e autorizações; só então acrescentar informações comerciais verificadas. Para privacidade real dos arquivos, usar a alternativa com backend em vez do modo estático.

## Validação desta entrega

Instalação reproduzida com `npm ci`; lint do projeto e do portal aprovados; sete testes de configuração/mensagem aprovados; build independente e build conjunto Pages concluídos. Navegador real: categorias e pré-seleção, filtros, modal/setas/Escape/foco, formulário inválido/válido, revisão, cópia e falha de clipboard, edição e ausência de armazenamento dos campos, links, menu, imagens, movimento reduzido e cinco larguras sem erros de execução. Revisão visual em desktop e celular concluída. O teste do portal validou os cinco acessos, login inválido, destinos, refresh, saída e redirecionamento entre empresas. Seu teste aguarda o início de navegações que serão redirecionadas e confirma a renderização da tela de login, evitando depender do carregamento da página abortada. A publicação remota não foi verificada por estes testes locais.
