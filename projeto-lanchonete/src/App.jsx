import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import CardProd from "./components/CardProd";
import Funcionario from "./components/Funcionario";
import Comandas from "./components/Comandas";
import Pedidos from "./components/Pedidos";
import './App.css';

function App() {
    const [carrinho, setCarrinho] = useState({});
    const [comandas, setComandas] = useState([]);
    const [tipoUsuario, setTipoUsuario] = useState(null);
    const navigate = useNavigate();

    const fazerLogin = (usuario, senha) => {
        if (senha !== '123' || !['cliente', 'admin'].includes(usuario)) {
            return false;
        }

        setTipoUsuario(usuario);
        navigate('/pedidos');
        return true;
    };

    const sair = () => {
        setTipoUsuario(null);
        setCarrinho({});
        navigate('/');
    };

    const lanches = [
        { id: 1, nome: "X-salada", preco: "17.50", imagem: "/images/x-salada.png" },
        { id: 2, nome: "X-burguer", preco: "15.90", imagem: "/images/x-burguer.png" },
        { id: 3, nome: "X-egg", preco: "17.50", imagem: "/images/x-egg.png" },
        { id: 4, nome: "Refrigerante", preco: "6.00", imagem: "/images/refrigerante.png" },
        { id: 5, nome: "Água com gás", preco: "5.50", imagem: "/images/gas.png" },
        { id: 6, nome: "Água sem gás", preco: "5.50", imagem: "/images/agua.png" },
        { id: 7, nome: "Picolé", preco: "7.00", imagem: "/images/picole.png" },
        { id: 8, nome: "Cookie", preco: "8.00", imagem: "/images/cookie.png" }
    ];

    const funcionario = [
        { id: 1, nome: "Felipe", cargo: "Garçom" },
        { id: 2, nome: "Luiz", cargo: "Chapeiro" },
        { id: 3, nome: "Sebastian", cargo: "Segurança" },
        { id: 4, nome: "Peruzzo", cargo: "CEO" }
    ];

    const adicionarItem = (id) => {
        setCarrinho(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const removerItem = (id) => {
        setCarrinho(prev => {
            const qtdAtual = prev[id] || 0;
            if (qtdAtual <= 1) {
                const novoCarrinho = { ...prev };
                delete novoCarrinho[id];
                return novoCarrinho;
            }
            return { ...prev, [id]: qtdAtual - 1 };
        });
    };

    // Função corrigida: apaga todos os itens do estado
    const limparCarrinho = () => {
        setCarrinho({});
    };

    const valorTotal = lanches.reduce((acc, item) => {
        const qtd = carrinho[item.id] || 0;
        return acc + (qtd * parseFloat(item.preco));
    }, 0);

    const enviarParaComandas = () => {
        const itens = lanches
            .filter(item => carrinho[item.id])
            .map(item => ({
                ...item,
                quantidade: carrinho[item.id],
                subtotal: carrinho[item.id] * parseFloat(item.preco)
            }));

        if (itens.length === 0) return;

        setComandas(prev => [
            ...prev,
            { id: Date.now(), itens, total: valorTotal, status: 'Em preparo' }
        ]);
        limparCarrinho();
        navigate('/pedidos');
    }

    return (
        <Routes>
            <Route path="/" element={
                tipoUsuario ? <Navigate to="/pedidos" replace /> : <Login onLogin={fazerLogin} />
            } />
            <Route path="/pedidos" element={tipoUsuario === 'cliente' ? <>
            <Header
                titulo="Lanchonete Coxa Branca"
                subtitulo="O sabor que joga junto com você"
                onLogout={sair}
            />

            {/* Seção do Carrinho de Compras */}
            <div className="carrinho_container">
                <h2>Resumo do Pedido</h2>
                {Object.keys(carrinho).length === 0 ? (
                    <p>Nenhum item selecionado.</p>
                ) : (
                    <>
                        <ul>
                            {lanches.map(item => {
                                const qtd = carrinho[item.id];
                                if (!qtd) return null;
                                const subtotal = (qtd * parseFloat(item.preco)).toFixed(2);
                                return (
                                    <li key={item.id}>
                                        {item.nome} x {qtd} — R$ {subtotal.replace('.', ',')}
                                    </li>
                                );
                            })}
                        </ul>
                        
                        {/* Botão adicionado para resetar o carrinho */}
                        <button className="btn_limpar" onClick={limparCarrinho}>
                            Limpar Carrinho
                        </button>
                        <button className="btn_enviar_comanda" onClick={enviarParaComandas}>
                            Enviar para comandas
                        </button>
                    </>
                )}
                <h3>Total: R$ {valorTotal.toFixed(2).replace('.', ',')}</h3>
            </div>

            <div className="lista_cards">
                {lanches.map(lanche => (
                    <CardProd
                        key={lanche.id}
                        nome={lanche.nome}
                        preco={lanche.preco}
                        imagem={lanche.imagem}
                        quantidade={carrinho[lanche.id] || 0}
                        onAdicionar={() => adicionarItem(lanche.id)}
                        onRemover={() => removerItem(lanche.id)}
                    />
                ))}
            </div>

            <div className="class_funcionario">
                {funcionario.map(f => (
                    <Funcionario
                        key={f.id}
                        nome={f.nome}
                        cargo={f.cargo}
                    />
                ))}
            </div>
            </> : tipoUsuario === 'admin' ? <Pedidos comandas={comandas} onSair={sair} /> : <Navigate to="/" replace />} />
            <Route path="/comandas" element={tipoUsuario === 'admin' ? <Comandas comandas={comandas} onPedidos={() => navigate('/pedidos')} onSair={sair} /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
