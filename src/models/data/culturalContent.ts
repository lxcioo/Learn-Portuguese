export interface CulturalFact {
  id: string;
  term: string;
  category: 'Sprache & Emotion' | 'Gastronomie' | 'Geschichte & Tradition' | 'Alltag & Höflichkeit' | 'Musik & Kunst';
  portugueseTitle: string;
  germanTitle: string;
  summary: string;
  details: string[];
  didYouKnow: string;
  keywords: string[];
  emoji: string;
  audioPronunciation?: string;
}

export const CULTURAL_FACTS: CulturalFact[] = [
  {
    id: 'saudade',
    term: 'Saudade',
    category: 'Sprache & Emotion',
    portugueseTitle: 'A Saudade Portuguesa',
    germanTitle: 'Das unübersetzbare Gefühl der Sehnsucht',
    summary: 'Eine der berühmtesten Besonderheiten der portugiesischen Sprache: eine melancholisch-süße Mischung aus Wehmut, Liebe und tiefer Sehnsucht nach einem abwesenden Menschen, Ort oder einer vergangenen Zeit.',
    details: [
      'Gilt weltweit als eines der am schwersten zu übersetzenden Wörter überhaupt.',
      'Entstand historisch während des Zeitalters der Entdeckungen (*Descobrimentos*), als Seefahrer für Jahre auf den Ozeanen verschwanden und Familien an den Küsten zurückließen.',
      'Im Fado wird *Saudade* nicht als reine Trauer besungen, sondern als Beweis dafür, dass etwas Schönes und Bedeutsames existiert hat.',
    ],
    didYouKnow: 'Im Portugiesischen sagt man "Tenho saudades tuas" (wörtlich: "Ich habe Sehnsüchte nach dir") statt einfach nur "Ich vermisse dich".',
    keywords: ['saudade', 'saudades'],
    emoji: '🌊',
    audioPronunciation: 'saudade',
  },
  {
    id: 'pastel_de_nata',
    term: 'Pastel de Nata',
    category: 'Gastronomie',
    portugueseTitle: 'Pastel de Nata & Belém',
    germanTitle: 'Das königliche Puddingtörtchen',
    summary: 'Das weltberühmte knusprige Blätterteigtörtchen mit sahniger Vanillecremefüllung, traditionell warm serviert mit Puderzucker und Zimt.',
    details: [
      'Erfunden vor 1834 von katholischen Mönchen des Hieronymus-Klosters (*Mosteiro dos Jerónimos*) in Belém bei Lissabon.',
      'Die Mönche verbrauchten Unmengen von Eiweiß zum Stärken ihrer Gewänder und zum Klären von Wein. Das übrig gebliebene Eigelb nutzten sie für himmlische Süßspeisen.',
      'Nur die Törtchen aus der Originalbäckerei in Belém dürfen sich offiziell *Pastéis de Belém* nennen; das Rezept ist bis heute streng geheim.',
    ],
    didYouKnow: 'Portugiesen streuen vor dem Verzehr fast immer Zimt (*canela*) und etwas Puderzucker (*açúcar em pó*) darüber.',
    keywords: ['pastel de nata', 'pasteis de nata', 'pastéis de nata', 'pastel', 'belem', 'belém'],
    emoji: '🥧',
    audioPronunciation: 'pastel de nata',
  },
  {
    id: 'fado',
    term: 'Fado',
    category: 'Musik & Kunst',
    portugueseTitle: 'O Fado Tradicional',
    germanTitle: 'Der Gesang des Schicksals',
    summary: 'Der traditionelle, zutiefst emotionale Musikstil Portugals (UNESCO-Weltkulturerbe). Das Wort stammt vom lateinischen *fatum* (Schicksal).',
    details: [
      'Entstand im frühen 19. Jahrhundert in den ärmlichen Hafenvierteln Lissabons (Alfama, Mouraria, Bairro Alto).',
      'Wird immer begleitet von der birnenförmigen, 12-saitigen portugiesischen Gitarre (*Guitarra Portuguesa*) und einer klassischen Konzertgitarre (*Viola*).',
      'Amália Rodrigues gilt als die unangefochtene "Königin des Fado" (*Rainha do Fado*).',
    ],
    didYouKnow: 'In einer traditionellen *Casa de Fado* verstummen alle Gespräche und das Licht wird gedimmt, sobald jemand ruft: "Silêncio, que se vai cantar o fado!" (Stille, es wird Fado gesungen!).',
    keywords: ['fado', 'fadista', 'guitarra portuguesa', 'alfama', 'mouraria'],
    emoji: '🎸',
    audioPronunciation: 'o fado',
  },
  {
    id: 'bica_cafe',
    term: 'Bica & Café',
    category: 'Alltag & Höflichkeit',
    portugueseTitle: 'A Cultura do Café & A Bica',
    germanTitle: 'Portugals legendäre Kaffeekultur',
    summary: 'In Portugal ist Kaffeetrinken ein heiliges tägliches Ritual. Ein schneller Espresso an der Theke kostet selten mehr als einen Euro und wird mehrmals am Tag genossen.',
    details: [
      'In Lissabon nennt man den Espresso fast immer "uma bica". Der Legende nach entstand der Name im berühmten Café *A Brasileira* als Abkürzung für: "Beba Isto Com Açúcar" (Trink dies mit Zucker!).',
      'Im Norden (Porto) bestellt man dagegen eher einen "cimbalino" (benannt nach den alten Kaffeemaschinen der italienischen Marke La Cimbali).',
      'Wer Milchkaffee möchte, bestellt einen *Galão* (heißer Kaffee mit viel Milch im hohen Glas) oder eine *Meia de leite* in der Tasse.',
    ],
    didYouKnow: 'Man bestellt in Portugal einfach "um café" und bekommt automatisch einen kräftigen, aromatischen Espresso serviert.',
    keywords: ['bica', 'café', 'galão', 'galao', 'meia de leite', 'cimbalino'],
    emoji: '☕',
    audioPronunciation: 'uma bica',
  },
  {
    id: 'obrigado_politeness',
    term: 'Obrigado / Obrigada',
    category: 'Alltag & Höflichkeit',
    portugueseTitle: 'Obrigado ou Obrigada?',
    germanTitle: 'Das grammatikalische Danke-Ritual',
    summary: 'Ein häufiger Stolperstein für Anfänger: Im Portugiesischen richtet sich das "Danke" immer nach dem Geschlecht der sprechenden Person, niemals nach dem Angesprochenen!',
    details: [
      'Ein Mann oder Junge sagt ausnahmslos "Obrigado" (wörtlich: "[Ich bin Ihnen] verpflichtet").',
      'Eine Frau oder ein Mädchen sagt immer "Obrigada".',
      'Die Antwort darauf lautet meist sympathisch "De nada" (Gern geschehen) oder "Ora essa!" (Keine Ursache).',
    ],
    didYouKnow: 'Im Plural können sich Gruppen sogar mit "Obrigados" oder "Obrigadas" bedanken, was man in festlichen Reden manchmal hört.',
    keywords: ['obrigado', 'obrigada'],
    emoji: '🤝',
    audioPronunciation: 'obrigado',
  },
  {
    id: 'electrico_28',
    term: 'Eléctrico 28',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'O Eléctrico 28',
    germanTitle: 'Lissabons gelbe Zeitmaschine',
    summary: 'Die historische Straßenbahnlinie 28E gehört zu den bekanntesten Wahrzeichen Lissabons. Seit den 1930er Jahren klettert sie die steilsten Hügel der Stadt hinauf.',
    details: [
      'Die alten "Remodelado"-Wagen stammen ursprünglich aus den 1930er und 1940er Jahren.',
      'Moderne Straßenbahnen könnten die extrem engen Kurven und steilen Anstiege von bis zu 14% Steigung im Alfama-Viertel gar nicht bewältigen.',
      'Fährt von Martim Moniz über Graça, Alfama, Baixa bis zum Friedhof von Prazeres.',
    ],
    didYouKnow: 'Die Fahrer müssen an steilen Kurven manchmal noch manuell Sand auf die Schienen streuen, um nicht ins Rutschen zu geraten.',
    keywords: ['eléctrico', 'electrico', 'eletrico', 'tram'],
    emoji: '🚋',
    audioPronunciation: 'o eléctrico',
  },
  {
    id: 'azulejos',
    term: 'Azulejos',
    category: 'Musik & Kunst',
    portugueseTitle: 'A Arte dos Azulejos',
    germanTitle: 'Die Poesie der blauen Fliesen',
    summary: 'Die glasierten, meist kunstvoll handbemalten Keramikfliesen prägen das Stadtbild Portugals wie kein zweites Architekturelement.',
    details: [
      'Das Wort stammt aus dem Arabischen *al-zillij* (kleiner polierter Stein). Die Mauren brachten die Kachelkunst auf die Iberische Halbinsel.',
      'Im 17. und 18. Jahrhundert entwickelte Portugal seinen eigenen Stil: monochrome blaue und weiße Fliesenbilder mit historischen, biblischen und maritimen Szenen.',
      'Der Bahnhof *São Bento* in Porto ist mit über 20.000 Azulejos verkleidet und gilt als einer der schönsten Bahnhöfe der Welt.',
    ],
    didYouKnow: 'Azulejos dienten nicht nur der Ästhetik, sondern isolierten die Häuser auch vor feuchter Atlantikluft und sommerlicher Hitze.',
    keywords: ['azulejo', 'azulejos'],
    emoji: '🏛️',
    audioPronunciation: 'os azulejos',
  },
  {
    id: 'bacalhau',
    term: 'Bacalhau',
    category: 'Gastronomie',
    portugueseTitle: 'O Fiel Amigo: Bacalhau',
    germanTitle: 'Der treue Freund der portugiesischen Küche',
    summary: 'Gesalzener und getrockneter Kabeljau (*Bacalhau*) ist das unbestrittene Nationalgericht Portugals – obwohl der Fisch gar nicht vor der eigenen Küste schwimmt!',
    details: [
      'Seit dem 14. Jahrhundert fuhren portugiesische Fischer bis nach Neufundland und Grönland, um Kabeljau zu fangen und durch Einsalzen für Monate haltbar zu machen.',
      'Man sagt in Portugal scherzhaft, es gäbe mindestens 365 verschiedene Bacalhau-Rezepte – eines für jeden Tag im Jahr.',
      'Die beliebteste Alltagsversion ist *Bacalhau à Brás* (fein gezupfter Kabeljau mit feinen Kartoffelstreifen, Rührei, Zwiebeln und schwarzen Oliven).',
    ],
    didYouKnow: 'An Heiligabend (*Consoada*) isst fast jede Familie in Portugal traditionell gekochten Bacalhau mit Kohl und Kartoffeln.',
    keywords: ['bacalhau'],
    emoji: '🐟',
    audioPronunciation: 'o bacalhau',
  },
  {
    id: 'calcada_portuguesa',
    term: 'Calçada Portuguesa',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'A Calçada Portuguesa',
    germanTitle: 'Der Teppich aus schwarzem und weißem Stein',
    summary: 'Das kunstvolle Straßenpflaster aus weißen Kalkstein- und schwarzen Basaltwürfeln, das Gehwege, Prachtboulevards und Plätze in Portugal ziert.',
    details: [
      'Die Handwerker, die dieses Pflaster millimetergenau mit dem Hammer verlegen, heißen *Mestres Calceteiros*.',
      'Das berühmteste Muster ist *Mar Largo* (weites Meer) auf dem Rossio-Platz in Lissabon, das optisch verblüffende 3D-Wellen erzeugt.',
      'Die Tradition begann nach dem großen Erdbeben von Lissabon 1755 und wurde von General Castilho 1842 beim Umbau der Burg São Jorge perfektioniert.',
    ],
    didYouKnow: 'Wegen der glattgelaufenen Steine kann das Pflaster bei Regen spiegelglatt werden – einheimische Lissabonner tragen deshalb selten glatte Ledersohlen!',
    keywords: ['calçada', 'calcada', 'calceteiro'],
    emoji: '🏁',
    audioPronunciation: 'a calçada portuguesa',
  },
  {
    id: 'santos_populares',
    term: 'Festas dos Santos Populares',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'As Festas dos Santos Populares',
    germanTitle: 'Die magischen Juni-Nächte',
    summary: 'Im Juni verwandeln sich Portugals Städte in riesige Straßenfeste unter freiem Himmel: Santo António in Lissabon und São João in Porto.',
    details: [
      'In der Nacht vom 12. auf den 13. Juni feiert Lissabon den Schutzpatron *Santo António* in Alfama mit gegrillten Sardinen (*sardinhas assadas*), Sangria und Volksmusik.',
      'Tradition ist es, der oder dem Liebsten einen kleinen Topf Buschbasilikum (*manjerico*) mit einer Papiernelke und einem romantischen Vierzeiler zu schenken.',
      'In Porto (23. Juni) klopfen sich die Menschen bei der *Festa de São João* gegenseitig mit quietschenden Plastikhämmern auf den Kopf.',
    ],
    didYouKnow: 'Santo António gilt in Portugal als Schutzpatron der Liebenden und Ehestifter (*santo casamenteiro*).',
    keywords: ['santo antónio', 'santo antonio', 'são joão', 'sao joao', 'sardinha', 'manjerico'],
    emoji: '🎉',
    audioPronunciation: 'santo antónio',
  },
];

/**
 * Checks a string or array of words for known cultural terms and returns the first match.
 */
export function findCulturalFact(input: string | string[]): CulturalFact | null {
  const text = (Array.isArray(input) ? input.join(' ') : input).toLowerCase();
  
  for (const fact of CULTURAL_FACTS) {
    for (const kw of fact.keywords) {
      // Word boundary match
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(text)) {
        return fact;
      }
    }
  }
  return null;
}
