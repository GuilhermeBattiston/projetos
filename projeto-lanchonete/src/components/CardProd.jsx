import './CardProd.css'

function CardProd(props){
    
    return(
        <>
       
            <div className='produto'>
                <h3>{props.nome}</h3>
            </div>
            <div className='preco'>
                <p>{props.preco}</p>
            </div>
       
        </>
    )
}
export default CardProd