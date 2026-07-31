const precoString = ["R$ 10.00","R$ 25.50", "R$ 75.90"];

const precosNumeros = precoString.map(preco => {
    const apenasNumeros = preco.replace("R$ ", "");
    return parseFloat(apenasNumero);
});

console.log(precosNumeros);