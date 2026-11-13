# Armazém Dois Irmãos — demonstração WebForge

Aplicação local independente em React, TypeScript e Vite. O portal existente e seu fluxo de publicação foram preservados. O repositório tem um separador visual estático, sem autenticação de servidor; este protótipo está registrado no portal WebForge de projetos. Entre em https://guilhermebattiston.github.io/projetos/ com o acesso de demonstração fornecido separadamente.

## Executar

Na raiz do repositório projetos, com Node 24:

```powershell
npm.cmd ci --prefix armazem-dois-irmaos
npm.cmd run dev --prefix armazem-dois-irmaos
```

Abra http://127.0.0.1:5179/. Para o build estático, execute npm.cmd run build --prefix armazem-dois-irmaos; a saída é dist. Para servi-la localmente, use npm.cmd run preview --prefix armazem-dois-irmaos. As rotas usam fragmentos de URL e a base dos ativos é relativa.

## Demonstração de três minutos

1. Na capa, selecione Calcular materiais. Use o exemplo de tinta: 60 m², duas demãos, 10 m²/L por demão, 10% e embalagem de 18 L. Resultado: 13,2 L, uma embalagem.
2. Adicione à Minha obra. Em Planeje sua obra, escolha Trocar o piso. Com 20 m², 10% e 2,2 m²/caixa, são 10 caixas. Salve e veja a área reaproveitada em argamassa e rejunte.
3. Na lista, edite a quantidade solicitada ou reabra o cálculo. Revise e copie a mensagem. Mostre o botão de WhatsApp sem enviar nada.

## Implementação

- src/catalogo.ts: 30 produtos e 10 departamentos demonstrativos, busca, filtros e contato centralizado.
- src/calculos.ts, src/ferramentas.ts e src/Calculadora.tsx: motor puro e oito calculadoras (tinta, pisos, tijolos, argamassa, rejunte, concreto, reboco e rodapé).
- src/orcamento.ts e src/App.tsx: lista versionada no navegador, guia de planejamento, edição e prévia de WhatsApp. Nome, bairro e observações são temporários.
- src/style.css, src/Icon.tsx e public/obra.webp: laranja e azul da fachada de referência, barra de busca e grades da referência de catálogo; assinatura tipográfica provisória e ilustração gerada com ImageGen. Não foi usada a fachada de terceiros como imagem da loja.
- CALCULOS.md: fórmulas, exemplos e fontes de fabricantes. PESQUISA.md: evidência comercial e limitações.

O endereço da Av. Tenente Raul de Holanda, 48, Centro, Bom Conselho–PE é corroborado por cadastro público secundário. O WhatsApp principal é demonstrativo e não foi confirmado. Não há estoque, preços, condições de entrega nem promessa de orçamento recebido. A ferramenta estima materiais; não dimensiona estruturas.

## Validação

Lint e build com TypeScript passaram. 21 testes do protótipo e cinco testes do portal passaram. No navegador foram verificados os oito resultados, pesquisa e filtro, adição por catálogo e por cálculo, edição, remoção, limpeza confirmada, persistência, guia com área reaproveitada, cópia e destino do link de WhatsApp sem abri-lo. As seis telas foram medidas em 320, 360, 390, 768, 1024 e 1440 px, sem rolagem horizontal. Capturas desktop e mobile em evidencias.

Skills aplicadas: Sites (fluxo local e direção visual), ImageGen (ilustração), React Best Practices (componentes e estado derivado) e Verification (fluxo no navegador). Figma e Vercel não foram necessários para esta entrega local. Próximos passos para uso comercial: confirmar identidade e contato, substituir produtos ilustrativos por catálogo real e definir a hospedagem apropriada.
