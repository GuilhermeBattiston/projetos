# Lima Climatização — proposta institucional

Protótipo novo em React/Vite, com layout e código próprios. O HTML fornecido foi lido integralmente e usado exclusivamente como fonte comercial. A aparência anterior não foi reaproveitada. O aplicativo Tapioca Estação BR permanece separado.

## Executar localmente

Node >=22.12; validado com Node 24. Fontes e fotografias são servidas localmente.

```bash
cd /workspace/projetos/lima-climatizacao
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 5177 --strictPort
```

```bash
npm run lint
npm test
npm run build
npm run preview -- --host 0.0.0.0 --port 4177 --strictPort
```

O build estático fica em `dist/`. Para Vercel/Netlify: diretório raiz `lima-climatizacao`, build `npm run build`, saída `dist`. Não há backend, e-mail, banco de dados, autenticação, pagamentos ou agendamento automático.

## Design

Proposta técnica com azul-marinho `#101F32`, azul `#24658A`, branco, cinza claro e laranja `#E58A35` pontual. Manrope para leitura e Space Grotesk para títulos. Assinatura tipográfica provisória, hero assimétrico, serviços em composição editorial, diagrama de identidade, processo em etapas, galeria, informações de localização, FAQ e formulário com revisão. Menu mobile, foco visível, atalhos por âncoras e respeito a movimento reduzido.

Três fotografias geradas, convertidas para WebP, estão identificadas como ilustrações; não são fotos da equipe, clientes ou trabalhos da Lima. O mapa visual também é ilustrativo, sem escala ou afirmação geográfica. O link externo do Google Maps corresponde ao CID do material fornecido.

## Fontes e informações comerciais

[Auditoria completa](docs/content-audit.md) separa dados fornecidos e afirmações sem comprovação. Não há pesquisa pública independente disponível nesta sessão. Dados do HTML anterior não foram tratados como verificados publicamente.

- Nome, Curitiba, telefone, endereço e horários: fornecidos no HTML, sujeitos à confirmação com a empresa.
- Instalação, manutenção preventiva/corretiva, higienização e projetos: hipóteses demonstrativas, não uma oferta comprovada da Lima.
- Identidade visual, textos conceituais e fluxo de atendimento: propostas para aprovação.
- Nota 5,0, 31 avaliações, depoimento genérico, promessas de resposta, qualidade comprovada e alegações de experiência: omitidos.
- Não foram criados preços, clientes, parceiros, certificações, garantias, prazos, cobertura de outros municípios ou antes/depois.

## Onde editar

| Conteúdo | Arquivo |
|---|---|
| Telefone, cidade, endereço, horários, Maps | `src/config.js` |
| Serviços demonstrativos, atendimento, FAQ, galeria | `src/data/content.js` |
| Formulário, revisão e validação acessível | `src/components/QuoteForm.jsx` |
| Mensagem e URL do WhatsApp | `src/utils/quote.js` |
| Hero e apresentação | `src/components/Hero.jsx`, `src/components/Information.jsx` |
| Identidade, responsividade, estados de foco | `src/styles.css` |
| SEO básico | `index.html` |
| Fotos | `public/images/` |

WhatsApp utiliza o número **5541999927966** informado pelo solicitante. Mensagens são codificadas em `https://wa.me/...`; o formulário prepara e revisa o texto antes de oferecer o link. Nenhuma mensagem é enviada pelo site. Abrir o WhatsApp não confirma atendimento. O nome, localização e descrição ficam apenas na memória e não são gravados em localStorage. A cópia da mensagem possui feedback e tratamento de indisponibilidade da área de transferência.

## Validação

```bash
npm run lint
npm test
npm run build
python tests/browser-smoke.py
```

O smoke test requer Python + Playwright e `/usr/bin/chromium`; essas ferramentas já existem no ambiente usado. A aplicação precisa estar ativa em 5177. Para outra URL, use `LIMA_TEST_URL`. O teste não envia mensagens nem abre conversa com a empresa.

Validação concluída: lint sem erros, quatro testes unitários aprovados, build de produção concluído e smoke test aprovado tanto em desenvolvimento quanto no caminho de publicação `/projetos/lima-climatizacao/`. O artefato conjunto foi verificado com os dois sites funcionando.

Quatro testes unitários verificam campos obrigatórios, espaços em branco, caracteres especiais, codificação, destino do WhatsApp e configuração. O teste de navegador cobre imagens, fontes, links e âncoras; pré-seleção de serviço; preservação dos valores; formulário inválido/válido; revisão; cópia/edição; FAQ; menu mobile; teclado; movimento reduzido; cinco larguras (320/390/768/1024/1440); ausência de armazenamento dos dados pessoais e erros no console. Capturas ficam em `/workspace/artifacts/lima-climatizacao/`.

## GitHub Pages

O workflow em `.github/workflows/deploy-pages.yml` prepara os dois protótipos. A Tapioca permanece na raiz de `/projetos/`; este site usa a base `/projetos/lima-climatizacao/`. O build Lima precisa ser copiado para `lima-climatizacao/` dentro do artefato conjunto antes do upload.

Em Settings → Pages, a origem deve ser **GitHub Actions**. Aguarde build e deploy concluírem no workflow **Publish prototypes to GitHub Pages**. Endereço previsto depois do deploy: `https://guilhermebattiston.github.io/projetos/lima-climatizacao/`. Um push ou build local não comprova a publicação pública.

```bash
GITHUB_PAGES=true npm run build
GITHUB_PAGES=true npm run preview -- --host 0.0.0.0 --port 4177 --strictPort
LIMA_TEST_URL=http://127.0.0.1:4177/projetos/lima-climatizacao/ python tests/browser-smoke.py
```

## Antes da versão definitiva

Confirmar telefone, endereço, horários, área de atendimento e serviços reais; aprovar identidade e redação; substituir as imagens por registros autorizados; revisar privacidade, acesso ao WhatsApp e operação do atendimento; escolher domínio próprio e testar a publicação externa. Não inserir avaliações estruturadas ou alegações comerciais sem comprovação.

Ícones Lucide: licença ISC. Fontes Fontsource: licenças OFL distribuídas nos respectivos pacotes. Fotografias geradas exclusivamente para a demonstração, sem atribuição à empresa.
