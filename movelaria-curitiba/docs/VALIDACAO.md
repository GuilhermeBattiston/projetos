# Validação — 21/10/2026

Ambiente: Node 24.19.0, TypeScript estrito, Vite 7.3.7, Python Playwright e Chromium do sistema. Os testes não visitam links da empresa nem enviam mensagens.

## Resultados executados

- Instalação com `npm ci` e lockfile concluída.
- ESLint do aplicativo: aprovado.
- `tsc --noEmit`: aprovado.
- Build TypeScript/Vite: aprovado; bundle JS aproximadamente 219 KB (69 KB gzip), CSS aproximadamente 23 KB. Não são métricas de carregamento ou conversão.
- Nove testes de negócio aprovados: obrigatórios/whitespace, validação por etapa, opções inválidas, labels, prioridades múltiplas, mensagem e caracteres especiais, medidas opcionais, ativos locais e rascunho sem conta de produção.
- Teste de navegador do aplicativo aprovado: âncoras, skip link, contatos, seis etapas, checkboxes independentes, revisão/edição e preservação dos dados, validação ao reabrir etapa concluída, WhatsApp codificado, cópia e falha de clipboard, cinco filtros e todos os itens, modal/setas/Escape/foco, menu mobile e ciclo de Tab, carregamento de imagens e fallback, movimento reduzido, sem armazenamento dos campos ou erros JavaScript.
- Larguras 360, 390, 768, 1024 e 1440 px: verificadas, sem overflow horizontal. Capturas disponíveis em `/workspace/artifacts/movelaria-curitiba`.
- Inspeção visual de hero desktop/mobile, página completa, título mobile da galeria e seleção múltipla do briefing concluída.
- ESLint do portal aprovado; 23 testes existentes do portal aprovados.
- Build de demonstração com `WEBFORGE_INCLUDE_DRAFTS=true` e navegador do portal com a mesma variável aprovados: oito destinos, credenciais descartáveis em memória, refresh, redirecionamento entre projetos, saída, acesso direto e mobile.
- Build padrão e navegador do portal aprovados com os sete destinos existentes. Confirmada a ausência de `pages-dist/movelaria-curitiba`; credenciais, workflow e fontes dos outros projetos sem alterações.
- `git diff --check`: aprovado.
- Servidor de desenvolvimento iniciado na porta 5183. Página e módulos React retornaram HTTP 200, não apenas uma porta aberta.

Durante a revisão foram corrigidos: prop de prioridade da imagem, espaçamento semântico entre linhas, números decorativos nos nomes acessíveis das opções, ciclo de foco do lightbox e espaço entre palavras após ocultar uma quebra no título mobile da galeria. Os testes afetados foram repetidos com sucesso.

## Limites

O site oficial foi bloqueado por 403 no proxy e erro de túnel no Chromium. Não houve inspeção de seu HTML, páginas internas, identidade ou formulário. Não foram medidos Lighthouse, Core Web Vitals ou conversão, nem executada auditoria completa com leitor de tela. Navegador automatizado não garante conformidade WCAG completa. A abertura do WhatsApp foi validada pela URL e pelo conteúdo, sem envio ou teste em telefone físico. Não houve deploy, push ou criação de conta de produção.

Skill utilizada: cloud-environment-onboarding:setup. Skills especializadas de React/TSX, design, SEO, acessibilidade, pesquisa e Vercel não estavam disponíveis. Ferramentas de compilação/testes e navegador funcionaram; isso não implica disponibilidade dessas skills.

## Promoção autorizada ao portal

Após solicitação explícita de publicação no portal GitHub Pages, o protótipo foi incluído no build padrão, no CI e no cadastro de acessos existente. Os estados de rascunho descritos acima são históricos. Lint, tipos, nove testes, build dos oito sites e navegador do portal foram executados novamente com sucesso. O login real da Movelaria Curitiba foi testado localmente, incluindo atualização da página, sem alterar os demais acessos. Não houve envio de mensagens comerciais. A API do GitHub Actions retornou Forbidden neste ambiente; não se afirma confirmação do deploy remoto por essa API.
