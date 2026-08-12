import './Header.css'

function Header({titulo, subtitulo}){
    return(
        <header className="titulo">
            <div>
                <div className="escudo_com_estrela">
                    <span className="estrela_dourada" aria-label="Estrela dourada">★</span>
                    <img className="escudo_coritiba" src="/images/coritiba-escudo.png" alt="Escudo do Coritiba Foot Ball Club" />
                </div>
                <h1>{titulo}</h1>
                <h2>{subtitulo}</h2>
            </div>
        </header>
    )
}
export default Header
