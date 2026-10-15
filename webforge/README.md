# WebForge — operação do portal privado

## Arquitetura

Node 24, Express, SQLite (`node:sqlite`) e Argon2id. O portal público usa HTML/CSS/JavaScript e fontes locais; não precisa de um bundle React para autenticar. Os dois protótipos React/Vite foram preservados. O servidor valida a sessão e a empresa em **todas** as requisições dos protótipos, inclusive HTML, JavaScript, CSS, imagens e fontes.

Rotas:

- `/` → `/projetos`.
- `/projetos` → login, ou destino da empresa quando houver sessão válida.
- `/projetos/api/login`, `/session`, `/logout` → operações do servidor; não há cadastro público.
- `/projetos/portal/*` → somente login, fontes, estilos e controles de sessão públicos.
- `/projetos/<slug>/*` → páginas e arquivos privados, autorizados pela empresa da sessão.

A lista de protótipos fica em `prototypes.json`, usada no build e na validação do servidor. Empresas, usuários, hashes, sessões e limites de tentativas ficam no SQLite. São dados separados do código e não são enviados ao navegador.

## Executar localmente

Requer Node 24 e npm. A partir da raiz do repositório:

```bash
npm --prefix webforge ci --cache /workspace/.npm-cache --no-audit --no-fund
npm --prefix tapioca-estacao-br ci --cache /workspace/.npm-cache --no-audit --no-fund
npm --prefix lima-climatizacao ci --cache /workspace/.npm-cache --no-audit --no-fund
npm --prefix webforge run build
cd webforge
APP_ORIGIN=http://127.0.0.1:8080 npm start
```

Abra `/projetos` no servidor da porta 8080. O endereço do navegador precisa corresponder ao `APP_ORIGIN` — `localhost` e `127.0.0.1` são origens diferentes. **Não há contas padrão**. Use os comandos administrativos abaixo para criar acessos autorizados. O cookie de desenvolvimento não é Secure, porque esta execução usa HTTP local; produção exige HTTPS e cookie Secure.

Os builds são copiados para `webforge/private/prototypes`, que não é versionada nem montada como diretório público. Não publique essa pasta em CDN, Pages, nginx `root` ou storage público. O servidor deve ser o único caminho HTTP para esses arquivos.

## Configuração

| Variável | Uso |
|---|---|
| `NODE_ENV` | `production` habilita HTTPS obrigatório, cookies Secure e HSTS |
| `APP_ORIGIN` | Origem exata, como `https://portal.seudominio.com`; obrigatória em produção |
| `PORT` | Porta interna, padrão 8080 |
| `DATA_DIR` | Diretório privado do SQLite, padrão `webforge/data`; Docker usa `/data` |
| `PROTOTYPE_ROOT` | Raiz privada dos builds; Docker usa `/app/private/prototypes` |
| `TRUST_PROXY_HOPS` | Quantidade exata de proxies confiáveis; Compose usa 1 para Caddy |
| `SESSION_TTL_SECONDS` | Expiração absoluta; padrão 3600, permitidos 60–28800 segundos |
| `WEBFORGE_PASSWORD_FILE` | Opcional, arquivo local 0600 para administração não interativa; nunca para o navegador |

Não é necessária uma chave fixa de sessão: cada token é gerado com 32 bytes aleatórios, e somente seu SHA-256 é armazenado no banco. Senhas usam Argon2id com salt aleatório, memória 64 MiB, três passagens e um thread. Nada disso é embutido no frontend.

## Criar uma empresa e associar seu protótipo

A partir de `webforge`, no servidor autorizado:

```bash
npm run admin -- company:create --name "Tapioca Estação BR" --slug tapioca-estacao-br --prototype tapioca-estacao-br
```

O slug da empresa precisa corresponder ao protótipo registrado. O build já utiliza esse prefixo nas URLs dos assets. O identificador interno é criado automaticamente; a empresa só é cadastrada quando o administrador executa o comando. Esses exemplos não são executados na inicialização.

Para Lima, use `lima-climatizacao` como slug/prototype e o nome apropriado. Pode haver mais de um usuário associado à mesma empresa; cada usuário acessará o mesmo protótipo autorizado.

## Criar usuário e definir senha

```bash
npm run admin -- user:create --company tapioca-estacao-br --username USUARIO_ESCOLHIDO
```

O terminal solicita e confirma a senha com **entrada oculta**. Use uma senha única gerada por um gerenciador, com pelo menos 14 caracteres. A senha não aparece em argumentos, logs, documentação ou arquivos públicos. Usuários têm 3–64 caracteres e são normalizados para minúsculas. Não existe credencial administrativa padrão nem painel público.

Para automatizar, forneça um arquivo 0600 no servidor e defina `WEBFORGE_PASSWORD_FILE` somente durante o comando. Remova o arquivo depois; nunca o versione, publique ou use como variável `VITE_`. Prefira o terminal interativo para uso rotineiro.

## Alterar senha, desativar e revogar sessões

```bash
npm run admin -- password:reset --username USUARIO_ESCOLHIDO
npm run admin -- sessions:revoke --username USUARIO_ESCOLHIDO
npm run admin -- user:disable --username USUARIO_ESCOLHIDO
npm run admin -- user:enable --username USUARIO_ESCOLHIDO
npm run admin -- company:disable --slug tapioca-estacao-br
npm run admin -- company:enable --slug tapioca-estacao-br
npm run admin -- list
```

Redefinir senha, desativar/reativar usuário ou empresa revoga as sessões afetadas. O servidor também verifica o status em cada requisição. As operações podem ser feitas com o servidor ativo, usando o mesmo SQLite. Não altere as tabelas manualmente nem altere associações sem revogar as sessões.

## Adicionar outro protótipo

1. Mantenha o novo projeto em um diretório próprio no repositório, com script `npm run build`.
2. Faça o Vite aceitar `process.env.WEBFORGE_BASE` na opção `base`, e use `import.meta.env.BASE_URL` nos assets locais.
3. Acrescente `{ "slug": "empresa-nova", "source": "empresa-nova" }` em `webforge/prototypes.json`. Nomes são slugs simples; paths absolutos e `..` são rejeitados.
4. Instale as dependências do projeto e rode o build WebForge. Atualize as etapas de instalação do Dockerfile/CI para esse projeto.
5. Reconstrua o container. Cadastre a empresa e o usuário pelos comandos administrativos.
6. Teste o acesso direto sem sessão e o acesso com outro cliente, inclusive para assets.

O portal não expõe um catálogo público de empresas nem exige modificação da página de login para novos clientes.

## Implantação em VPS com Docker

Pré-requisitos externos: VPS com Docker Engine/Compose, endereço DNS apontando para a VPS e portas 80/443 disponíveis. Um subdomínio gratuito DuckDNS atende ao requisito; não é necessário comprar um domínio.

### Endereço gratuito com DuckDNS

1. Entre em https://www.duckdns.org e crie um subdomínio disponível na sua conta.
2. Configure o IPv4 `193.111.116.93` no painel DuckDNS. Se houver um registro IPv6, mantenha-o apenas se ele também alcançar esta VPS.
3. Aguarde o DNS resolver para a VPS e use o endereço completo, como `seu-subdominio.duckdns.org`, em `WEBFORGE_DOMAIN` no `.env` da VPS. O exemplo não está reservado nem confirmado.
4. Libere as portas TCP 80/443 para o Caddy emitir e renovar o certificado HTTPS gratuito. Verifique serviços existentes antes de ocupar essas portas.

Para um IP fixo, basta atualizar o endereço no painel; o portal não precisa do token DuckDNS. Se o IP mudar, atualize o painel antes de acessar o portal. Não coloque o token no repositório, no frontend ou em mensagens.

Antes de migrar:

1. Em GitHub → Settings → Pages, use **Unpublish site**. Retire outros deployments/mirrors públicos.
2. Se o repositório for público, torne-o privado ou mova os protótipos para um repositório privado. Seus fontes e imagens, inclusive versões antigas no histórico, não ficam privados só porque o novo servidor pede senha.
3. Não deixe um nginx/Apache anterior servindo cópias dos builds; Caddy deve encaminhar para o WebForge.

Na raiz do checkout da VPS:

```bash
cp .env.example .env
# Edite .env: substitua seu-subdominio.duckdns.org pelo endereço DuckDNS criado.
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Caddy emite e renova o certificado TLS. Não publique a porta 8080 do app na VPS: ela fica somente na rede Docker. O container do app roda sem root, com filesystem somente leitura e `/data` em volume persistente. A origem configurada é HTTPS; HTTP não autenticado de health check é permitido somente em `/healthz`.

Cadastre as empresas e acessos de forma explícita:

```bash
docker compose exec app npm run admin -- company:create --name "Tapioca Estação BR" --slug tapioca-estacao-br --prototype tapioca-estacao-br
docker compose exec app npm run admin -- user:create --company tapioca-estacao-br --username USUARIO_ESCOLHIDO
```

`docker compose exec` abre terminal interativo, com a senha oculta. Para os demais comandos, use o mesmo prefixo `docker compose exec app`.

Verifique externamente: `/projetos` apresenta login; sem cookie, o protótipo e seus assets são negados; cada cliente vê apenas sua empresa; o cookie contém HttpOnly/Secure/SameSite; logout invalida o token; URLs antigas do Pages e mirrors não entregam mais arquivos. Um deploy local não comprova que as cópias públicas antigas foram retiradas.

### Atualização e backup

```bash
git pull --ff-only
docker compose up -d --build
```

Isso mantém o volume do SQLite. **Não use `docker compose down -v` em produção**: ele remove os dados persistidos.

Backup consistente, protegido no volume:

```bash
docker compose exec app node server/backup.js
```

O comando cria um SQLite consistente em `/data/backups`, com permissões 0600. Copie o backup para armazenamento seguro fora da VPS e teste restauração. Para restaurar, pare o app, substitua o SQLite por um backup validado no volume (com ownership do usuário `node`), remova os arquivos WAL/SHM antigos desse banco parado e reinicie. Mantenha backups protegidos: contêm hashes e dados de acesso. Uma restauração pode trazer sessões antigas ainda não expiradas; revogue sessões após restaurar.

### Builds em rede com proxy TLS

Em VPS comum ou GitHub Actions, o Dockerfile usa a cadeia de confiança padrão. Em um ambiente que fornece uma CA de proxy, há um mount BuildKit opcional `ca_bundle`: use `--secret id=ca_bundle,src=<bundle confiável fornecido pelo ambiente>`. Esse arquivo não é gravado na imagem. Passe proxy/hostname conforme a rede da máquina; não desative TLS, `strict-ssl` ou checagens de integridade para instalar.

## Testes

```bash
npm --prefix webforge run lint
npm --prefix webforge test
npm --prefix webforge run build
npm --prefix webforge run test:browser
```

O último comando usa Python, Playwright e Chromium do ambiente, com contas aleatórias **temporárias** em banco em memória. Não grava credenciais reais, não cria contas de produção e não envia pedidos para WhatsApp. Capturas de login ficam em `/workspace/artifacts/webforge`.

Os testes HTTP verificam senhas corretas/incorretas, usuário inexistente/desativado, expiração, logout, troca/revogação de senha e sessão, acesso direto e cruzado, arquivos privados, travessia/symlinks, origens/CSRF, rate limiting persistido, limite de processamento de senha, corrida de redefinição de senha e atributos de produção. O navegador exercita ambos os protótipos após autenticação, refresh, carrinho, formulário, logout, erro de conexão, teclado e cinco larguras.

## Limitações

Instância única com SQLite persistente: não distribuído/multi-região; não execute várias réplicas independentes com bancos distintos. Não há recuperação automática de senha, MFA, painel administrativo, auditoria completa de acessos ou envio de e-mail. O operador da VPS/registro de imagens e pessoas com acesso ao repositório/volume continuam podendo ler os arquivos. O cliente autorizado pode salvar o conteúdo recebido; autenticação não é DRM.

## Endereço de produção

Destino: `https://<subdominio-criado>.duckdns.org/projetos`. O endereço depende da criação na conta DuckDNS do proprietário; `.env.example` contém apenas um exemplo, sem segredos ou contas. O código não registra o subdomínio nem configura o DNS. O domínio anterior `joao315.devlook.xyz` foi substituído pela opção DuckDNS solicitada.

## Resultados desta implementação

- Lint do portal e dos dois protótipos: aprovado.
- 22 testes HTTP/configuração de autenticação e autorização: aprovados.
- Quatro testes de cada protótipo: aprovados.
- Build privado de ambos os protótipos: aprovado.
- Navegador real: dois logins isolados, recursos privados, refresh, carrinho, orçamento, logout, recuperação de erro de conexão, teclado e cinco larguras: aprovado.
- Imagem Docker: construída; Compose validado. Teste real com Caddy HTTPS e CA local confiável: aprovado, incluindo cookies Secure/HttpOnly, persistência após reinício, revogação e backup.
- `npm audit --omit=dev`: nenhuma vulnerabilidade conhecida reportada nas dependências de produção.
- Nenhuma conta de produção foi criada. O endereço DuckDNS aguarda cadastro e confirmação. A tentativa de SSH para `193.111.116.93:22` recebeu conexão recusada, antes da autenticação. Implantação externa e retirada do Pages continuam pendentes.

Para repetir o teste Docker após construir a imagem local:

```bash
docker build -t webforge-local-validation .
python webforge/tests/docker-smoke.py
```

O teste usa containers/volumes temporários, emite um certificado interno apenas para localhost, valida TLS com a CA de teste e remove os dados ao terminar. Não muda o DNS, não instala certificados no host e não cria contas no volume de produção.
