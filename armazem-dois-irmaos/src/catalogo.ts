const endereco = 'Av. Tenente Raul de Holanda, 48, Centro';
const cidade = 'Bom Conselho — PE';

export const loja = {
  nome: 'Armazém Dois Irmãos',
  slogan: 'Tudo para a sua construção!',
  cidade,
  endereco,
  enderecoConfirmado: true,
  whatsapp: '5587981814264',
  whatsappConfirmado: false,
  telefone: '(87) 98181-4264',
  mapa: 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(endereco + ', ' + cidade),
};

export type Departamento = {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
};

function departamento(id: string, nome: string, descricao: string): Departamento {
  return { id, nome, descricao, icone: id };
}

export const departamentos = [
  departamento('basica', 'Construção básica', 'Blocos e agregados para o começo da obra.'),
  departamento('cimentos', 'Cimentos e argamassas', 'Materiais em saco para assentamento e preparo.'),
  departamento('tintas', 'Tintas e acessórios', 'Tintas, pincéis e rolos para renovar superfícies.'),
  departamento('pisos', 'Pisos e revestimentos', 'Cerâmicas, revestimentos e rejuntes.'),
  departamento('hidraulica', 'Hidráulica', 'Tubos, conexões e registros.'),
  departamento('eletrica', 'Elétrica', 'Cabos, tomadas e eletrodutos.'),
  departamento('ferramentas', 'Ferramentas', 'Instrumentos para medir, assentar e nivelar.'),
  departamento('ferragens', 'Ferragens', 'Fixadores e acessórios para instalação.'),
  departamento('acabamentos', 'Acabamentos', 'Rodapés e peças para finalizar ambientes.'),
  departamento('reservatorios', "Caixas d’água", 'Reservatórios e acessórios para armazenamento de água.'),
];

export type Produto = {
  id: string;
  nome: string;
  departamento: string;
  descricao: string;
  unidade: string;
  embalagem: string;
  caracteristicas: string[];
  imagem?: string;
  demonstrativo: true;
};

function produto(
  id: string,
  nome: string,
  departamento: string,
  descricao: string,
  unidade: string,
  embalagem: string,
  ...caracteristicas: string[]
): Produto {
  return { id, nome, departamento, descricao, unidade, embalagem, caracteristicas, demonstrativo: true };
}

export const produtos: Produto[] = [
  produto('cimento-50', 'Cimento Portland', 'cimentos', 'Exemplo de cimento ensacado. Confira o tipo indicado para a aplicação.', 'saco', '50 kg', 'Cimento em pó'),
  produto('tinta-18', 'Tinta acrílica branca', 'tintas', 'Exemplo para pintura de paredes. Consulte a indicação de superfície e o rendimento da embalagem.', 'lata', '18 L', 'Branca', 'Acrílica'),
  produto('piso-60', 'Piso cerâmico 60 × 60 cm', 'pisos', 'Exemplo de piso cerâmico. Confirme a cobertura por caixa, o local de uso e o lote.', 'caixa', '2,16 m²', '60 × 60 cm', 'Cerâmica'),
  produto('argamassa-20', 'Argamassa colante AC-II', 'cimentos', 'Exemplo de argamassa colante. Escolha conforme a peça, a superfície e a ficha do fabricante.', 'saco', '20 kg', 'AC-II', 'Colante'),
  produto('bloco-ceramico', 'Bloco cerâmico de vedação', 'basica', 'Exemplo de bloco para alvenaria de vedação, sem indicação estrutural.', 'unidade', '9 × 19 × 19 cm', 'Cerâmica', 'Vedação'),
  produto('rejunte-1', 'Rejunte cimentício', 'pisos', 'Exemplo de rejunte para revestimento. Confira compatibilidade, largura de junta e consumo na ficha técnica.', 'pacote', '1 kg', 'Cinza', 'Cimentício'),
  produto('areia-media', 'Areia média ensacada', 'basica', 'Agregado de granulometria média. Uso e volume dependem do serviço definido para a obra.', 'saco', '20 kg', 'Areia média'),
  produto('brita-1', 'Brita 1 ensacada', 'basica', 'Agregado graúdo para composições especificadas por profissional.', 'saco', '20 kg', 'Brita 1'),
  produto('reboco-20', 'Argamassa pronta para revestimento', 'cimentos', 'Exemplo de material industrializado para revestir superfícies. Consulte o consumo específico do produto.', 'saco', '20 kg', 'Revestimento', 'Reboco'),
  produto('tinta-36', 'Tinta acrílica branca', 'tintas', 'Exemplo de embalagem menor. Confira o rendimento na ficha do fabricante.', 'galão', '3,6 L', 'Branca', 'Acrílica'),
  produto('rolo-23', 'Rolo de pintura', 'tintas', 'Acessório para pintura. Selecione a altura do pelo conforme a superfície.', 'unidade', '23 cm', 'Pintura', 'Rolo'),
  produto('pincel-2', 'Pincel para recortes', 'tintas', 'Acessório para pintar bordas e cantos.', 'unidade', '2 pol.', 'Pintura', 'Pincel'),
  produto('fita-24', 'Fita crepe de pintura', 'tintas', 'Acessório para mascarar áreas durante a pintura. Consulte compatibilidade com a superfície.', 'rolo', '24 mm × 50 m', 'Mascaramento'),
  produto('revestimento-30x60', 'Revestimento cerâmico 30 × 60 cm', 'pisos', 'Exemplo de revestimento para parede. Confira lote, acabamento e cobertura da caixa.', 'caixa', '1,8 m²', '30 × 60 cm', 'Parede'),
  produto('tubo-25', 'Tubo PVC soldável', 'hidraulica', 'Tubo demonstrativo. Confirme aplicação e dimensões com o responsável pela instalação.', 'barra', '25 mm × 3 m', 'PVC', 'Soldável'),
  produto('joelho-25', 'Joelho PVC soldável 90°', 'hidraulica', 'Conexão para mudança de direção, com dimensão compatível a verificar.', 'unidade', '25 mm', 'PVC', 'Soldável', '90°'),
  produto('registro-34', 'Registro de esfera', 'hidraulica', 'Exemplo de registro. Confirme rosca, pressão e aplicação conforme o projeto.', 'unidade', '¾ pol.', 'Rosca', 'Esfera'),
  produto('cabo-25', 'Cabo flexível de cobre', 'eletrica', 'Bitola ilustrativa. A escolha deve seguir o dimensionamento do circuito.', 'rolo', '2,5 mm² × 100 m', 'Flexível', 'Cobre'),
  produto('tomada-10', 'Tomada de embutir', 'eletrica', 'Exemplo de tomada com aterramento. Confirme a corrente e a compatibilidade na instalação.', 'unidade', '10 A', '2P+T', 'Embutir'),
  produto('eletroduto-20', 'Eletroduto corrugado', 'eletrica', 'Exemplo de conduíte. Confira a especificação do projeto antes de selecionar.', 'rolo', '20 mm × 25 m', 'Corrugado'),
  produto('trena-5', 'Trena retrátil', 'ferramentas', 'Ferramenta para conferir as medidas de paredes, pisos e peças.', 'unidade', '5 m', 'Medição'),
  produto('desempenadeira', 'Desempenadeira dentada', 'ferramentas', 'Ferramenta para espalhar argamassa. Confira o perfil indicado na ficha do produto.', 'unidade', '28 cm', 'Assentamento', 'Dentada'),
  produto('nivel-40', 'Nível de bolha', 'ferramentas', 'Ferramenta manual para conferir alinhamento e nivelamento.', 'unidade', '40 cm', 'Nivelamento'),
  produto('parafuso-40', 'Parafuso para fixação', 'ferragens', 'Exemplo de fixador. Confirme compatibilidade com a base e a aplicação.', 'pacote', '20 peças · 4 × 40 mm', 'Fixação'),
  produto('bucha-8', 'Bucha plástica', 'ferragens', 'Exemplo de bucha para fixação. Selecione de acordo com a base, o parafuso e o uso.', 'pacote', '20 peças · 8 mm', 'Fixação', 'Plástica'),
  produto('rodape-24', 'Rodapé branco', 'acabamentos', 'Peça para acabamento no encontro entre piso e parede.', 'peça', '2,4 m', 'Branco', 'Acabamento'),
  produto('perfil-transicao', 'Perfil de transição para pisos', 'acabamentos', 'Exemplo de perfil para encontros entre revestimentos. Confirme o desnível e o encaixe.', 'peça', '1 m', 'Transição'),
  produto('caixa-500', 'Caixa d’água de polietileno', 'reservatorios', 'Exemplo de reservatório. Capacidade e instalação dependem do projeto e da ficha do produto.', 'unidade', '500 L', 'Polietileno', 'Com tampa'),
  produto('caixa-1000', 'Caixa d’água de polietileno', 'reservatorios', 'Exemplo de reservatório. Confirme o espaço, a capacidade necessária e a instalação.', 'unidade', '1.000 L', 'Polietileno', 'Com tampa'),
  produto('torneira-boia', 'Torneira de boia', 'reservatorios', 'Acessório demonstrativo para controle de nível. Confira a conexão e as condições de uso.', 'unidade', '¾ pol.', 'Rosca', 'Controle de nível'),
];

function normalizar(valor: string): string {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

const indice = produtos.map((item) => ({
  item,
  texto: normalizar([
    item.nome,
    departamentos.find((grupo) => grupo.id === item.departamento)?.nome,
    item.descricao,
    item.embalagem,
    ...item.caracteristicas,
  ].join(' ')),
}));

export function filtrarProdutos(busca: string, departamento?: string, caracteristica?: string): Produto[] {
  const termos = normalizar(busca).trim().split(/\s+/).filter(Boolean);
  return indice
    .filter(({ item, texto }) =>
      (!departamento || departamento === 'todos' || item.departamento === departamento) &&
      (!caracteristica || caracteristica === 'todas' || item.caracteristicas.includes(caracteristica)) &&
      termos.every((termo) => texto.includes(termo)),
    )
    .map(({ item }) => item);
}
