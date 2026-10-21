# Auditoria do site atual — 21/10/2026

Fonte solicitada: https://www.movelariacuritiba.com.br/

## Evidência e limite de acesso

Antes de implementar, foram solicitadas a página inicial, robots.txt e sitemap.xml por HTTPS. As três requisições falharam no proxy com `Tunnel connection failed: 403 Forbidden`. Não houve acesso ao HTML ou descoberta legítima das páginas internas. Nenhuma imagem do site foi baixada. Não há ferramenta de pesquisa web disponível. O bloqueio é deste ambiente; não demonstra falha do site oficial.

## Leitura comercial preliminar

1. **O que já faz bem:** segundo o briefing recebido, o site já reúne ambientes, móveis, galerias, formulário e WhatsApp. Isso oferece uma base institucional e canais de contato; não foi verificado diretamente.
2. **Navegação:** títulos em inglês e hierarquia confusa são hipóteses do solicitante, não achados confirmados. A proposta usa rótulos em português e categorias de ambiente consistentes.
3. **Informações dispersas:** não é possível identificar dispersão sem ver as páginas. O protótipo demonstra uma organização possível, com contatos centralizados e relação explícita entre ambiente e briefing.
4. **Portfólio:** filtros, legendas e ampliação com teclado podem facilitar a exploração. Não se afirma que o site atual não os tenha.
5. **Orçamento:** organizar ambiente, tipo e prioridades antes de abrir o WhatsApp reduz a necessidade de o visitante redigir tudo do zero. Não há dados para estimar conversão ou esforço poupado.
6. **Melhorias demonstráveis:** navegação editorial, filtro de cinco ambientes, galeria ampliada, pré-seleção de ambiente no briefing, prioridades múltiplas, edição das respostas e mensagem revisável. São funções deste protótipo, não uma comparação medida contra o original.

## Verificação pendente

Homepage, navegação e páginas internas, galerias, contatos, formulários, mobile, SEO, acessibilidade e performance permanecem sem inspeção direta. Não foram executados Lighthouse nem medições do site oficial. Confirmar identidade, serviços, entrega/montagem, CNPJ e experiência declarada quando o acesso estiver disponível. Não publicar a afirmação de mais de uma década nem o CNPJ antes dessa conferência.

Uma tentativa adicional com Chromium também falhou antes de carregar a página: `net::ERR_TUNNEL_CONNECTION_FAILED`. Não foi possível inspecionar home, páginas internas ou versão mobile.
