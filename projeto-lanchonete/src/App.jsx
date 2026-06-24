import Header from "./components/Header"
import Login from "./components/Login"
import CardProd from "./components/CardProd"

function App(){
  return (
    <>
      <Header titulo="Lanchonete Dogão"/>
      <Header subtitulo="O melhor da região"/>
      
      <Login />
      
      <CardProd nome="X-Salada: "
      preco="R$15,00"/>
       
      <CardProd nome="X-Burger: "
      preco="R$20,00"/>
      
      <CardProd nome="Refrigerante: "
      preco="R$7,50"/>
    </>
  )
}

export default App