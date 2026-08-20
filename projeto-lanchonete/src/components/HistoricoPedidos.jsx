import './HistoricoPedidos.css';

function HistoricoPedidos({ comandas, onComandas, onSair }) {
    return (
        <main className="historico_container">
            <div className="historico_cabecalho">
                <div>
                    <h1>Histórico de pedidos</h1>
                    <p>Todos os pedidos feitos na lanchonete.</p>
                </div>
                <div className="historico_acoes">
                    <button className="btn_historico" type="button" onClick={onComandas}>
                        Comandas ativas
                    </button>
                    <button className="btn_sair_historico" type="button" onClick={onSair}>
                        Sair
                    </button>
                </div>
            </div>

            {comandas.length === 0 ? (
                <p className="sem_historico">Nenhum pedido feito.</p>
            ) : (
                <div className="lista_historico">
                    {comandas.map((comanda, index) => (
                        <section className="pedido_historico" key={comanda.id}>
                            <div>
                                <h2>Pedido #{index + 1}</h2>
                                <p>{comanda.itens.map(item => `${item.nome} x ${item.quantidade}`).join(', ')}</p>
                            </div>
                            <div className="historico_resumo">
                                <span className="status_historico">{comanda.status}</span>
                                <strong>R$ {comanda.total.toFixed(2).replace('.', ',')}</strong>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}

export default HistoricoPedidos;