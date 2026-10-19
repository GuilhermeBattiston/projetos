# Unitudo Planejados — protótipo comercial

React 19, TypeScript, Vite e CSS. Direção visual proposta: atelier contemporâneo, grafite, papel quente e argila, com DM Sans e Instrument Serif locais. Assinatura tipográfica provisória. Não representa identidade oficial aprovada.

## Desenvolvimento

Requer Node.js 24 e npm. Na raiz do repositório:

```sh
npm --prefix unitudo-planejados ci
npm --prefix unitudo-planejados run dev
```

```sh
npm --prefix unitudo-planejados run lint
npm --prefix unitudo-planejados run check
npm --prefix unitudo-planejados test
npm --prefix unitudo-planejados run build
python unitudo-planejados/tests/browser-smoke.py
```

O último comando requer Python Playwright e Chromium em `/usr/bin/chromium`. Produz capturas em `/workspace/artifacts/unitudo-planejados`. Não contata a empresa nem envia mensagens.

## Organização

- `src/config.ts`: contatos fornecidos, pesquisa de endereço e gerador central de URLs WhatsApp.
- `src/content.ts`: referências de ambientes, galeria e opções do briefing.
- `src/components/`: página institucional, menu, galeria com filtros/lightbox e formulário de cinco etapas.
- `src/utils/briefing.ts`: validação, resumo e mensagem codificada.
- `src/styles.css`: identidade visual, estados acessíveis e responsividade.
- `public/images/`: sete referências geradas, WebP locais e fallback SVG.
- `public/licenses/`: licenças OFL das fontes.
- `tests/`: regras de negócio e interações reais em navegador.

O briefing fica apenas na memória da página; recarregar apaga as respostas. O visitante revisa o texto antes de abrir o WhatsApp. Abrir o link não confirma envio. Não existem preços, checkout, backend ou coleta analítica.

## Integração com o portal existente

Publicação autorizada pelo solicitante. A Unitudo está registrada no build padrão, no mesmo portal e login dos demais projetos, com o usuário `unitudo`. A senha não é salva em texto no repositório; o cadastro usa o hash no padrão existente. Os outros acessos foram preservados. O workflow instala, valida e compila a nova aplicação.

```sh
npm --prefix webforge run build:pages
python webforge/tests/pages-smoke.py
```

O teste utiliza senhas descartáveis somente na resposta interceptada pelo navegador. O portal GitHub Pages tem uma barreira visual no cliente: os arquivos estáticos não oferecem confidencialidade real. `noindex,nofollow,noarchive` não substitui controle de acesso. Não foi criado outro login ou rota alternativa.

## Conteúdo e verificações pendentes

Nome, telefone, endereço e Instagram vêm das informações fornecidas pelo solicitante. As tentativas de consultar Instagram e fonte de fotografias públicas retornaram HTTP 403 neste ambiente; nenhuma identidade oficial, foto de cliente, ficha Maps, URL TikTok/Linktree ou serviço por ambiente foi verificado externamente.

As fotografias são **referências geradas por IA**, identificadas na interface, e não portfólio da Unitudo. Categorias de ambiente e estilos são sugestões para o briefing, sujeitas a confirmação comercial. A assinatura e a frase criativa são propostas demonstrativas. O link Maps pesquisa o endereço fornecido, sem inventar coordenadas ou ficha comercial.

Antes de uso oficial, confirmar identidade visual, autorização das fotos reais, canais e endereço, ambientes atendidos, revisão comercial e política de acesso. Não foram inventados CNPJ, e-mail, história, equipe, fábrica, materiais, garantias, prazos, pagamentos ou depoimentos.
