import './Calculadora.css'
import {useState} from "react";

function Calculadora(){
    const [ qtdXburger, setQtdXburger] = useState(0);
    const [ qtdXsalada, setQtdXsalada] = useState(0);
    const [qtdRefri, setQtdRefri] = useState(0);

    const precoXburger = 15.90;
    const precoXsalada = 17.90;
    const precoRefri = 6.00;

    const total = (qtdXburger * precoXburger) + (qtdRefri * precoRefri) + (qtdXsalada * precoXsalada)

   

    return(
<>
        <div className="Calculadora">
            <h1>Calculadora de Pedidos</h1>

            <h3>X-Burger - R$ 15,90</h3>
            <button onClick={() => setQtdXburger(qtdXburger + 1)}>+</button>
            <p>{qtdXburger}</p>
            <button onClick={() => { if (qtdXburger > 0){setQtdXburger(qtdXburger - 1);}}}>-</button>

            <h3>X-Salada - R$ 17,90</h3>
            <button onClick={() => setQtdXsalada(qtdXsalada + 1)}>+</button>
            <p>{qtdXsalada}</p>
            <button onClick={() => { if (qtdXsalada > 0){setQtdXsalada(qtdXsalada - 1);}}}>-</button>

            <h3>Refrigerante - R$ 6,00</h3>
            <button onClick={() => setQtdRefri(qtdRefri + 1)}>+</button>
            <p>{qtdRefri}</p>
            <button onClick={() => { if (qtdRefri > 0){setQtdRefri(qtdRefri - 1);}}}>-</button>

            <h1>Total: R$ {(total).toFixed(2)}</h1>

            <button onClick={() => { setQtdXburger(0); setQtdXsalada(0); setQtdRefri(0); }}>Limpar</button>

        </div>
</>             
    )
}

export default Calculadora