import './Funcionario.css'

function Funcionario({nome, cargo}){

    return  (
        <div className="funcionario">
        <p><strong>Nome: {nome}</strong></p>
        <p>Cargo: {cargo}</p>
        </div>
    );
}
export default Funcionario