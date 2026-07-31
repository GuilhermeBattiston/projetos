import './CardProd.css'

function CardProd ({nome, preco, imagem}){

    return  (
<>

        <div className="tudo">
        <div className="produto">
            <img src={imagem} alt="nome" />
            <h3>{nome}</h3>
        </div>

        <div className="preco">
            <p>{preco}</p>
        </div>
        </div>
</>
    )
}
export default CardProd