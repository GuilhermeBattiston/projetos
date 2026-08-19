import { Link } from 'react-router-dom';
import './Pedidos.css';

function Pedidos({ comandas, onSair }) {
    return (
        <main className="pedidos_container">
            <header className="pedidos_cabecalho">
                <div>
                    <h1>Pedidos</h1>
                    <p>Acompanhe o status dos pedidos recebidos.</p>
                </div>
                <div className="pedidos_acoes">
                    <Link className="btn_comandas" to="/comandas">Área das comandas</Link>
                    <button className="btn_sair" type="button" onClick={onSair}>Sair</button>
                </div>
            </header>

            {comandas.length === 0 ? (
                <p className="sem_pedidos">Nenhum pedido recebido.</p>
            ) : (
                <div className="lista_pedidos">
                    {comandas.map((comanda, index) => (
                        <section className="pedido" key={comanda.id}>
                            <div>
                                <h2>Pedido #{index + 1}</h2>
                                <p>{comanda.itens.map(item => `${item.nome} x ${item.quantidade}`).join(', ')}</p>
                            </div>
                            <span className="status_pedido">{comanda.status}</span>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Pedidos;
