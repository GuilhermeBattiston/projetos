import './Login.css'

function Login(){
    return(
        <section className="login_container">
            <h2>Login</h2>
            <input type="text" placeholder="Usuário" />
            <input type="password" placeholder="Senha" />
            <button type="button">Entrar</button>
            <a href="#">Esqueceu a senha?</a>
        </section>
        
    )
}
export default Login
