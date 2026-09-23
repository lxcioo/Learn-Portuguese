import { Exercise } from '../types/index';

export interface LessonTip {
  title: string;
  tip: string;
  culturalNote?: string;
  pronunciationTip?: string;
}

interface ConceptMatcher {
  id: string;
  keywords: string[];
  tip: LessonTip;
}

export const CONCEPT_TIPS: ConceptMatcher[] = [
  // 1. Age & Verb "Ter" (Haben) - Prioritized before generic numbers
  {
    id: 'age_expression',
    keywords: ['quantos anos', 'anos tens', 'tem anos', 'tenho anos', 'alter', 'wie alt', 'anos'],
    tip: {
      title: "Altersangabe mit 'ter' (haben)",
      tip: "Im Portugiesischen 'hat' man Jahre, man 'ist' sie nicht! Man sagt: 'Eu tenho 25 anos' (Verb ter = haben). Die Frage nach dem Alter lautet: 'Quantos anos tens?' (wörtlich: Wie viele Jahre hast du?).",
      pronunciationTip: "'Anos' wird mit offenem 'a' und weichem 's' vor Vokalen gesprochen: [a-nuz].",
    },
  },

  // 2. Numbers, Counting & Quantity
  {
    id: 'numbers_gender',
    keywords: [
      'um', 'uma', 'dois', 'duas', 'três', 'tres', 'quatro', 'cinco', 'seis',
      'sete', 'oito', 'nove', 'dez', 'vinte', 'trinta', 'cem', 'número',
      'zählen', 'zahlen', 'zwei', 'drei', 'vier', 'fünf'
    ],
    tip: {
      title: 'Zahlen & Geschlecht im Portugiesischen',
      tip: "Achtung: Die Zahlen 1 und 2 passen sich dem Geschlecht des Nomens an! Männlich: 'um café', 'dois cafés'. Weiblich: 'uma água', 'duas águas'. Ab der Zahl 3 ('três', 'quatro'...) bleiben alle Zahlen für beide Geschlechter unverändert gleich.",
      pronunciationTip: "'Dois' wird im europäischen Portugiesisch wie [doisch] gesprochen, 'três' wie [treisch].",
    },
  },

  // 3. Farewells & Leaving
  {
    id: 'farewells',
    keywords: ['adeus', 'tchau', 'chau', 'até logo', 'até amanhã', 'tschüss', 'auf wiedersehen', 'verabschiedung', 'até já'],
    tip: {
      title: 'Verabschiedungen in Portugal',
      tip: "'Adeus' wird in Portugal eher bei formellen Anlässen oder für längere Zeit verwendet. Im Alltag unter Freunden und Bekannten verabschiedet man sich fast immer mit 'Tchau', 'Até logo' (Bis gleich) oder 'Até amanhã' (Bis morgen)!",
      culturalNote: "Portugiesen wünschen beim Abschied oft herzlich 'Fica bem!' (Mach's gut / Pass auf dich auf).",
    },
  },

  // 4. Morning & Afternoon Greetings
  {
    id: 'greetings_daytime',
    keywords: ['bom dia', 'boa tarde', 'guten morgen', 'guten tag', 'nachmittag'],
    tip: {
      title: 'Tageszeit-Begrüßungen',
      tip: "'Bom dia' (Guten Morgen / Guten Tag) sagt man traditionell bis zum Mittagessen (ca. 13:00 Uhr). Ab dem Mittagessen bis zum Sonnenuntergang sagt man 'Boa tarde'. Sobald es dunkel ist, wechselt man zu 'Boa noite'.",
      culturalNote: 'In Portugal ist es selbstverständlich, beim Betreten von Cafés oder kleineren Läden die Anwesenden freundlich mit Bom dia oder Boa tarde zu grüßen.',
    },
  },

  // 5. Evening & Night Greetings
  {
    id: 'greetings_night',
    keywords: ['boa noite', 'gute nacht', 'guten abend'],
    tip: {
      title: 'Abend- & Nachtbegrüßung: Boa noite',
      tip: "'Boa noite' bedeutet im Portugiesischen sowohl 'Guten Abend' (zur Begrüßung nach Einbruch der Dunkelheit) als auch 'Gute Nacht' (zum Abschied vor dem Schlafen).",
      pronunciationTip: "'Boa noite' wird im europäischen Portugiesisch am Ende kurz und fast verschluckt: [bo-a noit].",
    },
  },

  // 6. Politeness & Speaker Gender
  {
    id: 'thanking_gender',
    keywords: ['obrigado', 'obrigada', 'danke', 'vielen dank', 'danksagung', 'danken'],
    tip: {
      title: 'Höflichkeit: Obrigado vs. Obrigada',
      tip: "Männer sagen immer 'obrigado', Frauen sagen immer 'obrigada'! Es richtet sich strikt nach dem Geschlecht der sprechenden Person, unabhängig davon, wem gedankt wird!",
      culturalNote: "Die typische sympathische Antwort lautet 'De nada' (Gern geschehen) oder 'Ora essa!' (Keine Ursache).",
      pronunciationTip: "Das unbetonte 'o' am Ende von 'obrigado' klingt wie ein kurzes 'u': [obri-ga-du].",
    },
  },

  // 7. Please & Excuse Me
  {
    id: 'politeness_phrases',
    keywords: ['por favor', 'faz favor', 'se faz favor', 'com licença', 'desculpe', 'desculpa', 'entschuldigung', 'bitte'],
    tip: {
      title: 'Bitte & Entschuldigung',
      tip: "Im Café und Restaurant bestellt man am authentischsten mit 'Faz favor' oder 'Se faz favor'. 'Com licença' nutzt man, wenn man an jemandem vorbeigehen möchte. 'Desculpe' (Höflichkeitsform) bzw. 'Desculpa' (unter Freunden) nutzt man für eine Entschuldigung.",
    },
  },

  // 8. Introductions & Reflexive Pronouns
  {
    id: 'introductions_reflexive',
    keywords: ['chamo-me', 'qual é o seu nome', 'qual é o teu nome', 'wie heißt', 'vorstellen', 'chamar-se', 'nome'],
    tip: {
      title: 'Namen & Reflexivpronomen (Enklise)',
      tip: "Im europäischen Portugiesisch wird das Reflexivpronomen mit Bindestrich hinter das Verb gehängt: 'Chamo-me João' (Ich heiße João). Die brasilianische Voranstellung 'Me chamo' wird in Portugal im Standard vermieden.",
      pronunciationTip: "'Chamo-me' wird rhythmisch wie ein einziges Wort gesprochen: [scha-mu-m].",
    },
  },

  // 9. Origin & Nationality with "Ser de"
  {
    id: 'origin_nationality',
    keywords: ['sou de', 'de onde és', 'de onde é', 'alemão', 'alemã', 'herkunft', 'woher kommst', 'nationalität', 'português'],
    tip: {
      title: "Herkunft mit 'Ser de'",
      tip: "Deine Herkunft drückst du mit 'ser de' aus: 'Sou da Alemanha' (Ich komme aus Deutschland), 'Sou de Berlim' (Ich bin aus Berlin). Beachte: Ländernamen haben fast immer einen bestimmten Artikel (a Alemanha, a Áustria, a Suíça), Städte meist keinen Artikel.",
    },
  },

  // 10. Ser vs. Estar
  {
    id: 'ser_vs_estar',
    keywords: ['sou', 'és', 'somos', 'são', 'estou', 'estás', 'está', 'estamos', 'estão', 'ser', 'estar'],
    tip: {
      title: 'Der Schlüsselunterschied: Ser vs. Estar',
      tip: "'Ser' beschreibt dauerhafte Eigenschaften, Wesensmerkmale, Berufe und Herkunft ('Sou alemão', 'O café é quente'). 'Estar' beschreibt vorübergehende Zustände, momentanes Befinden und Orte ('Estou cansado', 'Estou em Lisboa').",
    },
  },

  // 11. Asking "How are you?" & Addressing forms
  {
    id: 'how_are_you',
    keywords: ['como estás', 'como está', 'tudo bem', 'wie geht es', 'befinden', 'contigo', 'consigo'],
    tip: {
      title: 'Befinden & Höflichkeitsanrede',
      tip: "Portugiesen vermeiden meist das Pronomen 'você'. Wenn du jemanden höflich siezen möchtest, nutzt du einfach die 3. Person Singular ohne Pronomen: 'Como está?' (Wie geht es Ihnen?). Unter Freunden sagst du: 'Como estás?' oder universell: 'Tudo bem?'",
      culturalNote: "Auf 'Tudo bem?' antwortet man einfach wieder: 'Tudo bem, e contigo?'",
    },
  },

  // 12. Question Words (W-Fragen)
  {
    id: 'question_words',
    keywords: ['onde', 'quando', 'como', 'quem', 'porquê', 'porque', 'quanto', 'fragen', 'warum', 'wo', 'wann'],
    tip: {
      title: 'Fragewörter im Portugiesischen',
      tip: "'Onde' = Wo, 'Quando' = Wann, 'Quem' = Wer, 'Como' = Wie. Merke dir bei Warum: In der Frage schreibt man 'Porquê?' (mit Akzent, betont), in der Antwort 'Porque...' (zusammen und unbetont = weil).",
    },
  },

  // 13. Ordering Coffee & Pastries
  {
    id: 'cafe_ordering',
    keywords: ['bica', 'café', 'galão', 'cimbalino', 'pastel de nata', 'pequeno-almoço', 'frühstück', 'bestellen', 'queria'],
    tip: {
      title: 'Kaffee- & Frühstückskultur',
      tip: "Bestelle niemals mit 'Eu quero' (das klingt schroff), sondern höflich mit 'Queria...' (Ich hätte gerne): 'Queria um café e um pastel de nata, se faz favor'. Ein Espresso heißt in Lissabon meist 'uma bica', im Norden 'um cimbalino'.",
      culturalNote: 'Pastéis de Nata schmecken am besten warm mit einer Prise Zimt (canela) und Puderzucker.',
    },
  },

  // 14. Supermarket & Buying Groceries
  {
    id: 'supermarket_groceries',
    keywords: ['supermercado', 'quilo', 'gramas', 'fruta', 'maçã', 'pão', 'queijo', 'leite', 'comprar', 'einkaufen', 'lebensmittel'],
    tip: {
      title: 'Einkaufen & Mengenangaben',
      tip: "An der Frischetheke fragst du höflich mit 'Tem...?' (Haben Sie...?): 'Tem pão fresco?'. Mengenangaben: 'um quilo' (ein Kilo), 'meio quilo' (500 Gramm) oder 'duzentos gramas' (200 Gramm – beachte die männliche Endung bei gramas!).",
    },
  },

  // 15. Restaurant & Paying
  {
    id: 'restaurant_bill',
    keywords: ['ementa', 'cardápio', 'conta', 'mesa', 'prato do dia', 'empregado', 'rechnung', 'speisekarte', 'restaurant'],
    tip: {
      title: 'Im Restaurant bestellen & bezahlen',
      tip: "Die Speisekarte heißt in Portugal 'a ementa'. Frage mittags immer nach dem 'Prato do dia' (Tagesgericht) – das ist frisch zubereitet und preiswert. Um die Rechnung zu verlangen: 'A conta, se faz favor' (Die Rechnung, bitte).",
      culturalNote: 'Trinkgeld (gorjeta) ist in Portugal keine Pflicht, aber bei gutem Service rundet man um 5-10% auf.',
    },
  },

  // 16. City Navigation & Directions
  {
    id: 'directions_navigation',
    keywords: ['onde fica', 'direita', 'esquerda', 'em frente', 'virar', 'rua', 'perto', 'longe', 'cidade', 'wegbeschreibung', 'rechts', 'links'],
    tip: {
      title: 'Wegbeschreibungen & Orientierung',
      tip: "Um nach dem Weg zu fragen: 'Onde fica...?' (Wo befindet sich...?). 'Vire à direita' = Biegen Sie rechts ab, 'Vire à esquerda' = Biegen Sie links ab, 'Siga em frente' = Gehen Sie geradeaus. 'Fica perto' = Es ist nah, 'Fica longe' = Es ist weit.",
    },
  },

  // 17. Public Transport & Tickets
  {
    id: 'public_transport',
    keywords: ['metro', 'comboio', 'autocarro', 'bilhete', 'estação', 'paragem', 'linha', 'zug', 'bus', 'fahrkarte'],
    tip: {
      title: 'Öffentlicher Nahverkehr in Portugal',
      tip: "In Portugal heißt der Zug 'comboio' (im Gegensatz zu brasilianischem 'trem') und der Bus 'autocarro' (nicht 'ônibus'). Ein Einzelticket ist ein 'bilhete simples'. Für Busse hält man an der Haltestelle (paragem) kurz die Hand heraus, damit der Fahrer anhält.",
    },
  },

  // 18. Family & Possessives
  {
    id: 'family_possessives',
    keywords: ['pai', 'mãe', 'filho', 'filha', 'irmão', 'irmã', 'marido', 'mulher', 'família', 'o meu', 'a minha', 'eltern', 'familie'],
    tip: {
      title: 'Besitzanzeigende Fürwörter mit Artikel',
      tip: "Im europäischen Portugiesisch steht vor Possessivpronomen (mein, dein, sein...) fast immer der bestimmte Artikel: 'o meu pai' (mein Vater), 'a minha irmã' (meine Schwester), 'os nossos amigos' (unsere Freunde).",
    },
  },

  // 19. Telling Time
  {
    id: 'telling_time',
    keywords: ['que horas são', 'é uma hora', 'são duas', 'meio-dia', 'meia-noite', 'uhrzeit', 'stunde', 'horas'],
    tip: {
      title: 'Uhrzeiten auf Portugiesisch',
      tip: "Achte auf Singular und Plural: Um 1 Uhr sagt man 'É uma hora' (Singular). Ab 2 Uhr heißt es 'São duas horas', 'São três horas' (Plural). Für Zeitpunkte nutzt du 'às': 'Encontramo-nos às oito horas' (Wir treffen uns um 8 Uhr).",
    },
  },

  // 20. Routine & Daily Schedule
  {
    id: 'daily_routine',
    keywords: ['acordar', 'levantar-se', 'almoçar', 'jantar', 'deitar-se', 'tagesablauf', 'routine', 'manhã', 'noite'],
    tip: {
      title: 'Tagesablauf & Mahlzeiten in Portugal',
      tip: "Das Frühstück heißt 'o pequeno-almoço' (wörtlich: das kleine Mittagessen). Das Mittagessen (o almoço) findet typischerweise zwischen 13:00 und 14:30 Uhr statt, das Abendessen (o jantar) oft erst gegen 20:30 oder 21:30 Uhr.",
    },
  },

  // 21. Hobbies & Sports
  {
    id: 'hobbies_sports',
    keywords: ['futebol', 'jogar', 'tocar', 'praticar', 'praia', 'ler', 'música', 'desporto', 'hobbys', 'freizeit'],
    tip: {
      title: 'Hobbys: Jogar vs. Tocar vs. Fazer',
      tip: "Für Sportarten und Ballspiele nutzt du 'jogar' ('jogar futebol', 'jogar ténis'). Für Musikinstrumente nutzt du immer 'tocar' ('tocar guitarra', 'tocar piano'). Für Aktivitäten nutzt du 'fazer' ('fazer desporto', 'fazer caminhadas').",
    },
  },

  // 22. Home, Rooms & Furniture
  {
    id: 'home_furniture',
    keywords: ['quarto', 'sala', 'cozinha', 'casa de banho', 'cama', 'mesa', 'apartamento', 'casa', 'wohnung', 'zimmer'],
    tip: {
      title: 'Räume & Wohnungsvokabular',
      tip: "Das Badezimmer heißt in Portugal immer 'a casa de banho' (im brasilianischen Portugiesisch 'o banheiro'). Das Schlafzimmer heißt 'o quarto' und das Wohnzimmer 'a sala de estar'. Beim Mieten fragt man nach 'alugar'.",
    },
  },

  // 23. Clothes & Shopping
  {
    id: 'clothes_adjectives',
    keywords: ['roupa', 'camisa', 'calças', 'vestido', 'sapatos', 'casaco', 'tamanho', 'kleidung', 'anprobieren'],
    tip: {
      title: 'Kleidung & Adjektivstellung',
      tip: "Adjektive stehen im Portugiesischen fast immer hinter dem Substantiv und passen sich in Geschlecht und Zahl an: 'uma camisa branca' (ein weißes Hemd), 'uns sapatos pretos' (schwarze Schuhe). Vor dem Kauf fragst du: 'Posso provar?' (Kann ich das anprobieren?).",
    },
  },

  // 24. Health & Medical
  {
    id: 'health_doctor',
    keywords: ['cabeça', 'dor', 'médico', 'hospital', 'farmácia', 'dói-me', 'doente', 'gesundheit', 'arzt', 'schmerzen'],
    tip: {
      title: 'Beim Arzt & Körperbeschwerden',
      tip: "Schmerzen drückt man mit 'Doer' und dem Dativpronomen aus: 'Dói-me a cabeça' (Mir tut der Kopf weh), 'Doem-me as costas' (Mir tut der Rücken weh). Notfall-Apotheken heißen 'Farmácia de serviço'.",
    },
  },

  // 25. Work & Professions
  {
    id: 'work_professions',
    keywords: ['trabalho', 'escritório', 'engenheiro', 'professor', 'médico', 'empresa', 'chefe', 'beruf', 'arbeit'],
    tip: {
      title: 'Berufe ohne unbestimmten Artikel',
      tip: "Wenn du deinen Beruf nennst, lässt du den unbestimmten Artikel weg: 'Sou engenheiro' (Ich bin Ingenieur) oder 'Ela é médica' (Sie ist Ärztin) – nicht 'Sou um engenheiro'!",
    },
  },

  // 26. Technology
  {
    id: 'technology_words',
    keywords: ['computador', 'telemóvel', 'ecrã', 'rato', 'ficheiro', 'internet', 'handy', 'computer'],
    tip: {
      title: 'Europäisches Technik-Vokabular',
      tip: "Portugal verwendet eigene Technikbegriffe: Das Handy heißt 'o telemóvel' (in Brasilien 'o celular'), der Bildschirm heißt 'o ecrã' (BR: 'a tela') und die Computermaus heißt wörtlich 'o rato' (BR: 'o mouse').",
    },
  },

  // 27. Weather
  {
    id: 'weather_phrases',
    keywords: ['tempo', 'chuva', 'sol', 'frio', 'calor', 'vento', 'wetter', 'regnen', 'sonne'],
    tip: {
      title: "Das Wetter mit 'Estar'",
      tip: "Wetterzustände werden im Portugiesischen meist mit dem Verb 'Estar' ausgedrückt: 'Está sol' (Die Sonne scheint), 'Está frio' (Es ist kalt), 'Está calor' (Es ist warm). Wenn es gerade regnet: 'Está a chover' (estar a + Infinitiv).",
    },
  },

  // 28. Subjunctive & Emotions
  {
    id: 'subjunctive_emotions',
    keywords: ['espero que', 'oxalá', 'talvez', 'duvido', 'tomara', 'gefühle', 'meinung', 'hoffnung'],
    tip: {
      title: 'Wünsche & Der Conjuntivo (Subjunktiv)',
      tip: "Ausdrücke des Wunsches, der Ungewissheit oder Hoffnung wie 'Espero que...' (Ich hoffe, dass...) oder 'Talvez...' (Vielleicht...) verlangen im Portugiesischen den Konjunktiv (o conjuntivo): 'Espero que estejas bem!' (Ich hoffe, es geht dir gut!).",
    },
  },

  // 29. Future with "Ir"
  {
    id: 'future_ir',
    keywords: ['vou fazer', 'vai ser', 'vamos viajar', 'amanhã', 'zukunft', 'pläne'],
    tip: {
      title: 'Die Zukunft im Alltag: Ir + Infinitiv',
      tip: "In der gesprochenen Sprache bilden Portugiesen die Zukunft fast ausschließlich mit der Präsensform von 'ir' (gehen) plus Infinitiv: 'Vou viajar amanhã' (Ich werde morgen reisen), 'Vamos almoçar juntos' (Wir werden zusammen zu Mittag essen).",
    },
  },

  // 30. Travel & Airport
  {
    id: 'travel_airport',
    keywords: ['aeroporto', 'voo', 'bagagem', 'passaporte', 'porta de embarque', 'hotel', 'flughafen', 'reisen'],
    tip: {
      title: 'Reise- & Flughafenwortschatz',
      tip: "Das Flugsteig heißt auf Portugiesisch 'a porta de embarque'. Handgepäck ist 'a mala de mão', während aufgegebenes Gepäck 'a bagagem de porão' genannt wird. Ein Zimmer mit Meerblick ist 'um quarto com vista para o mar'.",
    },
  },
];

export const LEVEL_TIPS: Record<string, LessonTip> = {
  // Unit 1
  u1_l1: {
    title: 'Begrüßung & Höflichkeit',
    tip: 'Männer sagen immer "obrigado", Frauen sagen immer "obrigada" – unabhängig davon, wer angesprochen wird!',
    culturalNote: '"Bom dia" sagt man traditionell bis zum Mittagessen (ca. 13:00 Uhr), danach "Boa tarde" bis zum Sonnenuntergang.',
    pronunciationTip: 'Unbetonte Vokale am Wortende werden kurz und dumpf gesprochen: "Obrigado" = [obri-ga-du].',
  },
  u1_l2: {
    title: 'Sich vorstellen & Herkunft',
    tip: 'Im europäischen Portugiesisch wird das Reflexivpronomen mit Bindestrich angehängt: "Chamo-me..." (nicht brasilianisch "Me chamo").',
    culturalNote: 'Unter Portugiesen folgt nach dem Namen meist direkt die herzliche Frage nach der Herkunft: "De onde és?".',
  },
  u1_l3: {
    title: 'Zahlen & Alter',
    tip: 'Die Zahlen 1 und 2 richten sich nach dem grammatikalischen Geschlecht: "um/uma", "dois/duas". Das Alter drückt man mit dem Verb "ter" (haben) aus: "Tenho 20 anos".',
    pronunciationTip: '"Três" wird wie [treisch] ausgesprochen, "seis" wie [seisch].',
  },

  // Unit 2
  u2_l1: {
    title: 'Befinden & Höflichkeitsformen',
    tip: 'Vermeide im Alltag das Wort "você". Für ein höfliches Siezen nutzt du die 3. Person Singular ("Como está?"). Unter Freunden genügt "Como estás?" oder "Tudo bem?".',
  },
  u2_l2: {
    title: 'Wichtige W-Fragen',
    tip: 'Merke dir: "Onde" = Wo, "Quando" = Wann, "Quem" = Wer. Frage "Porquê?" mit Akzent, Antwort "Porque..." unbetont zusammen.',
  },
  u2_l3: {
    title: 'Sprachen & Verständigung',
    tip: 'Wenn du etwas nicht verstanden hast: "Pode repetir, se faz favor?" (Können Sie das bitte wiederholen?) oder "Fala mais devagar" (Sprich langsamer).',
  },

  // Unit 3
  u3_l1: {
    title: 'Kaffee-Kultur & Frühstück',
    tip: 'Ein Espresso heißt in Lissabon meist "uma bica" und im Norden "um cimbalino". Bestelle stets höflich mit "Queria..." (Ich hätte gerne).',
    culturalNote: 'Pastéis de Nata werden traditionell warm mit etwas Zimt (canela) serviert.',
  },
  u3_l2: {
    title: 'Lebensmittel & Supermarkt',
    tip: 'Mengenangaben im Supermarkt: "meio quilo" (500g), "duzentos gramas" (200g – beachte die männliche Endung bei gramas!).',
  },
  u3_l3: {
    title: 'Im Restaurant bestellen & bezahlen',
    tip: 'Die Speisekarte heißt "a ementa". Nach der Rechnung fragt man mit: "A conta, se faz favor". Das Couvert (Brot, Oliven) bezahlt man nur, wenn man es isst.',
  },

  // Unit 4
  u4_l1: {
    title: 'Verkehrsmittel & Tickets',
    tip: 'In Portugal heißt der Zug "comboio" und der Bus "autocarro". Ein Einzelticket heißt "bilhete simples".',
  },
  u4_l2: {
    title: 'Orte in der Stadt',
    tip: 'Um nach einem Ort zu fragen: "Onde fica a estação / a farmácia?" (Wo befindet sich der Bahnhof / die Apotheke?).',
  },
  u4_l3: {
    title: 'Wegbeschreibungen',
    tip: '"Siga em frente" = Gehen Sie geradeaus, "Vire à direita/esquerda" = Biegen Sie rechts/links ab.',
  },

  // Unit 5
  u5_l1: {
    title: 'Familienmitglieder',
    tip: 'Im Portugiesischen steht fast immer der bestimmte Artikel vor dem Possessivpronomen: "o meu pai", "a minha mãe".',
  },
  u5_l2: {
    title: 'Aussehen beschreiben',
    tip: 'Adjektive passen sich in Zahl und Geschlecht an: "alto/alta" (groß), "baixo/baixa" (klein), "cabelo castanho" (braunes Haar).',
  },
  u5_l3: {
    title: 'Charakter & Persönlichkeit',
    tip: 'Dauerhafte Charaktereigenschaften werden immer mit "ser" ausgedrückt: "Ele é muito simpático e trabalhador".',
  },

  // Unit 6
  u6_l1: {
    title: 'Uhrzeiten & Tageszeiten',
    tip: '"É uma hora" (Singular um 1 Uhr) vs. "São duas horas" (Plural ab 2 Uhr). Für Zeitpunkte nutzt du "às": "às três horas".',
  },
  u6_l2: {
    title: 'Wochentage auf Portugiesisch',
    tip: 'Die Wochentage von Montag bis Freitag zählen durch: segunda-feira (Mo), terça-feira (Di), quarta-feira (Mi), quinta-feira (Do), sexta-feira (Fr).',
  },
  u6_l3: {
    title: 'Tägliche Routine & Reflexivverben',
    tip: 'Reflexivverben im Präsens: "Acordo cedo" (Ich wache früh auf), "Levanto-me às sete" (Ich stehe um 7 auf).',
  },

  // Unit 7
  u7_l1: {
    title: 'Sport & Aktivitäten',
    tip: 'Ballspiele nutzen "jogar" ("jogar futebol"), allgemeine Sportaktivitäten nutzen "fazer" ("fazer caminhadas").',
  },
  u7_l2: {
    title: 'Musik, Kino & Bücher',
    tip: 'Musikinstrumente spielen heißt immer "tocar" ("tocar guitarra", "tocar piano"), niemals "jogar"!',
  },
  u7_l3: {
    title: 'Verabredungen treffen',
    tip: 'Um dich zu verabreden: "Queres ir ao cinema?" (Möchtest du ins Kino gehen?) oder "A que horas nos encontramos?" (Um wie viel Uhr treffen wir uns?).',
  },

  // Unit 8
  u8_l1: {
    title: 'Räume & Möbel',
    tip: 'Das Badezimmer heißt in Portugal "a casa de banho", das Schlafzimmer "o quarto" und das Wohnzimmer "a sala".',
  },
  u8_l2: {
    title: 'Hausarbeit & Alltagspflichten',
    tip: '"Lavar a louça" = Geschirr spülen, "fazer a cama" = das Bett machen, "limpar a casa" = die Wohnung putzen.',
  },
  u8_l3: {
    title: 'Auf der Wohnungssuche',
    tip: 'Wohnungen werden in Portugal nach Zimmeranzahl T0, T1, T2 klassifiziert (T2 = Wohnung mit 2 separaten Schlafzimmern plus Wohnzimmer).',
  },

  // Unit 9
  u9_l1: {
    title: 'Kleidungsstücke & Accessoires',
    tip: 'Kleidungsstücke: "a camisa" (Hemd), "as calças" (Hose – immer Plural), "os sapatos" (Schuhe), "o casaco" (Jacke/Mantel).',
  },
  u9_l2: {
    title: 'Farben, Muster & Größen',
    tip: 'Farbadjektive stehen hinter dem Substantiv: "uma camisa azul", "uns sapatos pretos". Größe heißt "o tamanho".',
  },
  u9_l3: {
    title: 'An der Kasse & Umtausch',
    tip: '"Posso pagar com cartão?" (Kann ich mit Karte zahlen?) oder "Queria trocar esta camisa" (Ich möchte dieses Hemd umtauschen).',
  },

  // Unit 10
  u10_l1: {
    title: 'Die Körperteile',
    tip: '"a cabeça" (Kopf), "os olhos" (Augen), "o braço" (Arm), "a perna" (Bein), "as costas" (Rücken).',
  },
  u10_l2: {
    title: 'Symptome & Beim Arzt',
    tip: '"Dói-me a cabeça" (Mir tut der Kopf weh) mit Dativpronomen "me". Bei Fieber: "Tenho febre" (Verb ter = haben).',
  },
  u10_l3: {
    title: 'In der Apotheke',
    tip: 'In der Apotheke (*farmácia*): "Preciso de um remédio para a dor de cabeça" (Ich brauche ein Medikament gegen Kopfschmerzen).',
  },

  // Unit 11
  u11_l1: {
    title: 'Berufe & Professionen',
    tip: 'Lasse beim Nennen deines Berufs den unbestimmten Artikel weg: "Sou professor" (nicht "Sou um professor").',
  },
  u11_l2: {
    title: 'Im Büro & Arbeitsalltag',
    tip: '"o escritório" (Büro), "a reunião" (Meeting), "o colega de trabalho" (Arbeitskollege), "o prazo" (Frist/Deadline).',
  },
  u11_l3: {
    title: 'Bewerbung & Vorstellungsgespräch',
    tip: '"o currículo" (Lebenslauf), "a entrevista de emprego" (Vorstellungsgespräch), "ter experiência" (Erfahrung haben).',
  },

  // Unit 12
  u12_l1: {
    title: 'Hardware & Geräte',
    tip: 'Europäische Technikbegriffe: "o telemóvel" (Handy), "o ecrã" (Bildschirm), "o rato" (Computermaus).',
  },
  u12_l2: {
    title: 'Software & Internet',
    tip: '"descarregar" oder "fazer download" (herunterladen), "a palavra-passe" (Passwort), "a ligação à Internet" (Internetverbindung).',
  },
  u12_l3: {
    title: 'Digitale Kommunikation',
    tip: '"enviar uma mensagem" (eine Nachricht senden), "ligar para alguém" (jemanden anrufen).',
  },

  // Unit 13
  u13_l1: {
    title: 'Schule & Universität',
    tip: 'Eine Unterrichtsstunde oder Universitätsvorlesung heißt "a aula". Das Klassenzimmer heißt "a sala de aula".',
  },
  u13_l2: {
    title: 'Prüfungen & Studienmaterialien',
    tip: '"fazer um exame" (eine Prüfung ablegen), "passar no exame" (die Prüfung bestehen), "chumbar" (portugiesischer Slang für durchfallen).',
  },
  u13_l3: {
    title: 'Studienalltag in Portugal',
    tip: 'Die traditionsreichen Universitätsstädte wie Coimbra prägen Bräuche wie die "Praxe" und Feste wie die "Queima das Fitas".',
  },

  // Unit 14
  u14_l1: {
    title: 'Das Wetter & Jahreszeiten',
    tip: 'Wetter beschreibt man mit "estar": "Está sol", "Está vento", "Está frio". Bei Regen: "Está a chover".',
  },
  u14_l2: {
    title: 'Natur & portugiesische Landschaften',
    tip: '"a serra" (Gebirge), "o rio" (Fluss), "a praia" (Strand), "a costa" (Küste), "o sobreiro" (Korkeiche).',
  },
  u14_l3: {
    title: 'Tiere & Umweltschutz',
    tip: '"o animal de estimação" (Haustier), "o cão" (Hund), "o gato" (Katze), "proteger o ambiente" (die Umwelt schützen).',
  },

  // Unit 15
  u15_l1: {
    title: 'Feste & Feiertage in Portugal',
    tip: 'Im Juni feiern Portugiesen die "Santos Populares" (Santo António in Lissabon, São João in Porto) mit gegrillten Sardinen und Musik.',
  },
  u15_l2: {
    title: 'Musik & kulturelles Erbe',
    tip: 'Der traditionelle Fado wird von der 12-saitigen "Guitarra Portuguesa" begleitet und besingt Sehnsucht (*Saudade*) und Schicksal.',
  },
  u15_l3: {
    title: 'Lebensart & Typisch Portugiesisch',
    tip: 'Geselligkeit, ausgiebige Familienessen und Kaffeepausen an der Theke prägen den entspannten portugiesischen Lebensrhythmus.',
  },

  // Unit 16
  u16_l1: {
    title: 'Geld & Bankkonto',
    tip: 'Geld abheben heißt "levantar dinheiro". Das vernetzte Bankautomatensystem heißt "Multibanco".',
  },
  u16_l2: {
    title: 'Steuern & Dokumente',
    tip: 'Die persönliche portugiesische Steuernummer heißt "NIF" (Número de Identificação Fiscal) und wird an jeder Kasse erfragt.',
  },
  u16_l3: {
    title: 'Kartenzahlung & MB Way',
    tip: 'In Portugal kann man selbst kleinste Cent-Beträge bargeldlos per Multibanco-Karte oder MB Way auf dem Smartphone zahlen.',
  },

  // Unit 17
  u17_l1: {
    title: 'Emotionen & Gefühle',
    tip: '"Estou feliz" (Ich bin glücklich), "Estou cansado(a)" (Ich bin müde), "Tenho saudades" (Ich habe Sehnsucht).',
  },
  u17_l2: {
    title: 'Meinungen äußern',
    tip: '"Acho que..." (Ich glaube/finde, dass...), "Na minha opinião..." (Meiner Meinung nach...), "Concordo" (Ich stimme zu).',
  },
  u17_l3: {
    title: 'Hoffnungen & Der Conjuntivo',
    tip: 'Nach Ausdrücken wie "Espero que..." oder "Talvez..." folgt im Portugiesischen der Konjunktiv (*Conjuntivo*).',
  },

  // Unit 18
  u18_l1: {
    title: 'Fernsehen & Radio',
    tip: 'Im portugiesischen Fernsehen (RTP, SIC, TVI) werden ausländische Filme traditionell mit Untertiteln gezeigt, nicht synchronisiert.',
  },
  u18_l2: {
    title: 'Presse & Online-Medien',
    tip: '"o jornal" (Zeitung), "a notícia" (Nachricht), "as redes sociais" (soziale Medien).',
  },
  u18_l3: {
    title: 'Politik & Gesellschaft',
    tip: 'Portugal ist eine parlamentarische Republik mit einem Staatspräsidenten (*Presidente da República*) und einem Premierminister (*Primeiro-Ministro*).',
  },

  // Unit 19
  u19_l1: {
    title: 'Am Flughafen & Flugreise',
    tip: '"o cartão de embarque" (Bordkarte), "o controlo de segurança" (Sicherheitskontrolle), "o voo está atrasado" (der Flug hat Verspätung).',
  },
  u19_l2: {
    title: 'Mietwagen & Straßenverkehr',
    tip: 'Mautstraßen heißen "portagens". Fast alle Mietwagen in Portugal haben einen "Via Verde"-Transponder für automatische Mautabbuchung.',
  },
  u19_l3: {
    title: 'Hotel & Beschwerden',
    tip: '"A reserva está em meu nome" (Die Reservierung läuft auf meinen Namen), "O ar condicionado não funciona" (Die Klimaanlage funktioniert nicht).',
  },

  // Unit 20
  u20_l1: {
    title: 'Träume & Lebensziele',
    tip: '"O meu sonho é..." (Mein Traum ist es...), "Gostaria de viver em Portugal" (Ich würde gerne in Portugal leben).',
  },
  u20_l2: {
    title: 'Die Zukunft mit "Ir + Infinitiv"',
    tip: 'Die gesprochene Zukunft wird mit "ir" plus Infinitiv gebildet: "Vou aprender português" (Ich werde Portugiesisch lernen).',
  },
  u20_l3: {
    title: 'Konditional & Höfliche Wünsche',
    tip: 'Das Konditional drückt Träume und höfliche Wünsche aus: "Seria maravilhoso" (Es wäre wunderbar), "Poderia ajudar-me?" (Könnten Sie mir helfen?).',
  },
};

/**
 * Returns a contextual pedagogical tip tailored directly to the active exercise content.
 * Falls back to level-specific or unit grammar tips.
 */
export function getExerciseTip(exercise?: Exercise, lessonId?: string): LessonTip {
  if (exercise) {
    // Gather all text cues from this exercise
    const texts: string[] = [
      exercise.question || '',
      exercise.correctAnswer || '',
      exercise.prompt || '',
      exercise.cardFront || '',
      exercise.cardBack || '',
      exercise.cardNotes || '',
      exercise.dialoguePrompt || '',
      exercise.dialogueContext || '',
      ...(exercise.options || []),
      ...(exercise.vocabulary?.map((v) => `${v.text} ${v.translation}`) || []),
    ];

    const combinedText = ' ' + texts.join(' ').toLowerCase().replace(/[,.!?;:«»"'()/[\]{}]/g, ' ') + ' ';

    // 1. Try matching specific concept rules
    for (const matcher of CONCEPT_TIPS) {
      for (const kw of matcher.keywords) {
        const normKw = kw.toLowerCase().trim();
        if (!normKw) continue;

        if (normKw.includes(' ')) {
          if (combinedText.includes(normKw)) {
            return matcher.tip;
          }
        } else {
          if (combinedText.includes(' ' + normKw + ' ')) {
            return matcher.tip;
          }
        }
      }
    }

    // 2. Check if exercise ID contains a level code (e.g. u1_l3_e2 -> u1_l3)
    if (exercise.id) {
      const match = exercise.id.match(/^(u\d+_l\d+)/i);
      if (match && LEVEL_TIPS[match[1].toLowerCase()]) {
        return LEVEL_TIPS[match[1].toLowerCase()];
      }
    }
  }

  // 3. Fallback to lessonId (e.g. u1_l3)
  if (lessonId) {
    const cleanId = lessonId.toLowerCase();
    for (const key of Object.keys(LEVEL_TIPS)) {
      if (cleanId.startsWith(key)) {
        return LEVEL_TIPS[key];
      }
    }
  }

  // 4. Default fallback tip
  return {
    title: 'Tipp für europäisches Portugiesisch',
    tip: 'Achte auf die Vokalreduktion: Im europäischen Portugiesisch werden unbetonte Vokale stark verkürzt oder fast verschluckt, während betonte Silben kraftvoll und melodisch klingen.',
    culturalNote: 'Beim Hören hilft es, sich auf die betonten Silben und Schlüsselwörter zu konzentrieren.',
    pronunciationTip: 'Nasallaute wie "~ão" werden durch Nase und Mund gleichzeitig vibriert (z.B. in "pão" = Brot).',
  };
}

/**
 * Backward compatibility alias for getLessonTip
 */
export function getLessonTip(lessonId: string): LessonTip {
  return getExerciseTip(undefined, lessonId);
}
