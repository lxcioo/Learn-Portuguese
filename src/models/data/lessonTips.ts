export interface LessonTip {
  title: string;
  tip: string;
  culturalNote?: string;
  pronunciationTip?: string;
}

export const LESSON_TIPS: Record<string, LessonTip> = {
  // Unit 1 - Begrüßung & Höflichkeit
  u1: {
    title: "Höflichkeit in Portugal",
    tip: "Männer sagen \"obrigado\", Frauen sagen immer \"obrigada\" – unabhängig davon, wem gedankt wird!",
    culturalNote: "\"Bom dia\" sagt man bis zum Mittagessen (ca. 13:00 Uhr). Danach folgt \"Boa tarde\" bis zum Sonnenuntergang.",
    pronunciationTip: "Das unbetonte \"o\" am Wortende wird wie ein kurzes \"u\" gesprochen: \"Obrigado\" klingt wie [obri-ga-du].",
  },
  // Unit 2 - Erste Konversationen
  u2: {
    title: "Anredeformen: Tu vs. Você",
    tip: "In Portugal wird das Wort \"você\" oft als zu distanziert oder unpersönlich empfunden. Portugiesen lassen das Pronomen meist einfach weg (\"Como está?\") oder nutzen den Vornamen (\"Como está o senhor João?\").",
    culturalNote: "\"Tudo bem?\" ist die universellste Begrüßung – die typische Antwort lautet einfach wieder: \"Tudo bem, e contigo?\"",
  },
  // Unit 3 - Essen & Trinken
  u3: {
    title: "Kaffee-Kultur in Portugal",
    tip: "Ein Espresso heißt in Lissabon meist \"uma bica\" und im Norden (Porto) \"um cimbalino\". Man bestellt ihn immer mit \"Faz favor\" oder \"Por favor\".",
    culturalNote: "Pastéis de Nata werden traditionell warm mit etwas Zimt (canela) und Puderzucker (açúcar em pó) serviert.",
    pronunciationTip: "Das \"s\" am Silbenende vor Konsonanten wird wie ein deutsches \"sch\" ausgesprochen: \"Pastéis\" = [pasch-teisch].",
  },
  // Unit 4 - Unterwegs & Transport
  u4: {
    title: "Wegbeschreibungen",
    tip: "\"Siga em frente\" bedeutet \"Geradeaus gehen\", während \"Vire à direita/esquerda\" \"Biegen Sie rechts/links ab\" heißt.",
    culturalNote: "In Lissabon kauft man die \"Viva Viagem\" bzw. \"Navegante\" Karte, die man per \"Zapping\" mit Guthaben für Metro, Busse und die berühmte Tram 28 auflädt.",
  },
  // Unit 5 - Menschen & Familie
  u5: {
    title: "Besitzanzeigende Fürwörter",
    tip: "Im Portugiesischen steht fast immer der bestimmte Artikel vor dem Possessivpronomen: \"o meu pai\" (wörtlich: der mein Vater), \"a minha mãe\" (die meine Mutter).",
  },
  // Generic fallback tips
  default: {
    title: "Sprach-Tipp für Portugal",
    tip: "Achte auf die Vokalreduktion: Unbetonte Vokale werden im europäischen Portugiesisch oft fast verschluckt, was der Sprache ihren typischen Klang verleiht.",
    pronunciationTip: "Nasallaute wie \"~ao\" werden durch Nase und Mund gleichzeitig gesprochen (wie in \"pão\" = Brot).",
  },
};

export function getLessonTip(lessonId: string): LessonTip {
  for (const key of Object.keys(LESSON_TIPS)) {
    if (lessonId.startsWith(key)) {
      return LESSON_TIPS[key];
    }
  }
  return LESSON_TIPS.default;
}
