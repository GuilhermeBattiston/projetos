export interface Option {
  id: string;
  label: string;
  image?: string;
}
export const environments: Option[] = [
  { id: "cozinha", label: "Cozinha", image: "kitchen" },
  { id: "dormitorio", label: "Dormitório", image: "bedroom" },
  { id: "closet", label: "Closet", image: "closet" },
  { id: "sala", label: "Sala", image: "living" },
  { id: "escritorio", label: "Escritório", image: "office" },
  { id: "outro", label: "Outro" },
];
export const needs: Option[] = [
  { id: "aproveitar", label: "Aproveitar melhor o espaço" },
  { id: "renovar", label: "Renovar o ambiente" },
  { id: "organizar", label: "Organizar o mobiliário" },
  { id: "novo", label: "Planejar um imóvel novo" },
  { id: "outra", label: "Outra necessidade" },
];
export const styles: Option[] = [
  { id: "minimalista", label: "Minimalista" },
  { id: "contemporanea", label: "Contemporânea" },
  { id: "natural", label: "Natural" },
  { id: "classica", label: "Clássica" },
  { id: "indefinida", label: "Ainda não tenho preferência" },
];
export const navigation = [
  ["ambientes", "Ambientes"],
  ["solucoes", "Soluções"],
  ["inspiracoes", "Inspirações"],
  ["sobre", "Sobre"],
  ["contato", "Contato"],
];
export interface Reference {
  id: string;
  category: string;
  image: string;
  title: string;
  alt: string;
  environment: string;
}
export const gallery: Reference[] = [
  {
    id: "cozinha",
    category: "Cozinhas",
    image: "kitchen",
    title: "Rotina com outro ritmo",
    alt: "Referência ilustrativa de cozinha com armários amadeirados e portas em tom argila.",
    environment: "cozinha",
  },
  {
    id: "dormitorio",
    category: "Dormitórios",
    image: "bedroom",
    title: "Um lugar para desacelerar",
    alt: "Referência ilustrativa de dormitório com roupeiro e nichos integrados.",
    environment: "dormitorio",
  },
  {
    id: "closet",
    category: "Closets",
    image: "closet",
    title: "O que importa, por perto",
    alt: "Referência ilustrativa de closet de madeira com armazenamento e cabideiros.",
    environment: "closet",
  },
  {
    id: "sala",
    category: "Salas",
    image: "living",
    title: "Tempo de estar junto",
    alt: "Referência ilustrativa de sala de estar com estante e móveis integrados.",
    environment: "sala",
  },
  {
    id: "office",
    category: "Home offices",
    image: "office",
    title: "Espaço para as suas ideias",
    alt: "Referência ilustrativa de escritório residencial com bancada e estante.",
    environment: "escritorio",
  },
  {
    id: "integrados",
    category: "Integrados",
    image: "integrated",
    title: "Ambientes em conversa",
    alt: "Referência ilustrativa de cozinha, jantar e estar conectados.",
    environment: "outro",
  },
];
export const solutions = [
  [
    "Aproveitar",
    "O que cabe no espaço e o que precisa estar à mão? Olhar para os usos ajuda a organizar as primeiras ideias.",
  ],
  [
    "Organizar",
    "Guardar também é escolher como encontrar. Pense no que faz parte da sua rotina e no lugar de cada coisa.",
  ],
  [
    "Conectar",
    "Formas e referências ajudam a pensar o mobiliário em relação ao ambiente. A sua maneira de viver orienta a conversa.",
  ],
];
export const journey = [
  ["Escolha o ambiente", "Conte qual espaço você tem em mente."],
  ["Compartilhe a necessidade", "O que você quer mudar ou aproveitar melhor?"],
  [
    "Reúna suas referências",
    "Informe localização e preferências, se já souber.",
  ],
  ["Comece uma conversa", "Consulte a empresa sobre as possibilidades."],
];
