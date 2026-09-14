export type ExperienceCategory =
  "todas" | "cultura" | "gastronomia" | "natureza";

export type TierKey = "essential" | "comfort" | "premium";

export const routeStops = [
  {
    city: "Londres",
    stay: "2 noites",
    country: "Inglaterra",
    countryCode: "GB",
    transport: "Eurostar",
  },
  {
    city: "Paris",
    stay: "2 noites",
    country: "França",
    countryCode: "FR",
    transport: "TGV Lyria",
  },
  {
    city: "Zurique",
    stay: "2 noites",
    country: "Suíça",
    countryCode: "CH",
    transport: "Panorâmico",
  },
  {
    city: "Munique",
    stay: "1 noite",
    country: "Alemanha",
    countryCode: "DE",
    transport: null,
  },
] as const satisfies ReadonlyArray<{
  city: string;
  stay: string;
  country: string;
  countryCode: "GB" | "FR" | "CH" | "DE";
  transport: string | null;
}>;

export const itineraryStages = [
  {
    id: "londres-1",
    day: 1,
    period: "Dia 1",
    city: "Londres",
    title: "Chegada e primeiras paisagens",
    rhythm: "Leve",
    image: "/proposal/hero-london.jpg",
    imageAlt: "Vista aérea do rio Tâmisa e da Tower Bridge, em Londres",
    summary:
      "Tempo para chegada, adaptação ao fuso e um primeiro contato com a cidade em ritmo tranquilo.",
    transport: "Deslocamentos e horários serão confirmados na proposta final.",
    highlight: "Chegada e primeiro contato com a cidade",
    activities: [
      "Chegada e acomodação com tempo livre (30 min)",
      "Passeio leve pela região central (1h)",
      "Noite aberta para escolhas pessoais (livre)",
    ],
    optionalActivities: [
      "Passeio noturno pelos bairros centrais (1h30)",
      "Visita a um mercado tradicional local (1h)",
    ],
  },
  {
    id: "londres-2",
    day: 2,
    period: "Dia 2",
    city: "Londres",
    title: "Marcos históricos às margens do Tâmisa",
    rhythm: "Moderado",
    image: "/proposal/hero-london.jpg",
    imageAlt: "Vista aérea do rio Tâmisa e da Tower Bridge, em Londres",
    summary:
      "Um dia dedicado à caminhada de reconhecimento pelos marcos centrais da cidade, junto ao Tâmisa.",
    transport: "Deslocamentos e horários serão confirmados na proposta final.",
    highlight: "Caminhada de reconhecimento às margens do Tâmisa",
    activities: [
      "Caminhada de reconhecimento às margens do Tâmisa (2h)",
      "Visita a um marco histórico central (1h30)",
      "Tempo livre para descobertas pelo bairro (1h)",
    ],
    optionalActivities: [
      "Programa cultural sujeito à agenda do período (2h)",
      "Passeio panorâmico pelo rio (1h)",
    ],
  },
  {
    id: "paris-1",
    day: 3,
    period: "Dia 3",
    city: "Paris",
    title: "Chegada e bairros centrais",
    rhythm: "Leve",
    image: "/proposal/paris.jpg",
    imageAlt: "Ponte Alexandre III iluminada ao entardecer, em Paris",
    summary:
      "Chegada a Paris com tempo para se instalar e um primeiro percurso pelos bairros centrais.",
    transport: "Conexão ferroviária e traslados sujeitos à disponibilidade.",
    highlight: "Primeiro contato com os bairros centrais",
    activities: [
      "Traslado e acomodação com tempo livre (30 min)",
      "Percurso panorâmico pelos bairros centrais (1h30)",
      "Tempo livre para cafés e pequenas descobertas (livre)",
    ],
    optionalActivities: [
      "Sessão de compras em bairros de referência (2h)",
      "Cruzeiro pelo Sena com vista noturna (1h)",
    ],
  },
  {
    id: "paris-2",
    day: 4,
    period: "Dia 4",
    city: "Paris",
    title: "Arte e fim de tarde junto ao Sena",
    rhythm: "Moderado",
    image: "/proposal/paris.jpg",
    imageAlt: "Ponte Alexandre III iluminada ao entardecer, em Paris",
    summary:
      "Uma janela reservada para uma referência cultural e o fim de tarde junto ao Sena.",
    transport: "Conexão ferroviária e traslados sujeitos à disponibilidade.",
    highlight: "Fim de tarde junto ao Sena",
    activities: [
      "Janela reservada para visita cultural (2h)",
      "Caminhada até as margens do Sena (45 min)",
      "Fim de tarde junto ao Sena (1h)",
    ],
    optionalActivities: [
      "Visita a um museu adicional, conforme interesse (2h)",
      "Jantar com vista para um marco iluminado (1h30)",
    ],
  },
  {
    id: "zurique-1",
    day: 5,
    period: "Dia 5",
    city: "Zurique",
    title: "Centro histórico e transição alpina",
    rhythm: "Leve",
    image: "/proposal/zurich.jpg",
    imageAlt: "Vila entre montanhas e cachoeiras nos Alpes suíços",
    summary:
      "Chegada à etapa alpina com um passeio tranquilo pelo centro histórico.",
    transport: "Trechos panorâmicos definidos após a escolha das hospedagens.",
    highlight: "Primeiro contato com o centro histórico",
    activities: [
      "Traslado e acomodação com tempo livre (30 min)",
      "Passeio pelo centro histórico (1h30)",
      "Período de descanso junto ao lago (livre)",
    ],
    optionalActivities: [
      "Degustação de gastronomia local (1h)",
      "Passeio de barco pelo lago, conforme estação (1h)",
    ],
  },
  {
    id: "zurique-2",
    day: 6,
    period: "Dia 6",
    city: "Zurique",
    title: "Paisagens alpinas em ritmo tranquilo",
    rhythm: "Leve",
    image: "/proposal/zurich.jpg",
    imageAlt: "Vila entre montanhas e cachoeiras nos Alpes suíços",
    summary:
      "Um dia de rota panorâmica pelas paisagens alpinas, com paradas livres ao longo do caminho.",
    transport: "Trechos panorâmicos definidos após a escolha das hospedagens.",
    highlight: "Paisagens alpinas em ritmo tranquilo",
    activities: [
      "Rota panorâmica com paradas livres (2h30)",
      "Tempo livre em uma vila alpina (1h)",
      "Retorno com pôr do sol sobre as montanhas (30 min)",
    ],
    optionalActivities: [
      "Subida panorâmica a um mirante alpino (2h)",
      "Caminhada leve por trilha alpina sinalizada (1h30)",
    ],
  },
  {
    id: "munique-1",
    day: 7,
    period: "Dia 7",
    city: "Munique",
    title: "Arquitetura e mercados tradicionais",
    rhythm: "Moderado",
    image: "/proposal/munich.jpg",
    imageAlt: "Vista panorâmica do centro histórico de Munique ao pôr do sol",
    summary:
      "Chegada a Munique com uma caminhada pelo centro histórico e seus mercados tradicionais.",
    transport: "Traslado de chegada ajustado ao horário definido.",
    highlight: "Caminhada pelo centro histórico",
    activities: [
      "Traslado e acomodação com tempo livre (30 min)",
      "Caminhada pelo centro histórico (1h30)",
      "Visita livre a um mercado tradicional (1h)",
    ],
    optionalActivities: [
      "Visita a um palácio ou jardim histórico (2h)",
      "Programa gastronômico tradicional da região (1h30)",
    ],
  },
  {
    id: "munique-2",
    day: 8,
    period: "Dia 8",
    city: "Munique",
    title: "Últimos momentos e despedida",
    rhythm: "Leve",
    image: "/proposal/munich.jpg",
    imageAlt: "Vista panorâmica do centro histórico de Munique ao pôr do sol",
    summary:
      "O encerramento da viagem, com espaço para últimas descobertas e uma despedida sem pressa.",
    transport: "Traslado de saída ajustado ao horário do voo escolhido.",
    highlight: "Último pôr do sol no centro histórico",
    activities: [
      "Manhã livre para últimas descobertas (livre)",
      "Último pôr do sol no centro histórico (1h)",
      "Tempo reservado para a viagem de retorno (30 min)",
    ],
    optionalActivities: [
      "Últimas compras antes do traslado de saída (1h)",
      "Café da despedida em um ponto tradicional (45 min)",
    ],
  },
] as const;

export const accommodations = [
  {
    id: "hospedagem-londres",
    city: "Londres",
    title: "Hospedagem urbana selecionada",
    category: "Categoria a definir",
    neighborhood: "Região central",
    image: "/proposal/stay-london.jpg",
    imageAlt: "Imagem ilustrativa de hospedagem com piscina",
    description:
      "Referência visual para uma estadia confortável, com localização e categoria definidas na cotação final.",
    differentials:
      "Localização central e fácil acesso aos principais pontos da cidade.",
  },
  {
    id: "hospedagem-paris",
    city: "Paris",
    title: "Estadia de atmosfera acolhedora",
    category: "Categoria a definir",
    neighborhood: "Região central",
    image: "/proposal/stay-paris.jpg",
    imageAlt: "Imagem ilustrativa de hospedagem com área de descanso",
    description:
      "Uma direção visual para a seleção de hospedagem, sem representar um fornecedor já contratado.",
    differentials: "Atmosfera acolhedora e proximidade de pontos culturais.",
  },
  {
    id: "hospedagem-alpes",
    city: "Zurique e Munique",
    title: "Base para a etapa alpina",
    category: "Categoria a definir",
    neighborhood: "A confirmar",
    image: "/proposal/stay-alps.jpg",
    imageAlt: "Imagem ilustrativa de hospedagem com piscina iluminada",
    description:
      "Categoria e endereço serão escolhidos conforme disponibilidade, logística e preferências finais.",
    differentials: "Base estratégica para a etapa alpina da viagem.",
  },
] as const;

export const experiences = [
  {
    id: "london-culture",
    category: "cultura",
    city: "Londres",
    title: "Arquitetura às margens do Tâmisa",
    description:
      "Uma possibilidade de percurso para observar marcos históricos da cidade.",
    image: "/proposal/hero-london.jpg",
    imageAlt: "Vista aérea de Londres e do rio Tâmisa",
  },
  {
    id: "paris-flavors",
    category: "gastronomia",
    city: "Paris",
    title: "Sabores e pausas parisienses",
    description:
      "Tempo aberto para cafés, mercados e escolhas alinhadas ao perfil da viagem.",
    image: "/proposal/paris.jpg",
    imageAlt: "Ponte iluminada sobre o rio Sena em Paris",
  },
  {
    id: "zurich-nature",
    category: "natureza",
    city: "Zurique",
    title: "Panoramas dos Alpes",
    description:
      "Uma rota ilustrativa entre lago, montanhas e pequenas localidades suíças.",
    image: "/proposal/zurich.jpg",
    imageAlt: "Paisagem de uma vila nos Alpes suíços",
  },
  {
    id: "munich-culture",
    category: "cultura",
    city: "Munique",
    title: "Centro histórico e mercados",
    description:
      "Uma caminhada possível por praças, fachadas e pontos de encontro locais.",
    image: "/proposal/munich.jpg",
    imageAlt: "Vista do centro histórico de Munique",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  category: Exclude<ExperienceCategory, "todas">;
  city: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}>;

export const pricingTiers = [
  {
    key: "essential",
    name: "Essential",
    title: "Experiência Essencial",
    description:
      "Conforto e eficiência com localização central e itens prioritários.",
    price: "Sob consulta",
    badge: null,
    features: [
      "Hospedagem em localização central",
      "Traslados em classe standard",
      "Suporte da agência durante a viagem",
    ],
  },
  {
    key: "comfort",
    name: "Comfort",
    title: "Conforto Superior",
    description:
      "Equilíbrio entre hospedagens selecionadas, passeios guiados e experiências gastronômicas.",
    price: "Sob consulta",
    badge: "Mais escolhido",
    features: [
      "Hospedagem boutique em região central",
      "Traslados em classe superior",
      "Passeios guiados em pontos-chave do roteiro",
      "Experiência gastronômica incluída",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    title: "Ultraluxo & Exclusividade",
    description:
      "Para quem busca hospedagens icônicas, primeira classe e acompanhamento dedicado.",
    price: "Sob consulta",
    badge: null,
    features: [
      "Hospedagem 5★ de referência",
      "Traslados em primeira classe",
      "Experiências exclusivas selecionadas",
      "Acompanhamento dedicado durante toda a viagem",
    ],
  },
] as const satisfies ReadonlyArray<{
  key: TierKey;
  name: string;
  title: string;
  description: string;
  price: string;
  badge: string | null;
  features: readonly string[];
}>;
