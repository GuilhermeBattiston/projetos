import './Login.css'

function Login(){
    return(
    <>
        <div className='container'>
            <h2>Login</h2>
            <input type="text" placeholder='Usuário' />
            <input type="text" placeholder='Senha' />
            <button>Enviar</button>
        </div>
    </>
    )
}

export default Login 