# Movelaria Curitiba — proposta WEBFORGE

Reformulação demonstrativa em React 19, TypeScript estrito, Vite 7 e CSS. A proposta usa um catálogo editorial claro: título amplo, fotografia panorâmica, índice de ambientes e portfólio assimétrico ao lado de uma introdução fixa. Marfim, café e carvalho, com DM Sans e Instrument Serif locais. Marca tipográfica provisória e frase criativa, sem atribuição de slogan oficial.

## Iniciar

Requer Node 24 e npm, na raiz do repositório:

```sh
npm --prefix movelaria-curitiba ci
npm --prefix movelaria-curitiba run dev
```

## Verificar

```sh
npm --prefix movelaria-curitiba run lint
npm --prefix movelaria-curitiba run check
npm --prefix movelaria-curitiba test
npm --prefix movelaria-curitiba run build
python movelaria-curitiba/tests/browser-smoke.py
```

O navegador requer Python Playwright e `/usr/bin/chromium`, disponíveis neste ambiente. Capturas em `/workspace/artifacts/movelaria-curitiba`. O teste do aplicativo exige build standalone, com base padrão `/`. Não roda em paralelo com o build do portal, que muda a base do mesmo `dist`.

## Funcionalidades

- Índice de cinco ambientes, com pré-seleção no briefing sem apagar outras respostas.
- Galeria demonstrativa com cinco referências únicas, filtros, legendas, modal nativo, anterior/próxima, setas, Escape, contenção e retorno de foco.
- Briefing: ambiente, tipo, prioridades múltiplas, informações, revisão e WhatsApp. Campos obrigatórios nome/cidade/descrição; medidas opcionais. Validação inclusive ao voltar a uma etapa concluída. Edição e cópia da mensagem com tratamento de falha.
- Geração centralizada de URL WhatsApp codificada. Não envia automaticamente nem confirma envio. Não cria preços, checkout, backend, analytics ou persistência de dados pessoais.
- Menu mobile, skip link, labels/erros, foco visível, suporte a movimento reduzido, imagens WebP locais e fallback SVG.
- Metadados e Open Graph, `noindex,nofollow,noarchive`, fontes locais licenciadas. Não inclui endereço, avaliações ou dados estruturados não confirmados.

## Arquitetura

- `src/config.ts`: dados comerciais e utilitário WhatsApp.
- `src/content.ts`: ambientes, móveis, prioridades e galeria.
- `src/components/`: seções institucionais, navegação, galeria, imagens e briefing.
- `src/utils/briefing.ts`: validação, seleção de etapas e mensagem.
- `src/styles.css`: identidade e responsividade próprias.
- `public/images/README.md`: procedência das imagens; `public/licenses`: fontes OFL.
- `docs/AUDITORIA.md`: evidência de acesso e limites da análise do original.
- `docs/COMPARATIVO.md`: comparação sem inventar achados ou métricas.

## Integração com o portal

Publicação autorizada pelo solicitante. Incluído no build padrão e na tela de login existente com o usuário `movelaria`. Nenhum outro acesso foi alterado. O workflow instala e valida o novo pacote. O cadastro armazena apenas o hash no padrão do portal, sem senha em texto.

```sh
npm --prefix webforge run build:pages
python webforge/tests/pages-smoke.py
```

Os testes usam credenciais descartáveis interceptadas apenas no navegador. Não há segundo login ou rota alternativa. O portal GitHub Pages mantém sua barreira visual no cliente, sem isolamento real de arquivos estáticos. Não utilizar informações confidenciais ou senhas reutilizadas. O servidor alternativo permanece fora do escopo.

## Veracidade e pendências

Site oficial, homepage, robots, sitemap e navegador não puderam ser acessados por bloqueio 403/túnel neste ambiente. Não é um erro diagnosticado no site da empresa. Não houve auditoria direta das páginas internas ou medição do site original.

Nome, segmento, cidade, telefone, e-mail e categorias vêm do solicitante, sem confirmação independente. CNPJ divulgado `57.630.043/0001-78`, experiência de mais de uma década e entrega/montagem não foram conferidos, portanto não foram publicados na interface. Endereço completo não informado; não existe mapa inventado. Não foram inferidos redes sociais, equipe, técnicas, materiais, garantias, preços ou condições comerciais.

Todas as fotografias são referências geradas, identificadas como ilustrativas e não como obras da Movelaria Curitiba. O protótipo não substitui um portfólio autorizado. Confirmar informações, identidade e direitos das fotos reais antes de uso oficial. Não há evidência de ganho de conversão; benefícios são hipóteses de experiência para demonstrar.

## Skills e ferramentas

Skill usada: `cloud-environment-onboarding:setup`. Catálogo consultado; não havia skills de React, revisão TSX, design, SEO, acessibilidade, Vercel, Figma ou pesquisa web disponíveis. Ferramentas utilizadas: shell/Git, npm, TypeScript, ESLint, Vite, testes Node, Python Playwright/Chromium, image_gen e ImageMagick. Prettier usado para legibilidade do novo código, sem dependência de runtime.
