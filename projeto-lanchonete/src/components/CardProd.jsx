import './CardProd.css';

function CardProd({ nome, preco, imagem, quantidade, onAdicionar, onRemover }) {
    return (
        <div className="tudo">
            <div className="produto">
                <img src={imagem} alt={nome} />
                <h3>{nome}</h3>
            </div>

            <div className="preco">
                <p>R$ {preco}</p>
            </div>

            {/* Controles de quantidade por produto */}
            <div className="contador_produto">
                <button onClick={onRemover} disabled={quantidade === 0}>-</button>
                <span>{quantidade}</span>
                <button onClick={onAdicionar}> + </button>
            </div>
        </div>
    );
}

export default CardProd;