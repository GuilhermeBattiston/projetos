import Contador from "./Contador";

function CardProd({ nome, preco, quantidade, setQuantidade }) {
  return (
    <div className="card">
      <h2>{nome}</h2>
      <p>Preço: R$ {preco.toFixed(2)}</p>

      <Contador
        quantidade={quantidade}
        setQuantidade={setQuantidade}
      />
    </div>
  );
}

export default CardProd;