export const navigation = [
  ["ambientes", "Ambientes"],
  ["moveis", "Móveis sob medida"],
  ["projetos", "Projetos"],
  ["sobre", "Sobre"],
  ["contato", "Contato"],
];
export interface Option {
  id: string;
  label: string;
}
export const environments: Option[] = [
  { id: "cozinha", label: "Cozinha" },
  { id: "sala", label: "Sala" },
  { id: "banheiro", label: "Banheiro" },
  { id: "quarto", label: "Quarto" },
  { id: "escritorio", label: "Escritório" },
  { id: "outro", label: "Outro" },
];
export const projectTypes: Option[] = [
  { id: "novo", label: "Móvel novo" },
  { id: "renovacao", label: "Renovação do ambiente" },
  { id: "armario", label: "Armário planejado" },
  { id: "painel", label: "Painel" },
  { id: "outro", label: "Outro" },
];
export const priorities: Option[] = [
  { id: "espaco", label: "Aproveitamento de espaço" },
  { id: "organizacao", label: "Organização" },
  { id: "estetica", label: "Estética" },
  { id: "funcionalidade", label: "Funcionalidade" },
  { id: "personalizacao", label: "Personalização" },
];
export const gallery = [
  {
    id: "kitchen",
    image: "hero",
    category: "Cozinhas",
    environment: "cozinha",
    title: "Uma cozinha que participa da casa",
    detail: "Integração entre bancada, armários e área de convivência.",
    alt: "Referência ilustrativa de cozinha com ilha e marcenaria de madeira.",
  },
  {
    id: "living",
    image: "living",
    category: "Salas",
    environment: "sala",
    title: "Espaço para reunir",
    detail: "Painel, estantes e organização em uma composição contínua.",
    alt: "Referência ilustrativa de sala com painel de madeira e estantes.",
  },
  {
    id: "bathroom",
    image: "bathroom",
    category: "Banheiros",
    environment: "banheiro",
    title: "O essencial, bem resolvido",
    detail: "Uma referência de proporção e armazenamento no banheiro.",
    alt: "Referência ilustrativa de banheiro com gabinete de madeira e espelho.",
  },
  {
    id: "bedroom",
    image: "bedroom",
    category: "Quartos",
    environment: "quarto",
    title: "Um lugar para desacelerar",
    detail: "Mobiliário integrado e uma atmosfera tranquila.",
    alt: "Referência ilustrativa de quarto com armários integrados.",
  },
  {
    id: "office",
    image: "office",
    category: "Escritórios",
    environment: "escritorio",
    title: "Concentração encontra espaço",
    detail: "Bancada e estantes organizadas para uma rotina de trabalho.",
    alt: "Referência ilustrativa de escritório com bancada e estantes de madeira.",
  },
];
export const furniture = [
  [
    "01",
    "Armários",
    "Guardar bem começa por entender o que faz parte da sua rotina.",
  ],
  [
    "02",
    "Cristaleiras",
    "Um lugar para organizar e deixar à vista o que você gosta.",
  ],
  ["03", "Painéis", "Mobiliário e arquitetura em uma mesma composição."],
  [
    "04",
    "Móveis para churrasqueira",
    "Ideias para organizar o espaço de encontros.",
  ],
];
