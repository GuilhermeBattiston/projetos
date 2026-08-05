import './Calculadora.css'
import {useState} from "react";

function Calculadora(){
    const [ qtdXburger, setQtdXburger] = useState(0);
    const [ qtdXsalada, setQtdXsalada] = useState(0);
    const [qtdXegg, setQtdXegg] = useState(0);
    const [qtdRefri, setQtdRefri] = useState(0);
    const [qtdGas, setQtdGas] = useState(0);
    const [qtdAgua, setQtdAgua] = useState(0);
    const [qtdPicole, setQtdPicole] = useState(0);
    const [qtdCookie, setQtdCookie] = useState(0);

    const precoXburger = 15.90;
    const precoXsalada = 17.90;
    const precoXegg = 17.50;
    const precoRefri = 6.00;
    const precoGas = 5.50;
    const precoAgua = 5.50;
    const precoPicole = 7.00;
    const precoCookie = 8.00;

    const total = (qtdXburger * precoXburger) + (qtdRefri * precoRefri) + (qtdXsalada * precoXsalada) + (qtdGas * precoGas) + (qtdAgua * precoAgua) + (qtdXegg * precoXegg) + (qtdPicole * precoPicole) + (qtdCookie * precoCookie)


   
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

            <h3>X-Egg - R$ 17,50</h3>
            <button onClick={() => setQtdXegg(qtdXegg + 1)}>+</button>
            <p>{qtdXegg}</p>
            <button onClick={() => { if (qtdXegg > 0){setQtdXegg(qtdXegg - 1);}}}>-</button>

            <h3>Refrigerante - R$ 6,00</h3>
            <button onClick={() => setQtdRefri(qtdRefri + 1)}>+</button>
            <p>{qtdRefri}</p>
            <button onClick={() => { if (qtdRefri > 0){setQtdRefri(qtdRefri - 1);}}}>-</button>

            <h3>Água com gás - R$ 5,50</h3>
            <button onClick={() => setQtdGas(qtdGas + 1)}>+</button>
            <p>{qtdGas}</p>
            <button onClick={() => { if (qtdGas > 0){setQtdGas(qtdGas - 1);}}}>-</button>

            <h3>Água sem gás - R$ 5,50</h3>
            <button onClick={() => setQtdAgua(qtdAgua + 1)}>+</button>
            <p>{qtdAgua}</p>
            <button onClick={() => { if (qtdAgua > 0){setQtdAgua(qtdAgua - 1);}}}>-</button>

            <h3>Picolé - R$ 7,00</h3>
            <button onClick={() => setQtdPicole(qtdPicole + 1)}>+</button>
            <p>{qtdPicole}</p>
            <button onClick={() => { if (qtdPicole > 0){setQtdPicole(qtdPicole - 1);}}}>-</button>

            <h3>Cookie - R$ 8,00</h3>
            <button onClick={() => setQtdCookie(qtdCookie + 1)}>+</button>
            <p>{qtdCookie}</p>
            <button onClick={() => { if (qtdCookie > 0){setQtdCookie(qtdCookie - 1);}}}>-</button>

            <h1>Total: R$ {(total).toFixed(2)}</h1>

            <button onClick={() => { setQtdXburger(0); setQtdXsalada(0); setQtdRefri(0); setQtdGas(0); setQtdAgua(0); setQtdXegg(0); setQtdPicole(0); setQtdCookie(0); }}>Limpar</button>

        </div>
</>             
    )
}

export default Calculadora