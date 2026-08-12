import './Comandas.css';
import { Link } from 'react-router-dom';

function Comandas({ comandas }) {
    return (
        <main className="comandas_container">
            <div className="comandas_cabecalho">
                <div>
                    <h1>Comandas do Coxa</h1>
                    <p>Pedidos enviados pela torcida alviverde.</p>
                </div>
                <Link className="btn_voltar" to="/">
                    Voltar ao cardápio
                </Link>
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
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Comandas;
