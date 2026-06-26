function Contador({ quantidade, setQuantidade }) {
    return (
      <div className="Contador">
        <p>Quantidade: {quantidade}</p>
        <button onClick={() => setQuantidade(quantidade + 1)}>
          +
        </button>
        <button
          onClick={() =>
            quantidade > 0 && setQuantidade(quantidade - 1)
          }
        >
          -
        </button>
        <button onClick={() => setQuantidade(0)}>
          Zerar
        </button>
      </div>
    );
  }
  
  export default Contador;