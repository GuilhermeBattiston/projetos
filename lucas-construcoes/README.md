# Lucas Construções e Reformas em Geral

Protótipo institucional novo, em React 19/Vite 7, integrado ao portal GitHub Pages. O HTML enviado foi usado apenas para extrair dados comerciais; seu layout, estilos, scripts, depoimentos e promessas foram descartados.

## Executar

Node 24 (mesma versão do workflow):

```bash
cd lucas-construcoes
npm ci
npm run dev -- --host 0.0.0.0 --port 5178
```

```bash
npm run lint
npm test
npm run build
python tests/browser-smoke.py
```

O teste de navegador usa o `dist` gerado, servidor temporário próprio, Python/Playwright e `/usr/bin/chromium`. Não envia mensagens à empresa. Capturas em `/workspace/artifacts/lucas-construcoes/`.

## Direção visual e recursos

Grafite `#202523`, off-white `#F5F3EE` e terracota `#A45130`, com Manrope e numerais Space Grotesk locais. Identidade tipográfica proposta, hero assimétrico, composição editorial, atuação em acordeão, referências com filtro e lightbox acessível, processo sugerido, contatos, CTA final e menu mobile. O menu fecha por Escape, por seleção e por clique externo; o modal restaura o foco. Movimento reduzido, foco visível, imagens WebP e âncoras com compensação para o cabeçalho.

As três imagens foram geradas para este protótipo, não são fotografias de obras da empresa. As legendas, descrições e a galeria identificam isso. Não foi possível obter fotografias licenciadas de fontes externas: o acesso ao domínio de imagens consultado retornou bloqueio de rede. Substitua os arquivos em `public/images/` por fotos reais autorizadas antes da versão definitiva. Não há portfólio, avaliações, depoimentos, garantias, valores, prazos, visitas ou histórico inventados.

Todos os CTAs de orçamento abrem uma mensagem codificada para `5541998175073` em nova aba, sem envio automático. As categorias adicionam seu assunto à mensagem. Google Maps usa o CID fornecido no HTML. Nenhuma API, formulário, cookie de rastreamento ou cadastro adicional foi adicionado ao site.

## Conteúdo e manutenção

- `src/config.js`: nome, telefone, endereço, Maps e mensagem WhatsApp.
- `src/content.js`: categorias propostas, referências e primeiro contato sugerido.
- `src/App.jsx`: componentes e interações.
- `src/styles.css`: identidade e responsividade.
- `index.html`: metadados e Open Graph. `noindex` enquanto protótipo.
- `public/images/`: imagens geradas em WebP; fontes vêm dos pacotes Fontsource (licenças OFL).
- [Auditoria de conteúdo](docs/content-audit.md): informações aproveitadas e pendentes.

Não foi incluído `aggregateRating` ou outro dado estruturado que apresente informações não verificadas como comprovação pública. O endereço, CEP, telefone, escopo de serviços e material fotográfico devem ser aprovados pelo proprietário.

## Portal e publicação

Na raiz do repositório:

```bash
npm --prefix webforge run build:pages
python webforge/tests/pages-smoke.py
```

O build inclui os três protótipos sem substituir os existentes. O acesso `lucas` direciona para `/projetos/lucas-construcoes/`; cadastro de apresentação em `webforge/pages/access.json`. O workflow instala, valida e compila o novo projeto, então publica `pages-dist`. Aguarde o workflow verde antes de avaliar o site público.

O portal do GitHub Pages é uma barreira visual acordada com o solicitante; seus arquivos são públicos. A alternativa de backend/Docker foi preservada e recebeu o novo projeto no build, mas não é usada na publicação atual.
