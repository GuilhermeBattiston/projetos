# Controles e limites de segurança

- Senhas Argon2id: 64 MiB, 3 passagens, salt aleatório; senhas reais fora do código/frontend.
- Tokens de sessão aleatórios de 256 bits, somente SHA-256 no SQLite; rotação no login, expiração absoluta, revogação no logout/reset/desativação.
- Cookies HttpOnly, SameSite=Lax e `__Host-`/Secure em produção; Path=/, sem Domain. HTTP de produção negado, exceto health check sem informações de cliente.
- POSTs de login/logout exigem a origem exata configurada. Não há CORS aberto, mutações por GET ou `next` controlado pelo cliente.
- Rate limits de SQLite por usuário normalizado e IP (8/25 tentativas por 15 minutos); mensagens genéricas. Limite de duas verificações Argon2 simultâneas por instância para controlar memória/CPU.
- Revalidação do estado e hash antes de criar sessão impede que troca/desativação concorrente de acesso seja ignorada.
- Autorização por empresa em cada página e arquivo. Empresas/protótipos são registros do servidor; o cliente não escolhe sua associação.
- Builds em diretório privado fora da raiz pública. Realpath impede escape por symlinks; traversal, dotfiles, double encoding e separadores codificados são negados.
- Respostas privadas no-store, sem ETag; CSP, nosniff, proteção contra framing, política de referrer e noindex. CSP permite estilos inline para compatibilidade com os protótipos, mas não permite scripts inline/eval.
- Botão discreto de logout; verificação periódica/retorno de foco e recarga de páginas recuperadas do back-forward cache. A autorização efetiva está no servidor, não nesse script.
- Container não root, read-only, sem porta do app publicada; Caddy é o único proxy confiável. Banco em volume protegido, backup consistente e sem credenciais padrão.

Esses testes não são uma auditoria independente nem provam isolamento de uma VPS ainda não configurada. Antes de afirmar que o ambiente é privado em produção, validar DNS/TLS, firewall, proxy, backups e retirada de **todas** as cópias públicas anteriores. Se o repositório continuar público, fonte e imagens continuam públicos. Proteger `/projetos` na VPS não muda essa condição.

Senha de cliente, cookie ou conteúdo privado não deve aparecer em logs de aplicação/proxy. O Caddyfile fornecido não ativa access logs, e a aplicação não registra corpos, tokens ou credenciais. Não habilite logs de debug de requisições com esses dados.
