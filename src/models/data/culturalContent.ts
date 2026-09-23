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
  // 1. Gastronomie & Spezialitäten (Prioritized before generic greetings)
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
    keywords: ['pastel de nata', 'pasteis de nata', 'pastéis de nata', 'pastel', 'belem', 'belém', 'puddingtörtchen', 'pastete'],
    emoji: '🥧',
    audioPronunciation: 'pastel de nata',
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
    keywords: ['bica', 'café', 'galão', 'galao', 'meia de leite', 'cimbalino', 'espresso', 'kaffee'],
    emoji: '☕',
    audioPronunciation: 'uma bica',
  },
  {
    id: 'francesinha',
    term: 'Francesinha',
    category: 'Gastronomie',
    portugueseTitle: 'A Francesinha do Porto',
    germanTitle: 'Das Kult-Sandwich aus Porto',
    summary: 'Portos berühmtestes Kultgericht: Ein mächtiges Sandwich mit Schinken, frischer Wurst und Rindfleisch, überbacken mit viel geschmolzenem Käse und einer würzig-scharfen Bier-Tomaten-Sauce.',
    details: [
      'Erfunden in den 1950er Jahren von Daniel David da Silva im Restaurant *A Regaleira* in Porto, inspiriert vom französischen Croque Monsieur (daher der Name: "kleine Französin").',
      'Das Geheimnis jeder Francesinha liegt in der Sauce: Jedes Restaurant in Porto hütet sein geheimes Rezept mit Bier, Piri-Piri, Tomaten und Portwein.',
      'Traditionell wird sie mit einem Spiegelei obenauf (*com ovo*) und einer Portion knusprigen Pommes serviert und stets mit Messer und Gabel gegessen.',
    ],
    didYouKnow: 'Portugiesen trinken zur Francesinha fast ausnahmslos ein frisch gezapftes, kühles Bier (*fino* im Norden, *imperial* in Lissabon).',
    keywords: ['francesinha', 'francesinhas', 'porto sandwich', 'regaleira'],
    emoji: '🥪',
    audioPronunciation: 'a francesinha',
  },
  {
    id: 'vinho_do_porto',
    term: 'Vinho do Porto',
    category: 'Gastronomie',
    portugueseTitle: 'O Vinho do Porto & O Vale do Douro',
    germanTitle: 'Das flüssige Gold des Douro-Tals',
    summary: 'Der weltberühmte Likörwein, der an den spektakulären Schieferterrassen des Douro-Tals heranreift und in den historischen Weinkellern von Vila Nova de Gaia gelagert wird.',
    details: [
      'Das Douro-Tal ist das älteste gesetzlich geschützte Weinanbaugebiet der Welt (bereits 1756 durch den Marquês de Pombal per Gesetz dekretiert).',
      'Die Gärung wird vorzeitig durch Zugabe von 77%igem Weingeist (*aguardente*) gestoppt, wodurch die natürliche Fruchtsüße der Trauben erhalten bleibt.',
      'Die zwei großen Stile sind *Ruby* (dunkelrot, beerenfruchtig, in großen Fässern oder Tanks gereift) und *Tawny* (bernsteinfarben, oxidativ in kleinen Holzfässern gereift, nussig-karamellig).',
    ],
    didYouKnow: 'Die traditionellen Holzsegelschiffe, die früher die Weinfässer über den reißenden Fluss Douro nach Porto transportierten, heißen *Barcos Rabelos*.',
    keywords: ['vinho do porto', 'portwein', 'douro', 'rabelo', 'tawny', 'ruby', 'vinho'],
    emoji: '🍷',
    audioPronunciation: 'o vinho do porto',
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
    keywords: ['bacalhau', 'kabeljau', 'stockfisch', 'bacalhau à brás', 'bacalhau a bras'],
    emoji: '🐟',
    audioPronunciation: 'o bacalhau',
  },
  {
    id: 'ginjinha',
    term: 'Ginjinha',
    category: 'Gastronomie',
    portugueseTitle: 'A Tradicional Ginjinha',
    germanTitle: 'Der Sauerkirschlikör aus Lissabon & Óbidos',
    summary: 'Der beliebteste Traditionslikör Portugals: Ein rubinroter Sauerkirschlikör (*Ginja*), der in winzigen Stehkneipen Lissabons oder im mittelalterlichen Óbidos genossen wird.',
    details: [
      'In den historischen Lissabonner Stehbars fragt die Bedienung stets: "Com ou sem elas?" (Mit oder ohne eingelegte Sauerkirschen im Schnapsglas?).',
      'Im pittoresken Burgstädtchen Óbidos serviert man die Ginjinha traditionell in kleinen, essbaren Bechern aus dunkler Schokolade.',
      'Die älteste und berühmteste Likörstube *A Ginjinha* am Rossio-Platz in Lissabon schenkt ihren Sauerkirschlikör bereits seit 1840 aus.',
    ],
    didYouKnow: 'Früher verabreichten portugiesische Mütter ihren Kindern bei Erkältungen oder Halsschmerzen oft einen Löffel warmen Sauerkirschlikör als Hausmittel.',
    keywords: ['ginja', 'ginjinha', 'sauerkirschlikör', 'óbidos', 'obidos'],
    emoji: '🍒',
    audioPronunciation: 'a ginjinha',
  },
  {
    id: 'pao_e_couvert',
    term: 'O Pão & O Couvert',
    category: 'Gastronomie',
    portugueseTitle: 'A Cultura do Pão e o Couvert',
    germanTitle: 'Brot, Oliven und das Restaurant-Couvert',
    summary: 'In portugiesischen Restaurants stellt die Bedienung zu Beginn ungefragt Brot, Oliven, Butter und kleine Pasteten auf den Tisch (*o couvert*).',
    details: [
      'Das Couvert ist in Portugal **kein** kostenloser Gruß des Hauses: Nur was tatsächlich verzehrt wird, darf laut portugiesischem Verbraucherschutzgesetz berechnet werden.',
      'Wer das Couvert nicht möchte, lässt es einfach unberührt stehen oder sagt freundlich: "Não, obrigado(a)". Das ist in Portugal völlig normal und niemand nimmt es übel.',
      'Portugal besitzt eine reiche Brotkultur: Vom herzhaften *Pão Alentejano* mit dicker Kruste bis zum dichten Maisbrot *Broa de Milho*.',
    ],
    didYouKnow: 'Portugiesen essen traditionell zu jeder Suppe (wie dem berühmten Grünkohl-Eintopf *Caldo Verde*) ein frisches Stück Brot.',
    keywords: ['couvert', 'pão alentejano', 'broa', 'caldo verde', 'oliven couvert', 'brot'],
    emoji: '🥖',
    audioPronunciation: 'o couvert',
  },

  // 2. Musik, Kunst & Emotion
  {
    id: 'saudade',
    term: 'Saudade',
    category: 'Sprache & Emotion',
    portugueseTitle: 'A Saudade Portuguesa',
    germanTitle: 'Das unübersetzbare Gefühl der Sehnsucht',
    summary: 'Eine der berühmtesten Besonderheiten der portugiesischen Seele: eine bittersüße Mischung aus Wehmut, Liebe und tiefer Sehnsucht nach einem abwesenden Menschen, Ort oder einer vergangenen Zeit.',
    details: [
      'Gilt weltweit als eines der am schwersten präzise zu übersetzenden Wörter überhaupt.',
      'Entstand historisch während des Zeitalters der Entdeckungen (*Descobrimentos*), als Seefahrer für Jahre auf den Weltmeeren verschwanden und Familien an den Küsten zurückließen.',
      'Im Fado wird *Saudade* nicht als reine Trauer besungen, sondern als Beweis dafür, dass etwas Schönes und Bedeutsames existiert hat.',
    ],
    didYouKnow: 'Im Portugiesischen sagt man "Tenho saudades tuas" (wörtlich: "Ich habe Sehnsüchte nach dir") statt einfach nur "Ich vermisse dich".',
    keywords: ['saudade', 'saudades', 'sehnsucht', 'wehmut'],
    emoji: '🌊',
    audioPronunciation: 'saudade',
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
    keywords: ['fado', 'fadista', 'guitarra portuguesa', 'alfama', 'mouraria', 'fado-gesang'],
    emoji: '🎸',
    audioPronunciation: 'o fado',
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
    keywords: ['azulejo', 'azulejos', 'kacheln', 'fliesen', 'wandfliesen'],
    emoji: '🏛️',
    audioPronunciation: 'os azulejos',
  },

  // 3. Geschichte & Wahrzeichen
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
    keywords: ['eléctrico', 'electrico', 'eletrico', 'tram', 'straßenbahn', 'strassenbahn', 'tram 28'],
    emoji: '🚋',
    audioPronunciation: 'o eléctrico',
  },
  {
    id: 'calcada_portuguesa',
    term: 'Calçada Portuguesa',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'A Calçada Portuguesa',
    germanTitle: 'Der Teppich aus schwarzem und weißem Stein',
    summary: 'Das kunstvolle Straßenpflaster aus weißen Kalkstein- und schwarzen Basaltwürfeln, das Gehwege, Prachtboulevards und Plätze in ganz Portugal ziert.',
    details: [
      'Die Handwerker, die dieses Pflaster millimetergenau mit dem Hammer verlegen, heißen *Mestres Calceteiros*.',
      'Das berühmteste Muster ist *Mar Largo* (weites Meer) auf dem Rossio-Platz in Lissabon, das optisch verblüffende 3D-Wellen erzeugt.',
      'Die Tradition begann nach dem großen Erdbeben von Lissabon 1755 und wurde beim Wiederaufbau der Stadt zur nationalen Kunstform erhoben.',
    ],
    didYouKnow: 'Wegen der glattgelaufenen Steine kann das Pflaster bei Regen spiegelglatt werden – einheimische Lissabonner tragen deshalb selten Schuhe mit glatten Ledersohlen!',
    keywords: ['calçada', 'calcada', 'calceteiro', 'pflaster', 'straßenpflaster'],
    emoji: '🏁',
    audioPronunciation: 'a calçada portuguesa',
  },
  {
    id: 'coimbra_universidade',
    term: 'Universidade de Coimbra',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'A Cidade dos Estudantes: Coimbra',
    germanTitle: 'Portugals traditionsreiche Studentenstadt',
    summary: 'Die 1290 gegründete Universität von Coimbra ist eine der ältesten Hochschulen Europas (UNESCO-Weltkulturerbe) und Wiege vieler portugiesischer Bräuche.',
    details: [
      'Die traditionelle studentische Tracht – der bodenlange schwarze Wollumhang (*Capa e Batina*) – inspirierte J.K. Rowling beim Entwurf der Hogwarts-Uniformen in Harry Potter.',
      'In der barocken Prachtbibliothek *Biblioteca Joanina* lebt seit Jahrhunderten eine Fledermauskolonie, die nachts Insekten frisst, welche das alte Papier bedrohen.',
      'Im Mai feiern die Studenten die *Queima das Fitas* (das feierliche Verbrennen der farbigen Bänder), eines der traditionsreichsten Feste des Landes.',
    ],
    didYouKnow: 'In Coimbra wird Fado ausschließlich von Männern gesungen, die dabei andächtig den traditionellen schwarzen Studentenmantel tragen.',
    keywords: ['coimbra', 'universidade de coimbra', 'capa e batina', 'queima das fitas', 'studentenstadt'],
    emoji: '🎓',
    audioPronunciation: 'coimbra',
  },
  {
    id: 'galo_de_barcelos',
    term: 'Galo de Barcelos',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'A Lenda do Galo de Barcelos',
    germanTitle: 'Der bunte Hahn von Barcelos',
    summary: 'Das berühmteste Symbol Portugals: Ein farbenprächtiger, schwarz lackierter Tonhahn mit roten Kämmen und bunten Herzmotiven, der für Glück, Ehrlichkeit und Gerechtigkeit steht.',
    details: [
      'Der Legende nach rettete ein gebratener Hahn einen unschuldig verurteilten Pilger vor dem Galgen, indem er mitten beim Richtermahl aufstand und laut krähte.',
      'Heute schmückt der Hahn Töpferwaren, Geschirrtücher und Souvenirs in ganz Portugal und gilt als inoffizielles Wappentier des Landes.',
      'Barcelos im Norden Portugals ist bis heute die Hauptstadt des traditionellen Keramikhandwerks.',
    ],
    didYouKnow: 'Früher gab es Souvenir-Hähne, deren Schwanzfedern mit einer feuchtigkeitsempfindlichen Beschichtung die Farbe wechselten, um Regen oder Sonnenschein anzuzeigen.',
    keywords: ['galo de barcelos', 'galo', 'barcelos', 'hahn von barcelos', 'glückshahn'],
    emoji: '🐓',
    audioPronunciation: 'o galo de barcelos',
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
    keywords: ['santo antónio', 'santo antonio', 'são joão', 'sao joao', 'sardinha', 'sardinhas', 'manjerico', 'volksfest'],
    emoji: '🎉',
    audioPronunciation: 'santo antónio',
  },
  {
    id: 'nazare_ondas',
    term: 'Nazaré & As Ondas Gigantes',
    category: 'Geschichte & Tradition',
    portugueseTitle: 'As Ondas Gigantes da Nazaré',
    germanTitle: 'Die Monsterwellen von Praia do Norte',
    summary: 'Das einstige Fischerstädtchen Nazaré an der Atlantikküste ist weltbekannt für die höchsten surfbaren Riesenwellen unseres Planeten.',
    details: [
      'Verantwortlich ist der *Canhão da Nazaré*, eine bis zu 5.000 Meter tiefe Unterwasserschlucht direkt vor dem Leuchtturm, die Meeresdünungswellen wie ein Trichter bündelt.',
      'Big-Wave-Surfer aus aller Welt reiten hier auf Brechern von über 30 Metern Höhe – überwacht von Zuschauermassen am historischen Leuchtturm.',
      'Traditionell trugen die Fischerfrauen von Nazaré die berühmten "Sete Saias" (sieben bunte Unterröcke) zum Schutz gegen die raue Atlantikgischt.',
    ],
    didYouKnow: 'Der deutsche Surfer Sebastian Steudtner stellte in Nazaré mit einer 26,21 Meter hohen Welle einen offiziellen Guinness-Weltrekord auf.',
    keywords: ['nazaré', 'nazare', 'ondas gigantes', 'surf', 'riesenwellen', 'atlantik'],
    emoji: '🏄‍♂️',
    audioPronunciation: 'nazaré',
  },

  // 4. Alltag, Höflichkeit & Gesellschaft
  {
    id: 'futebol_cultura',
    term: 'Futebol & Os Três Grandes',
    category: 'Alltag & Höflichkeit',
    portugueseTitle: 'A Paixão pelo Futebol',
    germanTitle: 'Portugals zweite Religion: Der Fußball',
    summary: 'Fußball ist in Portugal allgegenwärtig. Tägliche Sportzeitungen, lebhafte Café-Debatten und die Rivalität zwischen "Os Três Grandes" prägen den Alltag.',
    details: [
      'Nahezu jeder Portugiese unterstützt einen der drei Traditionsvereine: SL Benfica (Lissabon), Sporting CP (Lissabon) oder FC Porto.',
      'Mit Stars wie Cristiano Ronaldo, Eusébio und Luís Figo gehört Portugal seit Jahrzehnten zur absoluten Weltspitze des Sports.',
      '2016 feierte das gesamte Land den historischen Triumph bei der Europameisterschaft gegen Gastgeber Frankreich.',
    ],
    didYouKnow: 'Portugals tägliche Sportzeitungen wie *A Bola* oder *Record* haben oft höhere Auflagen als klassische Politikzeitungen.',
    keywords: ['futebol', 'benfica', 'sporting', 'fc porto', 'ronaldo', 'cristiano ronaldo', 'fussball'],
    emoji: '⚽',
    audioPronunciation: 'o futebol',
  },
  {
    id: 'multibanco',
    term: 'Rede Multibanco',
    category: 'Alltag & Höflichkeit',
    portugueseTitle: 'O Sistema Multibanco',
    germanTitle: 'Das vielseitigste Geldautomatensystem der Welt',
    summary: 'Portugals vernetztes Bankautomaten-System *Multibanco* kann weit mehr als nur Bargeld ausgeben und gilt weltweit als technologisches Vorzeigemodell.',
    details: [
      'Am Multibanco-Terminal bezahlen Portugiesen Strom-, Wasser- und Handyrechnungen, kaufen Zugtickets, zahlen Steuern oder spenden für Hilfsorganisationen.',
      'Mit der nationalen Smartphone-App *MB Way* senden sich Freunde in Sekundenschnelle Geld per Telefonnummer oder heben am Automaten ganz ohne Plastikkarte Geld ab.',
      'Das System wurde bereits 1985 gegründet und verbindet sämtliche Banken des Landes in einem einheitlichen, hochsicheren Netzwerk.',
    ],
    didYouKnow: 'Selbst an entlegenen Strandbars oder auf Wochenmärkten kann man in Portugal fast überall problemlos mit Multibanco-Karte zahlen.',
    keywords: ['multibanco', 'mb way', 'geldautomat', 'kartenzahlung'],
    emoji: '💳',
    audioPronunciation: 'multibanco',
  },
  {
    id: 'beijinhos_etiquette',
    term: 'Dois Beijinhos',
    category: 'Alltag & Höflichkeit',
    portugueseTitle: 'Os Dois Beijinhos de Cumprimento',
    germanTitle: 'Die Begrüßung mit zwei Wangenküssen',
    summary: 'Bei der persönlichen Begrüßung zwischen Frauen oder zwischen Mann und Frau begrüßen sich Portugiesen herzlich mit zwei dezenten Wangenküssen.',
    details: [
      'Man beginnt stets auf der rechten Wange (indem man den Kopf leicht nach links neigt) und wechselt dann zur linken Wange.',
      'Es handelt sich um sanfte Berührungen Wange an Wange mit einem dezenten Kussgeräusch – die Lippen berühren die Haut gewöhnlich nicht direkt.',
      'Männer begrüßen sich im Freundeskreis meist mit einem kräftigen Händedruck und einer herzlichen Umarmung (*abraço*) mit Schulterklopfen.',
    ],
    didYouKnow: 'Im geschäftlichen Erstkontakt reicht man sich förmlich die Hand – die Wangenküsse etablieren sich erst mit wachsender Vertrautheit.',
    keywords: ['beijinho', 'beijinhos', 'cumprimento', 'begrüßung wange', 'dois beijinhos'],
    emoji: '👥',
    audioPronunciation: 'dois beijinhos',
  },
  {
    id: 'obrigado_politeness',
    term: 'Obrigado / Obrigada',
    category: 'Alltag & Höflichkeit',
    portugueseTitle: 'Obrigado ou Obrigada?',
    germanTitle: 'Das grammatikalische Danke-Ritual',
    summary: 'Ein grundlegender Grundsatz im Portugiesischen: Das Wort "Danke" richtet sich immer nach dem Geschlecht der sprechenden Person, niemals nach dem Angesprochenen!',
    details: [
      'Ein Mann oder Junge sagt ausnahmslos "Obrigado" (wörtlich: "[Ich bin Ihnen] verpflichtet").',
      'Eine Frau oder ein Mädchen sagt immer "Obrigada".',
      'Die typische freundliche Antwort lautet "De nada" (Gern geschehen) oder "Ora essa!" (Keine Ursache).',
    ],
    didYouKnow: 'Im Plural können sich Gruppen sogar mit "Obrigados" oder "Obrigadas" bedanken, was man in feierlichen Reden gelegentlich hört.',
    keywords: ['obrigado', 'obrigada', 'danksagung', 'danke'],
    emoji: '🤝',
    audioPronunciation: 'obrigado',
  },
];

/**
 * Checks text or array of words for known cultural terms and returns the best matching cultural fact.
 * Uses punctuation-normalized word boundary matching so Portuguese accents work reliably.
 */
export function findCulturalFact(input: string | string[]): CulturalFact | null {
  const rawText = Array.isArray(input) ? input.join(' ') : input;
  // Normalize punctuation and surrounding spaces for clean word boundary checks
  const text = ' ' + rawText.toLowerCase().replace(/[,.!?;:«»"'()/[\]{}]/g, ' ') + ' ';

  for (const fact of CULTURAL_FACTS) {
    for (const kw of fact.keywords) {
      const normKw = kw.toLowerCase().trim();
      if (!normKw) continue;

      if (normKw.includes(' ')) {
        // Multi-word keyword (e.g. "pastel de nata", "vinho do porto")
        if (text.includes(' ' + normKw + ' ') || text.includes(normKw)) {
          return fact;
        }
      } else {
        // Single-word keyword (e.g. "fado", "bica", "bacalhau")
        if (text.includes(' ' + normKw + ' ')) {
          return fact;
        }
      }
    }
  }
  return null;
}
