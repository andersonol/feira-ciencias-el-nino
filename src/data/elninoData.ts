import { HotspotPoint, ClimateCard, QuizQuestion, RankingEntry } from '../types/elnino';

export const VIDEO_PATH = '/assets/aistudio/video-pagina-principal_db866cb5.mp4';

export const HOTSPOT_POINTS: HotspotPoint[] = [
  {
    id: 1,
    topicNumber: 1,
    title: 'O fenômeno — ENOS',
    category: 'CLIMATOLOGIA & ENOS',
    tag: 'Oceano Pacífico',
    regionName: 'Pacífico Equatorial',
    x: 48,
    y: 43,
    text: 'O El Niño se trata do aquecimento anormal e periódico das águas do Oceano Pacífico. A água quente que normalmente vai de leste a oeste em direção à Ásia e à Oceania acaba se acumulando no litoral da América do Sul.',
    iconType: 'temp'
  },
  {
    id: 2,
    topicNumber: 2,
    title: 'Ventos alísios — participação no El Niño',
    category: 'CIRCULAÇÃO ATMOSFÉRICA',
    tag: 'Ventos Alísios',
    regionName: 'Pacífico Ocidental',
    x: 14,
    y: 31,
    text: 'Durante o El Niño, os ventos alísios enfraquecem e, em casos mais intensos, até invertem de direção. São eles que deveriam empurrar a água quente do Pacífico até o oeste, e quando isso não acontece, impacta no acúmulo da água quente na costa oeste da América do Sul e no impedimento da ressurgência.',
    iconType: 'wind'
  },
  {
    id: 3,
    topicNumber: 3,
    title: 'O nome – "El Niño"',
    category: 'ORIGEM HISTÓRICA',
    tag: 'Tradição & Origem',
    regionName: 'Costa do Peru / Equador',
    x: 88,
    y: 32,
    text: 'O fenômeno é nomeado no Peru, por pescadores que notaram a recorrente diminuição de peixes na região por volta do mês de dezembro, perto do Natal. Assim, ficou batizado em referência ao Menino Jesus, em espanhol, "El Niño"',
    iconType: 'history'
  },
  {
    id: 4,
    topicNumber: 4,
    title: 'Fenômeno oposto — La Niña',
    category: 'FASE FRIA DO ENOS',
    tag: 'La Niña',
    regionName: 'Pacífico Equatorial Central',
    x: 43,
    y: 29,
    text: 'Se trata da fase oposta do ENOS, onde o fluxo da água quente não é alterado mas sim intensificado, forçando a subida e o acúmulo de água fria no litoral da América do Sul.',
    iconType: 'temp'
  },
  {
    id: 5,
    topicNumber: 5,
    title: 'A frequência — de 2 a 7 anos',
    category: 'PERIODICIDADE',
    tag: 'Ciclo Natural',
    regionName: 'Bacia do Pacífico Sul',
    x: 23,
    y: 49,
    text: 'O El Niño ocorre de forma irregular, se repetindo em intervalos de dois a sete anos. Ele começa a se desenvolver durante o outono/inverno, e atinge seu pico entre o fim do ano e o início do ano seguinte, durando cerca de nove a doze meses antes de se dissipar.',
    iconType: 'globe'
  },
  {
    id: 6,
    topicNumber: 6,
    title: 'Economia brasileira — agricultura',
    category: 'IMPACTO SOCIOECONÔMICO',
    tag: 'Agricultura no Brasil',
    regionName: 'Centro-Sul e Nordeste do Brasil',
    x: 89,
    y: 64,
    text: 'O El Niño tem como uma de suas consequências a seca no Norte e Nordeste, causando perdas massivas de safras e morte de rebanhos. No Sul, o excesso de chuva consequente do fenômeno pode destruir plantações por inundações, embora, em menos quantidade, favoreça a produtividade de grãos como a soja.',
    iconType: 'crop'
  },
  {
    id: 7,
    topicNumber: 7,
    title: 'Economia brasileira — energia',
    category: 'MATRIZ ENERGÉTICA',
    tag: 'Energia & Hidrelétricas',
    regionName: 'Bacia Amazônica e Hidrelétricas',
    x: 84,
    y: 45,
    text: 'A falta de chuvas na bacia amazônica reduz drasticamente o nível das hidrelétricas, a maior fonte de energia elétrica do Brasil. O país muitas vezes é forçado a ligar termelétricas, que são mais caras, aumentando principalmente o custo de toda produção industrial.',
    iconType: 'storm'
  },
  {
    id: 8,
    topicNumber: 8,
    title: 'Intensificação do fenômeno — Aquecimento Global',
    category: 'MUDANÇAS CLIMÁTICAS',
    tag: 'Aquecimento Global',
    regionName: 'Zona de Aquecimento Térmico',
    x: 37,
    y: 41,
    text: 'O Aquecimento Global aumenta a temperatura do fundo dos oceanos. Quando o El Niño se forma, ele parte de um oceano que já está mais quente que o normal. Esse calor extra funciona como combustível, tornando os eventos extremos mais frequentes e fazendo com que as secas e tempestades geradas sejam mais intensas e destrutivas.',
    iconType: 'temp'
  },
  {
    id: 9,
    topicNumber: 9,
    title: 'Biodiversidade marinha — cadeia alimentar',
    category: 'BIOLOGIA MARINHA',
    tag: 'Cadeia Alimentar',
    regionName: 'Costa Oeste da América do Sul',
    x: 80,
    y: 55,
    text: 'Com o El Niño, a ressurgência — fenômeno que trás agua fria carregada de nutrientes à superfície — não acontece. Os plânctons dependentes desses nutrientes morrem rapidamente, causando um grande impacto na base da cadeia alimentar marinha. Os demais peixes, agora sem alimento, morrem de fome ou migram para águas mais profundas e frias.',
    iconType: 'fish'
  }
];

export const CLIMATE_CARDS: ClimateCard[] = [
  {
    id: 'card-a',
    letterKey: 'A',
    letter: 'a)',
    uppercaseLetter: 'A)',
    image: '/assets/aistudio/imagem-pagina-principal-1_0d7c4bc6.jpeg',
    title: 'Fase Quente: Anomalia Térmica do El Niño',
    text: 'Durante o El Niño, a água quente se acumula na porção central e leste do Pacífico Equatorial. Os ventos alísios enfraquecem e a temperatura superficial do oceano sobe substancialmente acima da média histórica, transformando a dinâmica climática global.',
    location: 'Pacífico Equatorial',
    dateTag: 'Anomalia Positiva de TSM',
    mobileOrder: 1,
    desktopOrder: 1
  },
  {
    id: 'card-b',
    letterKey: 'B',
    letter: 'b)',
    uppercaseLetter: 'B)',
    image: '/assets/aistudio/imagem-pagina-principal-3_4d6e0288.jpeg',
    title: 'Fase Fria: O Fenômeno La Niña',
    text: 'Na La Niña, ocorre o oposto: os ventos alísios ganham força incomum, acumulando água quente ainda mais a oeste e permitindo que águas frias profundas dominem a costa americana, invertendo os padrões de seca e precipitação.',
    location: 'Pacífico Leste / Costa Americana',
    dateTag: 'Anomalia Negativa de TSM',
    mobileOrder: 2,
    desktopOrder: 3
  },
  {
    id: 'card-c',
    letterKey: 'C',
    letter: 'c)',
    uppercaseLetter: 'C)',
    image: '/assets/aistudio/imagem-pagina-principal-5_d67cb387.jpeg',
    title: 'Condições Neutras do Oceano Pacífico',
    text: 'Em períodos neutros do sistema ENOS, as temperaturas na superfície do Pacífico permanecem próximas da média climatológica normal, mantendo a Célula de Walker equilibrada e os regimes de chuva em suas médias históricas esperadas.',
    location: 'Bacia do Pacífico Global',
    dateTag: 'Padrão Climatológico Base',
    mobileOrder: 3,
    desktopOrder: 5
  },
  {
    id: 'card-d',
    letterKey: 'D',
    letter: 'd)',
    uppercaseLetter: 'D)',
    image: '/assets/aistudio/imagem-pagina-principal-2_7ddcd878.jpeg',
    title: 'Rio Grande do Sul – setembro, 2023',
    text: 'O El niño intensifica correntes de vento que se alinham sobre o sul do Brasil, criando um bloqueio que impede as frentes frias de avançarem para o resto do país, resultando em volumes contínuos de chuva em uma única área.',
    location: 'Rio Grande do Sul, Brasil',
    dateTag: 'Setembro / 2023',
    mobileOrder: 4,
    desktopOrder: 2
  },
  {
    id: 'card-e',
    letterKey: 'E',
    letter: 'e)',
    uppercaseLetter: 'E)',
    image: '/assets/aistudio/imagem-pagina-principal-4_ff4a8b98.jpeg',
    title: 'São Paulo – Novembro, 2023',
    text: 'Durante o El niño, o sudeste se torna uma área de transição entre a massa de ar quente do centro do Brasil e as frentes frias retidas no Sul. Quando uma frente fria rompe parcialmente esse bloqueio e colide com o ar quente, isso gera energia de tempestades explosivas.',
    location: 'São Paulo, Brasil',
    dateTag: 'Novembro / 2023',
    mobileOrder: 5,
    desktopOrder: 4
  },
  {
    id: 'card-f',
    letterKey: 'F',
    letter: 'f)',
    uppercaseLetter: 'F)',
    image: '/assets/aistudio/imagem-pagina-principal-6_d09a2bb4.jpeg',
    title: 'Amazônia — Novembro, 2023',
    text: 'Com o aquecimento do Pacífico, a Célula de Walker se desloca. Ao invés de formar nuvens sobre a região, o ar desce. Movimento esse que impede a formação de nuvens de chuva, causando a seca.',
    location: 'Bacia Amazônica, Brasil',
    dateTag: 'Novembro / 2023',
    mobileOrder: 6,
    desktopOrder: 6
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual filme venceu o Oscar de Melhor Filme em 2020, tornando-se o primeiro longa de língua não inglesa a conquistar o prêmio principal?',
    options: [
      'Roma',
      'Parasita',
      'Minari',
      'Drive My Car',
      'Tudo em Todo o Lugar ao Mesmo Tempo'
    ],
    correctAnswer: 1, // B
    explanation: 'Parasita (Parasite), dirigido por Bong Joon-ho, fez história na 92ª cerimônia do Oscar ao se tornar o primeiro longa de língua não inglesa a vencer a categoria de Melhor Filme.',
    relatedTopicId: 1
  },
  {
    id: 2,
    question: 'Qual artista lançou o álbum "Thriller" em 1982, que se tornou o mais vendido da história da música?',
    options: [
      'Prince',
      'Madonna',
      'Michael Jackson',
      'Stevie Wonder',
      'Whitney Houston'
    ],
    correctAnswer: 2, // C
    explanation: 'Michael Jackson lançou "Thriller" em novembro de 1982, consagrando-se como o álbum musical mais vendido de todos os tempos.',
    relatedTopicId: 2
  },
  {
    id: 3,
    question: 'Em qual universo ficcional da cultura pop fica localizada a cidade de Gotham City?',
    options: [
      'Universo Marvel',
      'Universo DC',
      'Universo Star Wars',
      'Universo Harry Potter',
      'Universo Senhor dos Anéis'
    ],
    correctAnswer: 1, // B
    explanation: 'Gotham City é a famosa metrópole fictícia do Universo DC (DC Comics), conhecida por ser a base do Batman.',
    relatedTopicId: 3
  },
  {
    id: 4,
    question: 'Qual é a série de televisão mais assistida da história da Netflix em suas primeiras semanas de lançamento?',
    options: [
      'Stranger Things',
      'Wandinha',
      'The Crown',
      'Round 6 (Squid Game)',
      'Bridgerton'
    ],
    correctAnswer: 3, // D
    explanation: 'A série sul-coreana Round 6 (Squid Game) conquistou números recordes globais, tornando-se a produção mais vista da Netflix em suas primeiras semanas.',
    relatedTopicId: 4
  },
  {
    id: 5,
    question: 'Qual superheroína é conhecida por usar os "Braceletes da Vitória" e o "Laço da Verdade"?',
    options: [
      'Viúva Negra',
      'Mulher-Maravilha',
      'Capitã Marvel',
      'Feiticeira Escarlate',
      'Tempestade'
    ],
    correctAnswer: 1, // B
    explanation: 'A Mulher-Maravilha (Diana Prince), guerreira amazona da DC Comics, possui como armas icônicas os Braceletes da Vitória e o Laço da Verdade.',
    relatedTopicId: 5
  },
  {
    id: 6,
    question: 'Qual banda britânica lançou o famoso álbum "Abbey Road" em 1969?',
    options: [
      'Queen',
      'The Rolling Stones',
      'Pink Floyd',
      'Led Zeppelin',
      'The Beatles'
    ],
    correctAnswer: 4, // E
    explanation: 'The Beatles lançaram "Abbey Road" em 1969, imortalizando a fotografia clássica dos quatro integrantes na faixa de pedestres.',
    relatedTopicId: 6
  },
  {
    id: 7,
    question: 'Na franquia de jogos e filmes Pokémon, qual é o número de registro do Pokémon Pikachu na Pokédex nacional?',
    options: [
      '#001',
      '#007',
      '#025',
      '#150',
      '#151'
    ],
    correctAnswer: 2, // C
    explanation: 'Pikachu, o Pokémon elétrico e símbolo da franquia, ocupa a posição #025 na Pokédex Nacional.',
    relatedTopicId: 7
  },
  {
    id: 8,
    question: 'Quem escreveu a série literária de fantasia "As Crônicas de Gelo e Fogo", que inspirou a série Game of Thrones?',
    options: [
      'J.K. Rowling',
      'J.R.R. Tolkien',
      'George R.R. Martin',
      'Rick Riordan',
      'C.S. Lewis'
    ],
    correctAnswer: 2, // C
    explanation: 'George R.R. Martin é o renomado escritor da série literária "As Crônicas de Gelo e Fogo" (A Song of Ice and Fire).',
    relatedTopicId: 8
  },
  {
    id: 9,
    question: 'Qual é o nome do ator que interpreta o personagem Homem de Ferro (Tony Stark) no Universo Cinematográfico Marvel?',
    options: [
      'Chris Evans',
      'Robert Downey Jr.',
      'Chris Hemsworth',
      'Mark Ruffalo',
      'Tom Holland'
    ],
    correctAnswer: 1, // B
    explanation: 'Robert Downey Jr. deu vida com enorme aclamação a Tony Stark / Homem de Ferro no Universo Cinematográfico Marvel (MCU).',
    relatedTopicId: 9
  }
];

export const INITIAL_RANKING: RankingEntry[] = [];
