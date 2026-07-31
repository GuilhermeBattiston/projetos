import Header from "./components/Header";
import Login from "./components/Login";
import CardProd from "./components/CardProd";
import Funcionario from "./components/Funcionario";
import Contador from "./components/Contador";
import Calculadora from "./components/Calculadora";
import './App.css'

function App(){

    const lanches = [
        {id:1, nome: "X-salada", preco: "17.50", imagem: "/images/x-salada.jpg" },
        {id:2,nome:"X-burguer", preco: "15.90", imagem: "/images/x-burguer.jpg"},
        {id:3, nome: "Refrigerante", preco: "6.00", imagem: "/images/refrigerante.png"}
    ]

    const funcionario = [
        {id:1, nome: "Felipe", cargo: "Garçom"},
        {id:2,nome:"Luiz", cargo: "Chapeiro"},
        {id:3, nome: "Sebastian", cargo: "Segurança"}
    ]

    return(
        <>
            <Header titulo="Lanchonete e Dog" 
            subtitulo="O melhor da região"/>
            
            <Login />

            <div className="lista_cards">
                {
                lanches.map(Lanche => (
                    <CardProd
                    key = {Lanche.id}
                    nome = {Lanche.nome}
                    preco = {Lanche.preco}
                    imagem={Lanche.imagem}
                    />
                ))}
                </div>

                <div className="class_funcionario">

                {
                funcionario.map(funcionario => (
                    <Funcionario
                    key = {funcionario.id}
                    nome = {funcionario.nome}
                    cargo = {funcionario.cargo}
                    />
                ))}
                </div>
                
            <Funcionario nome= "Pedro"
            cargo= "CEO"/>

            <Contador/>

            <Calculadora/>

            


        </>
    )
}
export default App