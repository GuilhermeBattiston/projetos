import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const enviarLogin = (event) => {
        event.preventDefault();
        const acessoPermitido = onLogin(usuario.trim(), senha);

        if (!acessoPermitido) {
            setErro('Usuário ou senha inválidos.');
        }
    };

    return (
        <form className="login_container" onSubmit={enviarLogin}>
            <div className="login_simbolo">
                <span className="login_estrela" aria-label="Estrela dourada">★</span>
                <img
                    className="login_escudo"
                    src="/images/coritiba-escudo.png"
                    alt="Escudo do Coritiba Foot Ball Club"
                />
            </div>
            <h2>Login</h2>
            <label htmlFor="usuario">Usuário</label>
            <input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                autoComplete="username"
                required
            />
            <label htmlFor="senha">Senha</label>
            <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="current-password"
                required
            />
            {erro && <p className="login_erro" role="alert">{erro}</p>}
            <button type="submit">Entrar</button>
        </form>
    );
}
export default Login;
