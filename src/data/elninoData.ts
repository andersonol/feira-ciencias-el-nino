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
    question: '1. O El Niño é caracterizado principalmente por qual processo?',
    options: [
      'O resfriamento anormal das águas do Oceano Atlântico, próximo à África.',
      'O aquecimento anormal e periódico das águas do Pacífico, com acúmulo de água quente próximo à América do Sul.',
      'O aumento permanente do nível dos oceanos causado pelo derretimento das geleiras.',
      'O resfriamento das águas do Pacífico próximo à América do Sul, provocado pelo aumento dos ventos alísios.',
      'A interrupção completa das correntes marítimas em todos os oceanos.'
    ],
    correctAnswer: 1, // B
    explanation: 'O El Niño se define pelo aquecimento anômalo e cíclico da porção equatorial do Oceano Pacífico e pelo represamento de águas quentes junto à costa oeste da América do Sul.',
    relatedTopicId: 1
  },
  {
    id: 2,
    question: '2. Qual é o papel do enfraquecimento dos ventos alísios durante o El Niño?',
    options: [
      'Intensificar o transporte de águas frias para a costa oeste da América do Sul.',
      'Aumentar a ressurgência de águas profundas e ricas em nutrientes.',
      'Impedir a formação de áreas de baixa pressão no Oceano Pacífico.',
      'Favorecer o acúmulo de águas quentes próximo à América do Sul e reduzir a ressurgência.',
      'Deslocar definitivamente as águas quentes do Pacífico para o Oceano Atlântico.'
    ],
    correctAnswer: 3, // D
    explanation: 'Ao perderem força, os ventos alísios deixam de empurrar a água aquecida para o extremo oeste, permitindo que a piscina quente se espalhe até a costa sul-americana e bloqueie a subida da água fria de ressurgência.',
    relatedTopicId: 2
  },
  {
    id: 3,
    question: '3. A origem do nome El Niño está relacionada:',
    options: [
      'À associação feita por pescadores peruanos entre a diminuição de peixes e o período próximo ao Natal, em referência ao Menino Jesus.',
      'Ao nome de um navegador espanhol que descobriu o fenômeno no século XVI.',
      'À palavra indígena utilizada para designar os ventos alísios.',
      'À comemoração do Ano-Novo na Ásia, onde o fenômeno se manifesta inicialmente.',
      'À crença de que o fenômeno era provocado pelo nascimento de uma criança na costa sul-americana.'
    ],
    correctAnswer: 0, // A
    explanation: 'Pescadores do litoral peruano observavam que a chegada dessas águas quentes e a consequente escassez de cardumes ocorriam habitualmente em dezembro (Natal), nomeando o evento como "El Niño de Navidad" em homenagem ao Menino Jesus.',
    relatedTopicId: 3
  },
  {
    id: 4,
    question: '4. Qual alternativa descreve corretamente a La Niña?',
    options: [
      'É uma fase em que as águas do Pacífico equatorial se aquecem ainda mais do que durante o El Niño.',
      'É um fenômeno restrito ao Oceano Atlântico, sem influência sobre o clima mundial.',
      'É a fase oposta do ENOS, caracterizada pelo fortalecimento dos ventos alísios e pela intensificação da ressurgência de águas frias.',
      'É uma fase em que os ventos alísios desaparecem completamente, provocando o acúmulo de águas quentes na América do Sul.',
      'É um fenômeno que ocorre exclusivamente durante o inverno e dura sempre menos de um mês.'
    ],
    correctAnswer: 2, // C
    explanation: 'A La Niña representa a fase fria do ciclo ENOS: os ventos alísios tornam-se excepcionalmente vigorosos, acumulando calor a oeste e promovendo forte ressurgência fria no leste do Pacífico.',
    relatedTopicId: 4
  },
  {
    id: 5,
    question: '5. Sobre a frequência e a duração do El Niño, assinale a alternativa correta.',
    options: [
      'O fenômeno ocorre todos os anos, sempre com a mesma intensidade e duração.',
      'O El Niño ocorre em intervalos regulares de exatamente cinco anos e dura cerca de três meses.',
      'O fenômeno ocorre apenas durante o verão e desaparece antes do outono.',
      'O El Niño acontece uma única vez a cada década e pode durar vários anos consecutivos obrigatoriamente.',
      'O fenômeno ocorre irregularmente, em intervalos de aproximadamente dois a sete anos, e costuma durar de nove a doze meses.'
    ],
    correctAnswer: 4, // E
    explanation: 'O ciclo do El Niño não possui regularidade fixa: repete-se de forma quase-periódica a cada 2 a 7 anos, com ciclo típico de vida entre 9 e 12 meses.',
    relatedTopicId: 5
  },
  {
    id: 6,
    question: '6. Como o El Niño pode afetar a agricultura brasileira?',
    options: [
      'Provoca secas uniformes em todas as regiões do Brasil, eliminando a possibilidade de perdas por excesso de chuva.',
      'Pode causar secas no Norte e Nordeste e chuvas excessivas no Sul, prejudicando plantações de maneiras diferentes.',
      'Aumenta a produtividade agrícola de todas as regiões brasileiras, independentemente da cultura.',
      'Afeta exclusivamente a criação de gado, sem consequências para a produção vegetal.',
      'Elimina os períodos de estiagem e garante chuvas regulares durante todo o ano.'
    ],
    correctAnswer: 1, // B
    explanation: 'No Brasil, o El Niño gera um contraste acentuado: reduz precipitações no Norte e no Semiárido nordestino (prejudicando milho/feijão) e concentra tempestades severas no Sul (alagando lavouras de arroz e soja).',
    relatedTopicId: 6
  },
  {
    id: 7,
    question: '7. Por que o El Niño pode aumentar os custos da produção industrial brasileira?',
    options: [
      'Porque provoca o fechamento de todas as usinas hidrelétricas do país.',
      'Porque reduz a necessidade de eletricidade nas indústrias e aumenta o preço dos alimentos.',
      'Porque impede a importação de combustíveis utilizados na produção industrial.',
      'Porque a redução das chuvas pode diminuir os níveis dos reservatórios hidrelétricos, exigindo maior uso de termelétricas, geralmente mais caras.',
      'Porque aumenta a produção hidrelétrica na Amazônia, tornando a distribuição de energia inviável.'
    ],
    correctAnswer: 3, // D
    explanation: 'Com a seca nos reservatórios das bacias do Norte e Centro-Oeste, o Operador Nacional do Sistema precisa acionar usinas termelétricas a combustível fóssil, encarecendo a tarifa de energia (bandeira tarifária) para o setor produtivo.',
    relatedTopicId: 7
  },
  {
    id: 8,
    question: '8. Qual é a possível relação entre o aquecimento global e a intensidade dos eventos associados ao El Niño?',
    options: [
      'O aquecimento global pode elevar a temperatura dos oceanos, acrescentando calor ao sistema climático e potencialmente agravando determinados eventos extremos.',
      'O aquecimento global elimina as diferenças de temperatura entre os oceanos e impede a ocorrência do El Niño.',
      'O aumento da temperatura global garante que todos os eventos de El Niño sejam mais fracos que os anteriores.',
      'O aquecimento global afeta apenas os continentes, sem influência sobre os oceanos ou a circulação atmosférica.',
      'O aquecimento global transforma automaticamente todo episódio de La Niña em El Niño.'
    ],
    correctAnswer: 0, // A
    explanation: 'O excesso de energia térmica retido na atmosfera e nos oceanos pelo efeito estufa potencializa a evaporação e a instabilidade, fazendo com que os eventos de El Niño gerem secas e precipitações mais extremas.',
    relatedTopicId: 8
  },
  {
    id: 9,
    question: '9. Por que a redução da ressurgência durante o El Niño pode prejudicar a cadeia alimentar marinha?',
    options: [
      'Porque o aumento de nutrientes na superfície impede a reprodução dos peixes.',
      'Porque a água quente transforma os plânctons em organismos incapazes de servir de alimento a outros animais.',
      'Porque a menor chegada de águas frias e ricas em nutrientes pode reduzir o plâncton, afetando os organismos que dependem dele direta ou indireamente.',
      'Porque a ressurgência transporta água doce dos rios para o oceano, e sua ausência aumenta a salinidade a níveis letais.',
      'Porque o enfraquecimento dos ventos alísios elimina permanentemente todas as espécies marinhas do Pacífico.'
    ],
    correctAnswer: 2, // C
    explanation: 'A camada de água quente superficial impede a subida de nutrientes do fundo. Sem nitratos e fosfatos, o fitoplâncton entra em declínio rápido, colapsando a base da pirâmide alimentar marinha da costa do Pacífico.',
    relatedTopicId: 9
  }
];

export const INITIAL_RANKING: RankingEntry[] = [
  { id: '1', name: 'Beatriz Almeida', score: 9, totalQuestions: 9, timeSeconds: 68, date: '30/10/2026', schoolGrade: '3º Ano E.M.', deviceFingerprint: 'seed_device_1' },
  { id: '2', name: 'Lucas Vasconcelos', score: 9, totalQuestions: 9, timeSeconds: 79, date: '30/10/2026', schoolGrade: '2º Ano E.M.', deviceFingerprint: 'seed_device_2' },
  { id: '3', name: 'Mariana Duarte', score: 8, totalQuestions: 9, timeSeconds: 62, date: '30/10/2026', schoolGrade: '1º Ano E.M.', deviceFingerprint: 'seed_device_3' },
  { id: '4', name: 'Rafael Guimarães', score: 8, totalQuestions: 9, timeSeconds: 74, date: '30/10/2026', schoolGrade: '3º Ano E.M.', deviceFingerprint: 'seed_device_4' },
  { id: '5', name: 'Camila Siqueira', score: 7, totalQuestions: 9, timeSeconds: 85, date: '30/10/2026', schoolGrade: '9º Ano E.F.', deviceFingerprint: 'seed_device_5' }
];
