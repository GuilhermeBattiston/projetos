# Validação — 19/10/2026

Ambiente: Node 24.19.0, npm, Python Playwright, Chromium do sistema. Sem publicação externa ou mensagens à empresa.

## Executado com sucesso

- `npm --prefix unitudo-planejados run lint`: sem erros.
- `npm --prefix unitudo-planejados run check`: TypeScript estrito sem erros.
- `npm --prefix unitudo-planejados run build`: TypeScript e bundle Vite concluídos.
- `npm --prefix unitudo-planejados test`: 9 testes aprovados.
- `python unitudo-planejados/tests/browser-smoke.py`: navegação interna, skip link, seleção de ambiente, cinco etapas, campos inválidos/vazios, edição e preservação das respostas, retorno à revisão após apagar campo, mensagem WhatsApp codificada, cópia e falha de clipboard, filtros, modal, setas/Escape/foco, menu mobile, carregamento/fallback de imagens, movimento reduzido, ausência de armazenamento e de erros JavaScript.
- Larguras 360, 390, 768, 1024 e 1440 px: sem overflow horizontal. Capturas mobile e desktop inspecionadas visualmente.
- `npm --prefix webforge run lint`: sem erros.
- `npm --prefix webforge test`: 23 testes aprovados, incluindo exclusão padrão de rascunhos e testes do servidor alternativo existente. Isso não significa que GitHub Pages tenha autenticação de servidor.
- Build Pages com `WEBFORGE_INCLUDE_DRAFTS=true` e teste de navegador com a mesma variável: sete destinos, login de teste, atualização, saída, rotas e mobile aprovados. Conta Unitudo apenas na resposta interceptada em memória.
- Build Pages padrão e `python webforge/tests/pages-smoke.py`: seis destinos existentes aprovados; confirmada ausência de `pages-dist/unitudo-planejados`.
- `git diff --check`: sem erros de whitespace.

A revisão encontrou uma falha ao acessar uma revisão já visitada após apagar a localização; foi corrigida e ganhou cobertura de navegador.

## Limites

Não foi executada auditoria Lighthouse, auditoria completa de acessibilidade com leitor de tela, nem confirmação de abertura do aplicativo WhatsApp em um telefone físico. Testes de contato inspecionam URLs e texto, sem envio. Sem ferramenta de busca ou skills especializadas de React/TSX/design/Vercel disponíveis. Instagram e fonte pública de fotografias responderam 403; não houve verificação independente de conteúdo comercial.

Skill utilizada: cloud-environment-onboarding:setup, para instalação, verificações e instruções reutilizáveis do ambiente. Fotografias criadas com image_gen, rotuladas ilustrativas. Fontes locais com licenças OFL incluídas.

## Atualização de publicação autorizada

Após solicitação explícita de commit, push e senha, a Unitudo foi promovida do rascunho ao build padrão, com um acesso no portal existente. Workflow atualizado para instalar e validar a aplicação. Reexecutados com sucesso: lint Unitudo/portal, 9 testes Unitudo, 23 testes portal, build padrão dos sete projetos e teste de navegador do portal. As observações anteriores sobre exclusão de rascunho descrevem o estado antes dessa autorização. Login com o cadastro real da Unitudo também validado em navegador local, abrindo o protótipo correto. Nenhuma mensagem comercial foi enviada.
