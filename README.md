# WebForge — portal privado de protótipos

A página `/projetos` é o acesso do cliente. Os protótipos Tapioca Estação BR e Lima Climatização continuam com seus projetos e recursos preservados, mas são compilados para armazenamento privado e servidos exclusivamente após autorização no servidor.

**Hospedagem alvo: VPS com Docker + Caddy + HTTPS.** GitHub Pages não executa esta autenticação e não pode continuar servindo cópias públicas dos protótipos. O workflow passou a validar o código e a imagem Docker, sem publicar no Pages. Isso **não retira automaticamente a publicação antiga**: antes de considerar o ambiente privado, despublique o Pages e confira a visibilidade do repositório.

- [Executar, administrar acessos e implantar na VPS](webforge/README.md)
- [Arquitetura, controles e limitações](webforge/SECURITY.md)

Nenhuma conta, empresa ou senha de cliente é criada automaticamente. Os usuários e hashes residem somente no SQLite do servidor. O login público não inclui nomes de clientes, destinos cadastrados ou credenciais.
