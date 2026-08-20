import './Comandas.css';

function Comandas({ comandas, onPedidos, onHistorico, onSair, onAlterarStatus }) {
    return (
        <main className="comandas_container">
            <div className="comandas_cabecalho">
                <div>
                    <h1>Comandas do Coxa</h1>
                    <p>Pedidos enviados pela torcida alviverde.</p>
                </div>
                <div className="comandas_acoes">
                    <button className="btn_voltar" type="button" onClick={onPedidos}>
                        Pedidos
                    </button>
                    <button className="btn_voltar" type="button" onClick={onHistorico}>
                        Histórico
                    </button>
                    <button className="btn_voltar" type="button" onClick={onSair}>
                        Sair
                    </button>
                </div>
            </div>

            {comandas.length === 0 ? (
                <p className="sem_comandas">Nenhuma comanda enviada.</p>
            ) : (
                <div className="lista_comandas">
                    {comandas.map((comanda, index) => (
                        <section className="comanda" key={comanda.id}>
                            <h2>Comanda #{index + 1}</h2>
                            <ul>
                                {comanda.itens.map(item => (
                                    <li key={item.id}>
                                        {item.nome} x {item.quantidade} — R$ {item.subtotal.toFixed(2).replace('.', ',')}
                                    </li>
                                ))}
                            </ul>
                            <strong>Total: R$ {comanda.total.toFixed(2).replace('.', ',')}</strong>
                            <label className="status_comanda">
                                Status
                                <select
                                    value={comanda.status}
                                    onChange={(event) => onAlterarStatus(comanda.id, event.target.value)}
                                >
                                    <option value="Em preparo">Em preparo</option>
                                    <option value="Pronto">Pronto</option>
                                    <option value="Entregue">Entregue</option>
                                </select>
                            </label>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Comandas;
