import Header from "./components/Header";
import Login from "./components/Login";
import CardProd from "./components/CardProd";
import Funcionario from "./components/Funcionario";
import Contador from "./components/Contador";
import Calculadora from "./components/Calculadora";
import './App.css'

function App(){

    const lanches = [
        {id:1, nome: "X-salada", preco: "17.50", imagem: "/images/x-salada.png" },
        {id:2, nome:"X-burguer", preco: "15.90", imagem: "/images/x-burguer.png"},
        {id:3, nome: "X-egg", preco: "17.50", imagem: "/images/x-egg.png"},
        {id:4, nome: "Refrigerante", preco: "6.00", imagem: "/images/refrigerante.png"},
        {id:5, nome: "Água com gás", preco: "5.50", imagem: "/images/gas.png"},
        {id:6, nome: "Água sem gás", preco: "5.50", imagem: "/images/agua.png"},
        {id:7, nome: "Picolé", preco: "7.00", imagem: "/images/picole.png"},
        {id:8, nome: "Cookie", preco: "8.00", imagem: "/images/cookie.png"}
    ]

    const funcionario = [
        {id:1, nome: "Felipe", cargo: "Garçom"},
        {id:2,nome:"Luiz", cargo: "Chapeiro"},
        {id:3, nome: "Sebastian", cargo: "Segurança"},
        {id:4, nome: "Peruzzo", cargo: "CEO"}
    ]

    return(
        <>
            <Header titulo="Lanchonete" 
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

            

            <Calculadora/>

            


        </>
    )
}
export default App