import './CardProd.css'
import Contador from './Contador'

function CardProd ({nome, preco, imagem}){

    return  (
<>

        <div className="tudo">
        <div className="produto">
            <img src={imagem} alt="nome" />
            <h3>{nome}</h3>
        </div>

        <div className="preco">
            <p>R$ {preco}</p>
        </div>
        <Contador />
        </div>

        

</>
    )
}
export default CardProd