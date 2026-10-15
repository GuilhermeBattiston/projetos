# WebForge — apresentação de protótipos

Hospedagem atual: **GitHub Pages**, em https://guilhermebattiston.github.io/projetos/.

A página inicial solicita usuário e senha e direciona para o protótipo correspondente. Os projetos Tapioca Estação BR, Lima Climatização, Lucas Construções, Movelaria Batel e Casttini Curitiba permanecem preservados. A navegação possui sessão por aba de oito horas e botão Sair.

**Este modo é uma barreira visual de apresentação.** Os arquivos, as rotas e os verificadores de senha são públicos; o JavaScript pode ser contornado. Não use senhas pessoais, senhas reutilizadas ou informações confidenciais. Não há isolamento real de arquivos no GitHub Pages.

## Publicação

Em Settings → Pages, mantenha Source como **GitHub Actions**. Cada push na `main` executa `Publish WebForge to GitHub Pages`, que publica somente `pages-dist`. Não precisa de VPS, Docker, DuckDNS ou domínio próprio.

```bash
npm --prefix webforge ci
npm --prefix tapioca-estacao-br ci
npm --prefix lima-climatizacao ci
npm --prefix lucas-construcoes ci
npm --prefix movelaria-batel ci
npm --prefix casttini-curitiba ci
npm --prefix webforge run build:pages
```

O build reaproveita o visual de `webforge/public` e usa `webforge/pages/login.js` no lugar do login de servidor. Os destinos e hashes estão em `webforge/pages/access.json`. O hash é SHA-256 de `usuario:senha` em UTF-8. Para alterar um acesso, substitua seu `passwordHash` pelo hash da nova combinação e publique novamente. A senha em texto não é necessária no código.

As implementações Docker e backend foram preservadas como alternativa com autenticação real; não são executadas no Pages. Veja [documentação do servidor](webforge/README.md) e [controles do servidor](webforge/SECURITY.md).
