export interface DialogueLine {
  id: string;
  speaker: string;
  avatar: string;
  pt: string;
  de: string;
  notes?: string;
  vocab?: { word: string; meaning: string; phonetic: string }[];
}

export interface ComprehensionQuestion {
  id: string;
  questionDe: string;
  optionsPt: string[];
  correctIndex: number;
  explanationDe: string;
}

export interface ImmersiveScenario {
  id: string;
  titlePt: string;
  titleDe: string;
  location: string;
  difficulty: 'A1' | 'A2' | 'B1';
  summaryDe: string;
  culturalNote: string;
  accentColor: string;
  iconName: string;
  dialogue: DialogueLine[];
  questions: ComprehensionQuestion[];
}

export interface SentenceChunk {
  id: string;
  category: 'café' | 'direções' | 'social' | 'viagem' | 'expressões' | 'cultura';
  phrasePt: string;
  phraseDe: string;
  phoneticPt: string;
  contextUsage: string;
  tokens: string[]; // For interactive sentence construction puzzle
}

export interface ClozeExercise {
  id: string;
  category: 'café' | 'verb_ar' | 'ser_estar' | 'social' | 'cultura';
  contextTitleDe: string;
  fullSentencePt: string;
  sentenceDe: string;
  beforeGap: string;
  gapTarget: string;
  afterGap: string;
  infinitiveCue: string;
  options: string[];
  grammaticalExplanation: string;
}

export interface EarTrainingPair {
  id: string;
  title: string;
  descriptionDe: string;
  ruleTitle: string;
  ruleExplanationDe: string;
  audioA: { text: string; label: string; phonetic: string };
  audioB: { text: string; label: string; phonetic: string };
  challenge: {
    question: string;
    targetAudio: string;
    options: string[];
    correctIndex: number;
  };
}

export const IMMERSIVE_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'sc_01_pastelaria',
    titlePt: 'No Café em Belém',
    titleDe: 'Im traditionsreichen Café in Belém (Kapitel 3: Essen & Trinken)',
    location: 'Lisboa, Belém',
    difficulty: 'A1',
    summaryDe: 'Lerne, wie echte Portugiesen morgens ihren Espresso („bica“) und das berühmte Pastel de Nata bestellen.',
    culturalNote: 'In Lissabon bestellt man einen Espresso oft als „uma bica“. Im Norden (Porto) sagt man eher „um cimbalino“. Ein einfaches „por favor“ oder „se faz favor“ gehört immer dazu!',
    accentColor: '#d97706',
    iconName: 'Coffee',
    dialogue: [
      {
        id: 'l1',
        speaker: 'Sofia (Empregada)',
        avatar: '👩🏻‍🍳',
        pt: 'Bom dia! O que vai ser para hoje?',
        de: 'Guten Morgen! Was darf es heute für Sie sein?',
        notes: '„O que vai ser?“ ist die typische, freundliche Floskel portugiesischer Kellner.',
        vocab: [
          { word: 'Bom dia', meaning: 'Guten Morgen', phonetic: 'bõ dee-ah' },
          { word: 'vai ser', meaning: 'wird es sein', phonetic: 'vai sayr' },
          { word: 'hoje', meaning: 'heute', phonetic: 'oh-zhuh' },
        ],
      },
      {
        id: 'l2',
        speaker: 'Você',
        avatar: '🙋‍♂️',
        pt: 'Bom dia! Queria uma bica e um pastel de nata, se faz favor.',
        de: 'Guten Morgen! Ich hätte gerne einen Espresso und ein Blätterteigküchlein, bitte.',
        notes: '„Queria...“ (Imparfeito) ist viel höflicher als „Eu quero“ (Ich will).',
        vocab: [
          { word: 'Queria', meaning: 'Ich hätte gern', phonetic: 'kuh-ree-ah' },
          { word: 'uma bica', meaning: 'ein Espresso (Lissabon)', phonetic: 'oo-mah bee-kah' },
          { word: 'pastel de nata', meaning: 'Puddingtörtchen', phonetic: 'push-tel duh nah-tah' },
          { word: 'se faz favor', meaning: 'bitte (wörtl.: wenn Sie den Gefallen tun)', phonetic: 'suh fahsh fah-vor' },
        ],
      },
      {
        id: 'l3',
        speaker: 'Sofia (Empregada)',
        avatar: '👩🏻‍🍳',
        pt: 'Com certeza. Quer o pastel com canela e açúcar em pó?',
        de: 'Sehr gerne. Möchten Sie das Pastel mit Zimt und Puderzucker?',
        notes: 'In Portugal streut man selbst gerne Zimt („canela“) über das warme Gebäck.',
        vocab: [
          { word: 'Com certeza', meaning: 'Sicher / Natürlich', phonetic: 'kõ suhr-tay-zah' },
          { word: 'canela', meaning: 'Zimt', phonetic: 'kah-neh-lah' },
          { word: 'açúcar em pó', meaning: 'Puderzucker', phonetic: 'ah-soo-kar ayng paw' },
        ],
      },
      {
        id: 'l4',
        speaker: 'Você',
        avatar: '🙋‍♂️',
        pt: 'Sim, só um pouco de canela, obrigado! Quanto é tudo?',
        de: 'Ja, nur ein bisschen Zimt, danke! Wie viel macht das zusammen?',
        notes: 'Männer sagen „obrigado“, Frauen sagen „obrigada“.',
        vocab: [
          { word: 'só um pouco', meaning: 'nur ein wenig', phonetic: 'saw oong poh-koo' },
          { word: 'Quanto é?', meaning: 'Wie viel kostet es?', phonetic: 'kwan-too eh' },
          { word: 'tudo', meaning: 'alles', phonetic: 'too-doo' },
        ],
      },
      {
        id: 'l5',
        speaker: 'Sofia (Empregada)',
        avatar: '👩🏻‍🍳',
        pt: 'São dois euros e vinte cêntimos. Pode pagar com dinheiro ou cartão.',
        de: 'Das macht 2 Euro und 20 Cent. Sie können bar oder mit Karte zahlen.',
        notes: '„Dinheiro“ ist Bargeld, „cartão“ die Bankkarte (Multibanco).',
        vocab: [
          { word: 'cêntimos', meaning: 'Cent', phonetic: 'sayn-tee-moosh' },
          { word: 'dinheiro', meaning: 'Bargeld', phonetic: 'dee-nyay-roo' },
          { word: 'cartão', meaning: 'Karte', phonetic: 'kar-tãw' },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        questionDe: 'Wie bestellt man in Portugal am höflichsten einen Kaffee?',
        optionsPt: ['Eu quero um café já!', 'Queria uma bica, se faz favor.', 'Dá-me café.'],
        correctIndex: 1,
        explanationDe: '„Queria..., se faz favor“ ist die goldene Höflichkeitsform im Alltag.',
      },
      {
        id: 'q2',
        questionDe: 'Was bedeutet das Wort „canela“?',
        optionsPt: ['Milch', 'Zucker', 'Zimt'],
        correctIndex: 2,
        explanationDe: 'Canela ist Zimt – unverzichtbar auf einem warmen Pastel de Nata!',
      },
      {
        id: 'q3',
        questionDe: 'Wie bedankt sich eine Frau im Café korrekt?',
        optionsPt: ['Obrigado', 'Obrigada', 'De nada'],
        correctIndex: 1,
        explanationDe: 'Frauen sagen immer „Obrigada“, Männer sagen immer „Obrigado“.',
      },
    ],
  },
  {
    id: 'sc_02_metro_rossio',
    titlePt: 'No Metro do Rossio',
    titleDe: 'Orientierung & U-Bahn am Rossio (Kapitel 4: Unterwegs)',
    location: 'Lisboa, Praça do Rossio',
    difficulty: 'A1',
    summaryDe: 'Tickets kaufen, nach der richtigen Linie fragen und zielgerichtet durch Lissabon navigieren.',
    culturalNote: 'Das Metro-Netz in Lissabon ist übersichtlich in vier Farben eingeteilt: Azul (Blau), Amarela (Gelb), Verde (Grün) und Vermelha (Rot). Die wiederaufladbare Karte heißt „Navegante“.',
    accentColor: '#0284c7',
    iconName: 'Compass',
    dialogue: [
      {
        id: 'l2_1',
        speaker: 'Você',
        avatar: '🙋‍♂️',
        pt: 'Com licença, senhor. Pode ajudar-me a tirar um bilhete?',
        de: 'Entschuldigen Sie, mein Herr. Können Sie mir helfen, ein Ticket zu ziehen?',
        notes: '„Com licença“ (Entschuldigung / Verzeihung) vor einer Bitte an Fremde.',
        vocab: [
          { word: 'Com licença', meaning: 'Entschuldigung / Verzeihung', phonetic: 'kõ lee-sayn-sah' },
          { word: 'Pode ajudar-me?', meaning: 'Können Sie mir helfen?', phonetic: 'paw-duh ah-zhoo-dar-muh' },
          { word: 'bilhete', meaning: 'Fahrkarte / Ticket', phonetic: 'bee-lyay-tuh' },
        ],
      },
      {
        id: 'l2_2',
        speaker: 'Passante (Manuel)',
        avatar: '🧔🏻',
        pt: 'Claro que sim! Para onde é que quer ir?',
        de: 'Aber natürlich! Wohin möchten Sie denn fahren?',
        notes: '„Para onde é que...?“ ist die natürliche portugiesische Betonungsstruktur.',
        vocab: [
          { word: 'Claro que sim', meaning: 'Na klar / Selbstverständlich', phonetic: 'klah-roo kuh seeng' },
          { word: 'Para onde', meaning: 'Wohin', phonetic: 'pah-rah ohn-duh' },
          { word: 'ir', meaning: 'gehen / fahren', phonetic: 'eer' },
        ],
      },
      {
        id: 'l2_3',
        speaker: 'Você',
        avatar: '🙋‍♂️',
        pt: 'Vou para o aeroporto. Esta linha verde vai direta?',
        de: 'Ich fahre zum Flughafen. Fährt diese grüne Linie direkt?',
        notes: 'In europäischem Portugiesisch wird „o aeroporto“ flüssig wie „w-aeroportu“ gesprochen.',
        vocab: [
          { word: 'Vou para', meaning: 'Ich fahre nach / zu', phonetic: 'voh pah-rah' },
          { word: 'aeroporto', meaning: 'Flughafen', phonetic: 'ah-eh-roo-por-too' },
          { word: 'direta', meaning: 'direkt', phonetic: 'dee-reh-tah' },
        ],
      },
      {
        id: 'l2_4',
        speaker: 'Passante (Manuel)',
        avatar: '🧔🏻',
        pt: 'Não, tem de mudar na estação Alameda para a linha vermelha.',
        de: 'Nein, Sie müssen an der Station Alameda in die rote Linie umsteigen.',
        notes: '„Tem de...“ bedeutet „Sie müssen...“ (Pflicht / Notwendigkeit).',
        vocab: [
          { word: 'tem de mudar', meaning: 'müssen umsteigen', phonetic: 'tayng duh moo-dar' },
          { word: 'estação', meaning: 'Station / Bahnhof', phonetic: 'sh-tah-sãw' },
          { word: 'vermelha', meaning: 'rot', phonetic: 'vuhr-meh-lyah' },
        ],
      },
    ],
    questions: [
      {
        id: 'q2_1',
        questionDe: 'Was bedeutet die Redewendung „Com licença“?',
        optionsPt: ['Gute Reise', 'Entschuldigung / Gestatten Sie', 'Auf Wiedersehen'],
        correctIndex: 1,
        explanationDe: '„Com licença“ verwendet man, um jemanden höflich anzusprechen.',
      },
      {
        id: 'q2_2',
        questionDe: 'An welcher Station muss der Reisende zur roten Linie umsteigen?',
        optionsPt: ['Rossio', 'Baixa-Chiado', 'Alameda'],
        correctIndex: 2,
        explanationDe: 'Manuel erklärt: „Tem de mudar na estação Alameda para a linha vermelha.“',
      },
    ],
  },
  {
    id: 'sc_03_fado_alfama',
    titlePt: 'Uma Noite de Fado em Alfama',
    titleDe: 'Ein Fado-Abend in Alfama (Kapitel 15: Kultur & Traditionen)',
    location: 'Lisboa, Alfama',
    difficulty: 'A2',
    summaryDe: 'Erlebe ein authentisches Abendessen in einer traditionellen Tasca, während Fado gesungen wird und das Gefühl von Saudade erwacht.',
    culturalNote: 'Im Fado-Lokal verstummen Gespräche sofort, sobald jemand „Silêncio!“ ruft. Petiscos wie Bacalhau und Oliven begleiten die Musik.',
    accentColor: '#c0392b',
    iconName: 'Sparkles',
    dialogue: [
      {
        id: 'l3_1',
        speaker: 'Empregado (Rui)',
        avatar: '🍷',
        pt: 'Boa noite! Bem-vindos à nossa casa de fado. Já sabem o que vão jantar?',
        de: 'Guten Abend! Willkommen in unserem Fado-Haus. Wisst ihr schon, was ihr zu Abend essen möchtet?',
        notes: '„Casa de fado“ ist ein traditionelles Musiklokal mit traditioneller Küche.',
        vocab: [
          { word: 'Boa noite', meaning: 'Guten Abend', phonetic: 'boh-ah noh-ee-tuh' },
          { word: 'jantar', meaning: 'zu Abend essen', phonetic: 'zhahn-tar' },
        ],
      },
      {
        id: 'l3_2',
        speaker: 'Você',
        avatar: '🙋‍♂️',
        pt: 'Recomenda o bacalhau à Brás ou o polvo à lagareiro?',
        de: 'Empfehlen Sie den Bacalhau à Brás oder den Oktopus nach Lagareiro-Art?',
        notes: 'Beides sind absolute Klassiker der portugiesischen Gastronomie.',
        vocab: [
          { word: 'Recomenda', meaning: 'Empfehlen Sie', phonetic: 'ruh-koo-mayn-dah' },
          { word: 'bacalhau', meaning: 'Stockfisch / Kabeljau', phonetic: 'bah-kah-lyow' },
          { word: 'polvo', meaning: 'Oktopus', phonetic: 'pol-voo' },
        ],
      },
      {
        id: 'l3_3',
        speaker: 'Empregado (Rui)',
        avatar: '🍷',
        pt: 'O bacalhau à Brás hoje está divinal! E trazemos um vinho tinto do Alentejo.',
        de: 'Der Bacalhau à Brás ist heute göttlich! Und wir bringen Ihnen einen Rotwein aus dem Alentejo.',
        notes: '„Divinal“ bedeutet im Portugiesischen hervorragend / göttlich köstlich.',
        vocab: [
          { word: 'divinal', meaning: 'göttlich / fantastisch', phonetic: 'dee-vee-nahl' },
          { word: 'vinho tinto', meaning: 'Rotwein', phonetic: 'vee-nyoo teen-too' },
        ],
      },
    ],
    questions: [
      {
        id: 'q3_1',
        questionDe: 'Was ist „Bacalhau“ in der portugiesischen Küche?',
        optionsPt: ['Gegrilltes Hähnchen', 'Gesalzener Kabeljau (Stockfisch)', 'Schweinebraten'],
        correctIndex: 1,
        explanationDe: 'Bacalhau ist das portugiesische Nationalgericht mit hunderten Zubereitungsarten.',
      },
    ],
  },
];

export const FLUENCY_CHUNKS: SentenceChunk[] = [
  {
    id: 'ch_01',
    category: 'café',
    phrasePt: 'Queria uma bica e um pastel de nata, se faz favor.',
    phraseDe: 'Ich hätte gerne einen Espresso und ein Blätterteigtörtchen, bitte.',
    phoneticPt: 'Kuh-ree-ah oo-mah bee-kah ee oong push-tel duh nah-tah, suh fahsh fah-vor.',
    contextUsage: 'Die authentischste Kaffeehaus-Bestellung in Lissabon.',
    tokens: ['Queria', 'uma bica', 'e um pastel de nata,', 'se faz favor.'],
  },
  {
    id: 'ch_02',
    category: 'café',
    phrasePt: 'Uma água sem gás e fresca, por favor.',
    phraseDe: 'Ein stilles und kühles Wasser, bitte.',
    phoneticPt: 'Oo-mah ah-gwah sayng gahsh ee fraysh-kah, poor fah-vor.',
    contextUsage: '„Sem gás“ ist stilles Wasser, „fresca“ bedeutet gekühlt.',
    tokens: ['Uma água', 'sem gás', 'e fresca,', 'por favor.'],
  },
  {
    id: 'ch_03',
    category: 'direções',
    phrasePt: 'Sabe onde fica a paragem de autocarro mais próxima?',
    phraseDe: 'Wissen Sie, wo die nächste Bushaltestelle liegt?',
    phoneticPt: 'Sah-buh ohn-duh fee-kah ah pah-rah-zhayng duh ow-too-kah-roo mighsh praw-see-mah?',
    contextUsage: 'In Portugal heißt der Bus „autocarro“ (in Brasilien „ônibus“).',
    tokens: ['Sabe onde fica', 'a paragem', 'de autocarro', 'mais próxima?'],
  },
  {
    id: 'ch_04',
    category: 'social',
    phrasePt: 'Não percebi bem, pode falar mais devagar?',
    phraseDe: 'Ich habe es nicht ganz verstanden, können Sie langsamer sprechen?',
    phoneticPt: 'Nãw puhr-suh-bee bayng, paw-duh fah-lar mighsh duh-vah-gar?',
    contextUsage: 'Lebensrettender Satz, wenn Einheimische schnell sprechen!',
    tokens: ['Não percebi bem,', 'pode falar', 'mais devagar?'],
  },
  {
    id: 'ch_05',
    category: 'social',
    phrasePt: 'Muito gosto em conhecê-lo!',
    phraseDe: 'Sehr angenehm, Sie kennenzulernen!',
    phoneticPt: 'Mween-too gohsh-too ayng koo-nyay-say-loo!',
    contextUsage: 'Klassische, formelle Begrüßung beim ersten Treffen.',
    tokens: ['Muito gosto', 'em', 'conhecê-lo!'],
  },
  {
    id: 'ch_06',
    category: 'cultura',
    phrasePt: 'Tenho muitas saudades de Portugal e do mar.',
    phraseDe: 'Ich vermisse Portugal und das Meer sehr (Ich habe viel Saudade).',
    phoneticPt: 'Tay-nyoo mween-tush sow-dah-dush duh Poor-too-gahl ee doo mar.',
    contextUsage: 'Saudade drückt die tiefe, emotionale Sehnsucht nach einem Ort aus.',
    tokens: ['Tenho', 'muitas saudades', 'de Portugal', 'e do mar.'],
  },
  {
    id: 'ch_07',
    category: 'expressões',
    phrasePt: 'Está um dia espetacular para ir à praia!',
    phraseDe: 'Es ist ein fantastischer Tag, um an den Strand zu gehen!',
    phoneticPt: 'Sh-tah oong dee-ah sh-peh-tah-koo-lar pah-rah eer ah pry-ah!',
    contextUsage: '„Espetacular“ ist eines der beliebtesten portugiesischen Superlative.',
    tokens: ['Está um dia', 'espetacular', 'para ir', 'à praia!'],
  },
];

export const CLOZE_EXERCISES: ClozeExercise[] = [
  {
    id: 'cloze_01',
    category: 'café',
    contextTitleDe: 'Höfliche Bestellung im Café',
    fullSentencePt: 'Eu queria um café, se faz favor.',
    sentenceDe: 'Ich hätte gerne einen Kaffee, bitte.',
    beforeGap: 'Eu ',
    gapTarget: 'queria',
    afterGap: ' um café, se faz favor.',
    infinitiveCue: 'querer (höfliche Bitte im Imperfeito)',
    options: ['queria', 'quero', 'quis', 'queremos'],
    grammaticalExplanation: 'Im Portugiesischen verwendet man für höfliche Bitten das Imperfeito „queria“ (Ich hätte gern) statt des forschen Präsens „quero“ (Ich will).',
  },
  {
    id: 'cloze_02',
    category: 'verb_ar',
    contextTitleDe: 'Regelmäßige Verben auf -ar',
    fullSentencePt: 'Nós falamos português todos os dias.',
    sentenceDe: 'Wir sprechen jeden Tag Portugiesisch.',
    beforeGap: 'Nós ',
    gapTarget: 'falamos',
    afterGap: ' português todos os dias.',
    infinitiveCue: 'falar (wir / nós)',
    options: ['falamos', 'falam', 'falo', 'falas'],
    grammaticalExplanation: 'Bei regelmäßigen Verben auf -ar (wie falar) lautet die Endung für „nós“ immer -amos: fal + amos = falamos.',
  },
  {
    id: 'cloze_03',
    category: 'ser_estar',
    contextTitleDe: 'Unterschied Ser vs. Estar',
    fullSentencePt: 'O café está muito quente.',
    sentenceDe: 'Der Kaffee ist sehr heiß (vorübergehender Zustand).',
    beforeGap: 'O café ',
    gapTarget: 'está',
    afterGap: ' muito quente.',
    infinitiveCue: 'estar (Zustand: 3. Person Singular)',
    options: ['está', 'é', 'são', 'estão'],
    grammaticalExplanation: 'Die Temperatur eines Kaffees ist ein vorübergehender Zustand, keine unveränderliche Eigenschaft. Daher verwendet man „estar“: O café está quente.',
  },
  {
    id: 'cloze_04',
    category: 'social',
    contextTitleDe: 'Höflichkeit nach Sprechergeschlecht',
    fullSentencePt: 'Muito obrigada pela ajuda!',
    sentenceDe: 'Vielen Dank für die Hilfe! (Gesagt von einer Frau)',
    beforeGap: 'Muito ',
    gapTarget: 'obrigada',
    afterGap: ' pela ajuda!',
    infinitiveCue: 'danken (weibliche Sprecherin)',
    options: ['obrigada', 'obrigado', 'obrigados', 'obrigadas'],
    grammaticalExplanation: 'Frauen und Mädchen bedanken sich im Portugiesischen immer mit der weiblichen Form „obrigada“, egal wer ihnen gegenübersteht.',
  },
  {
    id: 'cloze_05',
    category: 'cultura',
    contextTitleDe: 'Das Gefühl von Saudade ausdrücken',
    fullSentencePt: 'Eu tenho muitas saudades tuas.',
    sentenceDe: 'Ich vermisse dich sehr (Ich habe viele Sehnsüchte nach dir).',
    beforeGap: 'Eu ',
    gapTarget: 'tenho',
    afterGap: ' muitas saudades tuas.',
    infinitiveCue: 'ter (ich / eu)',
    options: ['tenho', 'tens', 'tem', 'temos'],
    grammaticalExplanation: '„Ter saudades de...“ ist die feste Redewendung. Das Verb „ter“ (haben) wird in der 1. Person Singular unregelmäßig zu „tenho“ konjugiert.',
  },
];

export const EAR_TRAINING_MODULES: EarTrainingPair[] = [
  {
    id: 'ear_01_chiado',
    title: 'Das berühmte portugiesische „Chiado“ (S = Sch)',
    descriptionDe: 'Das Markenzeichen Portugals: Ein „s“ oder „z“ am Silbenende oder vor Konsonanten wird immer wie ein weiches deutsches „Sch“ [ʃ] gesprochen!',
    ruleTitle: 'S / Z am Silbenende = [ʃ] („Sch“)',
    ruleExplanationDe: 'Wörter wie „Lisboa“ klingen wie „Lischboa“, „Gostar“ wie „Guschtar“ und „Três“ wie „Tresch“. Wer diesen Laut beherrscht, klingt sofort wie ein Portugiese!',
    audioA: { text: 'Lisboa', label: 'Lisboa', phonetic: '[leezh-BOH-ah]' },
    audioB: { text: 'Gosto muito', label: 'Gosto muito', phonetic: '[GOSH-too MWEE-too]' },
    challenge: {
      question: 'Welches Wort wird mit dem typisch portugiesischen „Sch“-Laut gesprochen?',
      targetAudio: 'Português',
      options: ['Português (Portugiesisch)', 'Português (hartes S)', 'Portugueso'],
      correctIndex: 0,
    },
  },
  {
    id: 'ear_02_vowel_reduction',
    title: 'Vokalreduktion: Das „verschluckte E“',
    descriptionDe: 'In Portugal werden unbetonte Vokale fast stumm! Ein unbetontes „e“ wird zu einem extrem kurzen Laut [ɨ], fast wie ein kurzes deutsches Murmel-E.',
    ruleTitle: 'Unbetontes E = [ɨ] (fast unhörbar)',
    ruleExplanationDe: 'Wörter wie „Excelente“ klingen in Portugal wie „sh-slente“, „De Lisboa“ wie „d’Lischboa“. Die Sprache klingt dadurch oft slawisch angehaucht und sehr rhythmisch!',
    audioA: { text: 'Excelente', label: 'Excelente', phonetic: '[ay-shlayn-t(e)]' },
    audioB: { text: 'De nada', label: 'De nada', phonetic: '[d’NAH-dah]' },
    challenge: {
      question: 'Welches Wort verdeutlicht die typisch europäisch-portugiesische Vokalreduktion?',
      targetAudio: 'Portugal',
      options: ['Portugal (Pur-tu-gal)', 'Portügal', 'Portocali'],
      correctIndex: 0,
    },
  },
  {
    id: 'ear_03_nasal_vowels',
    title: 'Der echte Nasalklang „ÃO“ (Pão & Não)',
    descriptionDe: 'Der Ton strömt gleichzeitig durch Mund und Nase – ein unverkennbares Kennzeichen der portugiesischen Sprache.',
    ruleTitle: 'Tilde ~ erzeugt echte Nasalresonanz',
    ruleExplanationDe: 'Die Tilde (~) über dem A lässt die Luft sanft durch die Nase klingen: „Não“ (nein) und „Pão“ (Brot). Niemals ein normales deutsches „N“ oder „M“ am Ende mitsprechen!',
    audioA: { text: 'Pão quente', label: 'Pão quente', phonetic: '[pãw KAIN-t(e)]' },
    audioB: { text: 'Não, obrigado', label: 'Não, obrigado', phonetic: '[nãw oh-bree-GAH-doo]' },
    challenge: {
      question: 'Welches portugiesische Wort hat den reinen Nasallaut?',
      targetAudio: 'Coração',
      options: ['Coração (Herz)', 'Corason', 'Corazao'],
      correctIndex: 0,
    },
  },
];
