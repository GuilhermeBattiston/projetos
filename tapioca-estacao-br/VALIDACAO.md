# Validação — Estação da Tapioca

## Atualização de apresentação — 25/11/2026

- Endereço adicionado à seção de contato e ao rodapé: Travessa Maria Ramos, Garanhuns, Brasil — CEP 55292-700. Link de busca no Google Maps.
- Informação de entregas pelo iFood e pela 99, sem links para essas plataformas, conforme pedido do usuário.
- Interface revisada para apresentação final: sem faixa de demonstração, sem opção de retirada não confirmada e sem textos de pendência técnica nos cartões de produtos. Os avisos de imagem ilustrativa e confirmação de frete foram mantidos.
- Lint, typecheck, build e os 19 testes unitários aprovados.
- Bloco de contato inspecionado visualmente em desktop e celular.
- Playwright aprovado no build: endereço e canais corretos, pedido de R$ 63,00, persistência e larguras 320, 360, 390, 768, 1024 e 1440 px, sem erros de console nem envio real de mensagem.

## Registro anterior — 24/11/2026

Atualização local da **Estação da Tapioca** no repositório `projetos`, pasta `tapioca-estacao-br`. Sem publicação nesta etapa. Nenhum arquivo dos demais protótipos, credencial ou gate do portal foi alterado.

## Resultados executados

| Verificação | Resultado |
|---|---|
| `npm run lint` | Aprovado, sem erros |
| `npm run typecheck` | Aprovado, TypeScript com `checkJs` nos arquivos React existentes |
| `npm test` | 19 testes aprovados, zero falhas |
| `npm run build` | Aprovado, Vite 7.3.7 |
| Playwright, fluxo completo no servidor local | Aprovado |
| Larguras 320, 360, 390, 768, 1024 e 1440 px | Aprovadas, página e carrinho sem overflow horizontal |
| Build servido na rota `/projetos/tapioca-estacao-br/` | Aprovado, 27 produtos, fotos e logo carregados |
| Console JavaScript nos testes de navegador | Zero erros |
| Envio real de WhatsApp | Não realizado |

O teste de navegador utilizou o Opera GX instalado, em modo headless, via Playwright 1.62.1. O navegador integrado do aplicativo apresentou timeout e erro de sessão; não foi utilizado como evidência de aprovação. As primeiras execuções de Playwright identificaram uma regra CSS que ocultava o menu mobile; ela foi corrigida. As comparações de texto também foram adaptadas para os espaços monetários e quebras de linha do Windows.

Na primeira conferência do build, o servidor de preview estava com uma base diferente da usada no build. Reiniciado com `WEBFORGE_BASE=/projetos/tapioca-estacao-br/`, a rota e os ativos passaram na verificação.

## Cobertura

- Nome oficial, metadados, ausência das variantes antigas de nome comercial, SHA-256 do logotipo original e existência dos derivados.
- 27 produtos ativos, IDs únicos, cinco categorias, contagens 4/12/3/2/6, preços individuais e fotos exclusivas com variantes WebP.
- Manteiga em dobro: R$ 10,00; três águas com gás: R$ 10,50; dois cafés: R$ 5,00.
- Pedido de exemplo: 2 manteigas + charque com mussarela + frango com catupiry + Perfeitinha + misto quente + 2 Coca-Cola = R$ 63,00.
- Quantidades, remoção, grupos/subtotais, Bauru com/sem tempero em linhas distintas e observações preservadas.
- Migração do carrinho antigo, dados inválidos, preços persistidos ignorados, persistência após recarga, limpeza e ausência de dados pessoais persistidos.
- Nome/endereço obrigatórios, rua composta só por espaços rejeitada, retirada identificada como demonstrativa e taxa de entrega desconhecida.
- Revisão, codificação da URL, destino provisório correto e cópia da mensagem com conteúdo conferido na área de transferência.
- Categorias vazias omitidas, busca por ingredientes, menu mobile, foco no modal, retorno do foco, Escape e preferência por movimento reduzido.
- Todas as imagens carregadas no navegador e inspeção visual de desktop, mobile e carrinho.

## Evidências e limites

Capturas em `tests/artifacts/`: `tela-{largura}.png`, `carrinho-{largura}.png` e `revisao.png`. A mensagem efetivamente gerada está em `EXEMPLO-PEDIDO.txt`. Os dados “Maria Teste” e “Rua de Teste” são exclusivamente de teste.

As 27 imagens são ilustrativas geradas. A revisão visual verificou as 19 massas brancas semicirculares, seus recheios e as demais fotografias. Coca-Cola e Jatobá usam recipientes genéricos sem rótulos falsos e avisos visíveis; **duas fotos oficiais de embalagem permanecem pendentes**. Os arquivos WebP individuais variam de aproximadamente 6 KB a 63 KB, sem necessidade de aumentar artificialmente o peso.

Os preços individuais somam **R$ 237,00** para uma unidade de cada produto. O valor R$ 231,00 citado no briefing é inconsistente com esses preços e não foi forçado no código. Essa divergência está protegida por teste.

Não existe backend ou painel administrativo de pedidos neste aplicativo; nenhuma integração inexistente foi simulada. As verificações não confirmam estoque, operação de delivery, recebimento pelo estabelecimento ou autorização das fotografias das marcas. Confirmar os dados comerciais listados no README antes da operação.

## Build para a rota existente

PowerShell:

```powershell
$env:WEBFORGE_BASE='/projetos/tapioca-estacao-br/'
npm run build
npm run preview -- --host 127.0.0.1 --port 5176 --strictPort
```

O mesmo caminho base deve ser usado no build e no preview. A integração existente do portal continua responsável por inserir a barreira visual durante a preparação para publicação. Não foi criado novo acesso público ou modificado o login.
