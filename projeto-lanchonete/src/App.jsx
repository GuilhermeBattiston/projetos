import { useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import CardProd from "./components/CardProd";
import "./App.css";

function App() {
  const [qtd, setQtd] = useState({
    salada: 0,
    burger: 0,
    refri: 0,
  });

  const precos = {
    salada: 15,
    burger: 20,
    refri: 7.5,
  };

  const total =
    qtd.salada * precos.salada +
    qtd.burger * precos.burger +
    qtd.refri * precos.refri;

  return (
    <>
      <Header titulo="Lanchonete Dogão" />
      <Header subtitulo="O melhor da região" />

      <Login />

      <div className="produto1">
        <CardProd
          nome="X-Salada"
          preco={precos.salada}
          quantidade={qtd.salada}
          setQuantidade={(v) =>
            setQtd({ ...qtd, salada: v })
          }
        />
      </div>

      <div className="produto2">
        <CardProd
          nome="X-Burger"
          preco={precos.burger}
          quantidade={qtd.burger}
          setQuantidade={(v) =>
            setQtd({ ...qtd, burger: v })
          }
        />
      </div>

      <div className="produto3">
        <CardProd
          nome="Refrigerante"
          preco={precos.refri}
          quantidade={qtd.refri}
          setQuantidade={(v) =>
            setQtd({ ...qtd, refri: v })
          }
        />
      </div>

      <h2>Total do pedido: R$ {total.toFixed(2)}</h2>
    </>
  );
}

export default App;