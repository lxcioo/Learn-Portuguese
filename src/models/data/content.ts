import { Course, Unit, Level, Exercise } from '@/src/models/types';

// Lightweight metadata for all 20 units so the initial bundle stays minimal
export interface UnitMetadata {
  id: string;
  file: string;
  title: string;
  color: string;
  levels: { id: string; title: string }[];
}

export const UNIT_MANIFEST: UnitMetadata[] = [
  {
    file: 'unit_01_erste_schritte.json',
    id: 'unit_1',
    title: 'Kapitel 1: Die ersten Schritte',
    color: '#58cc02',
    levels: [
      { id: 'u1_l1', title: 'Begrüßung & Abschied' },
      { id: 'u1_l2', title: 'Sich vorstellen & Herkunft' },
      { id: 'u1_l3', title: 'Zahlen (1-100) & Alter' }
    ]
  },
  {
    file: 'unit_02_erste_konversationen.json',
    id: 'unit_2',
    title: 'Kapitel 2: Erste Konversationen',
    color: '#ce82ff',
    levels: [
      { id: 'u2_l1', title: 'Befinden & Höflichkeit' },
      { id: 'u2_l2', title: 'Wichtige Fragen' },
      { id: 'u2_l3', title: 'Sprachen & Verständigung' }
    ]
  },
  {
    file: 'unit_03_essen_trinken.json',
    id: 'unit_3',
    title: 'Kapitel 3: Essen & Trinken',
    color: '#4b9ce2',
    levels: [
      { id: 'u3_l1', title: 'Frühstück & Im Café' },
      { id: 'u3_l2', title: 'Lebensmittel & Supermarkt' },
      { id: 'u3_l3', title: 'Im Restaurant bestellen & bezahlen' }
    ]
  },
  {
    file: 'unit_04_unterwegs.json',
    id: 'unit_4',
    title: 'Kapitel 4: Unterwegs in der Stadt',
    color: '#ffb347',
    levels: [
      { id: 'u4_l1', title: 'Verkehrsmittel & Tickets' },
      { id: 'u4_l2', title: 'Orte in der Stadt' },
      { id: 'u4_l3', title: 'Wegbeschreibungen' }
    ]
  },
  {
    file: 'unit_05_menschen_familie.json',
    id: 'unit_5',
    title: 'Kapitel 5: Menschen & Familie',
    color: '#ff6b6b',
    levels: [
      { id: 'u5_l1', title: 'Familienmitglieder' },
      { id: 'u5_l2', title: 'Aussehen beschreiben' },
      { id: 'u5_l3', title: 'Charakter & Persönlichkeit' }
    ]
  },
  {
    file: 'unit_06_zeit_tagesablauf.json',
    id: 'unit_6',
    title: 'Kapitel 6: Zeit & Tagesablauf',
    color: '#f39c12',
    levels: [
      { id: 'u6_l1', title: 'Uhrzeiten & Tageszeiten' },
      { id: 'u6_l2', title: 'Wochentage & Zeitangaben' },
      { id: 'u6_l3', title: 'Die tägliche Routine' }
    ]
  },
  {
    file: 'unit_07_freizeit_hobbys.json',
    id: 'unit_7',
    title: 'Kapitel 7: Freizeit & Hobbys',
    color: '#e74c3c',
    levels: [
      { id: 'u7_l1', title: 'Sport & Aktivitäten' },
      { id: 'u7_l2', title: 'Musik, Kino & Bücher' },
      { id: 'u7_l3', title: 'Verabredungen treffen' }
    ]
  },
  {
    file: 'unit_08_zuhause.json',
    id: 'unit_8',
    title: 'Kapitel 8: Mein Zuhause',
    color: '#1abc9c',
    levels: [
      { id: 'u8_l1', title: 'Räume & Möbel' },
      { id: 'u8_l2', title: 'Hausarbeit & Alltagspflichten' },
      { id: 'u8_l3', title: 'Auf der Wohnungssuche' }
    ]
  },
  {
    file: 'unit_09_einkaufen_kleidung.json',
    id: 'unit_9',
    title: 'Kapitel 9: Einkaufen & Kleidung',
    color: '#9b59b6',
    levels: [
      { id: 'u9_l1', title: 'Kleidungsstücke & Accessoires' },
      { id: 'u9_l2', title: 'Farben, Muster & Größen' },
      { id: 'u9_l3', title: 'An der Kasse & Umtausch' }
    ]
  },
  {
    file: 'unit_10_körper_gesundheit.json',
    id: 'unit_10',
    title: 'Kapitel 10: Körper & Gesundheit',
    color: '#e84393',
    levels: [
      { id: 'u10_l1', title: 'Die Körperteile' },
      { id: 'u10_l2', title: 'Symptome & Beim Arzt' },
      { id: 'u10_l3', title: 'In der Apotheke' }
    ]
  },
  {
    file: 'unit_11_arbeit_beruf.json',
    id: 'unit_11',
    title: 'Kapitel 11: Arbeit & Beruf',
    color: '#0984e3',
    levels: [
      { id: 'u11_l1', title: 'Berufe' },
      { id: 'u11_l2', title: 'Im Büro' },
      { id: 'u11_l3', title: 'Bewerbung & Arbeitsalltag' }
    ]
  },
  {
    file: 'unit_12_technologie.json',
    id: 'unit_12',
    title: 'Kapitel 12: Technologie & digitale Welt',
    color: '#00cec9',
    levels: [
      { id: 'u12_l1', title: 'Hardware & Geräte' },
      { id: 'u12_l2', title: 'Software & Internet' },
      { id: 'u12_l3', title: 'Kommunikation & Aktionen' }
    ]
  },
  {
    file: 'unit_13_bildung_universitaet.json',
    id: 'unit_13',
    title: 'Kapitel 13: Bildung & Universität',
    color: '#8e44ad',
    levels: [
      { id: 'u13_l1', title: 'Schule & Universität' },
      { id: 'u13_l2', title: 'Prüfungen & Materialien' },
      { id: 'u13_l3', title: 'Studienalltag' }
    ]
  },
  {
    file: 'unit_14_natur_wetter.json',
    id: 'unit_14',
    title: 'Kapitel 14: Natur, Wetter & Umwelt',
    color: '#27ae60',
    levels: [
      { id: 'u14_l1', title: 'Das Wetter' },
      { id: 'u14_l2', title: 'Natur & Landschaft' },
      { id: 'u14_l3', title: 'Tiere & Umwelt' }
    ]
  },
  {
    file: 'unit_15_kultur_traditionen.json',
    id: 'unit_15',
    title: 'Kapitel 15: Kultur & Traditionen',
    color: '#c0392b',
    levels: [
      { id: 'u15_l1', title: 'Feste & Feiertage' },
      { id: 'u15_l2', title: 'Musik & Erbe' },
      { id: 'u15_l3', title: 'Lebensart & Typisch Portugiesisch' }
    ]
  },
  {
    file: 'unit_16_banken_finanzen.json',
    id: 'unit_16',
    title: 'Kapitel 16: Banken & Finanzen',
    color: '#34495e',
    levels: [
      { id: 'u16_l1', title: 'Geld & Konto' },
      { id: 'u16_l2', title: 'Steuern & Dokumente' },
      { id: 'u16_l3', title: 'Alltag an der Kasse & Bank' }
    ]
  },
  {
    file: 'unit_17_gefuehle_meinungen.json',
    id: 'unit_17',
    title: 'Kapitel 17: Gefühle & Meinungen',
    color: '#e67e22',
    levels: [
      { id: 'u17_l1', title: 'Emotionen & Gefühle' },
      { id: 'u17_l2', title: 'Meinungen äußern' },
      { id: 'u17_l3', title: 'Hoffnungen & Der Conjuntivo' }
    ]
  },
  {
    file: 'unit_18_medien_nachrichten.json',
    id: 'unit_18',
    title: 'Kapitel 18: Medien & Nachrichten',
    color: '#3498db',
    levels: [
      { id: 'u18_l1', title: 'Fernsehen & Radio' },
      { id: 'u18_l2', title: 'Presse & Online-Medien' },
      { id: 'u18_l3', title: 'Politik & Weltgeschehen' }
    ]
  },
  {
    file: 'unit_19_fortgeschrittenes_reisen.json',
    id: 'unit_19',
    title: 'Kapitel 19: Fortgeschrittenes Reisen',
    color: '#16a085',
    levels: [
      { id: 'u19_l1', title: 'Am Flughafen & Flugreise' },
      { id: 'u19_l2', title: 'Autovermietung & Verkehr' },
      { id: 'u19_l3', title: 'Hotelprobleme & Beschwerden' }
    ]
  },
  {
    file: 'unit_20_zukunft_traeume.json',
    id: 'unit_20',
    title: 'Kapitel 20: Zukunftspläne & Träume',
    color: '#f1c40f',
    levels: [
      { id: 'u20_l1', title: 'Träume & Ziele' },
      { id: 'u20_l2', title: 'Die Zukunft ausdrücken' },
      { id: 'u20_l3', title: 'Konditional & Fantasie' }
    ]
  }
];

// In-memory cache for loaded units so they are only stored once
const loadedUnitsCache = new Map<string, Unit>();

export interface CourseContent {
  courses: {
    id: string;
    title: string;
    units: Unit[];
  }[];
}

let _isContentLoaded = false;
export function isContentLoaded(): boolean {
  return _isContentLoaded;
}
const contentListeners = new Set<() => void>();
export function onContentLoaded(listener: () => void): () => void {
  contentListeners.add(listener);
  if (_isContentLoaded) {
    listener();
  }
  return () => {
    contentListeners.delete(listener);
  };
}
function notifyContentLoaded() {
  _isContentLoaded = true;
  contentListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}

let fullContentPromise: Promise<CourseContent | null> | null = null;

/**
 * Dynamically fetches compiled lesson JSON data at runtime from public/content.json.
 * This keeps the main Vite JavaScript bundle minimal without bundling any unit JSONs.
 */
export async function fetchContent(): Promise<CourseContent | null> {
  if (fullContentPromise) {
    return fullContentPromise;
  }

  fullContentPromise = (async () => {
    try {
      const base = import.meta.env.BASE_URL || '/';
      const prefix = base.endsWith('/') ? base : `${base}/`;
      const res = await fetch(`${prefix}content.json`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${prefix}content.json (HTTP ${res.status})`);
      }
      const data: CourseContent = await res.json();

      if (data?.courses?.[0]?.units) {
        for (const unit of data.courses[0].units) {
          loadedUnitsCache.set(unit.id, unit);
        }
        content.courses[0].units = data.courses[0].units;

        try {
          localStorage.setItem('cached_content_v1', JSON.stringify(data));
        } catch {
          // Quota exceeded or private browsing
        }
        notifyContentLoaded();
        return data;
      }
      return null;
    } catch (err) {
      console.warn('[Content] Error fetching /content.json, checking offline fallback cache', err);
      try {
        const cached = localStorage.getItem('cached_content_v1');
        if (cached) {
          const data: CourseContent = JSON.parse(cached);
          if (data?.courses?.[0]?.units) {
            for (const unit of data.courses[0].units) {
              loadedUnitsCache.set(unit.id, unit);
            }
            content.courses[0].units = data.courses[0].units;
            notifyContentLoaded();
            return data;
          }
        }
      } catch (cacheErr) {
        console.error('[Content] Error reading cached content fallback', cacheErr);
      }
      return null;
    }
  })();

  return fullContentPromise;
}

// Preload content in the background immediately
if (typeof window !== 'undefined') {
  fetchContent();
}

/**
 * Dynamically loads a unit on demand from the runtime content.
 */
export async function loadUnit(unitId: string): Promise<Unit | null> {
  if (loadedUnitsCache.has(unitId)) {
    return loadedUnitsCache.get(unitId)!;
  }

  await fetchContent();
  return loadedUnitsCache.get(unitId) || null;
}

/**
 * Resolves which unit contains a given level ID and dynamically returns it.
 */
export async function loadLevel(levelId: string): Promise<{ unit: Unit; level: Level; exercises: Exercise[] } | null> {
  const meta = UNIT_MANIFEST.find(u => u.levels.some(l => l.id === levelId));
  if (!meta) return null;

  const unit = await loadUnit(meta.id);
  if (!unit) return null;

  const level = unit.levels.find(l => l.id === levelId);
  if (!level) return null;

  return {
    unit,
    level,
    exercises: level.exercises || [],
  };
}

/**
 * Returns full exercises for an exam (all levels in the unit combined).
 */
export async function loadExamExercises(unitId: string): Promise<{ unit: Unit; exercises: Exercise[] } | null> {
  const unit = await loadUnit(unitId);
  if (!unit) return null;

  const exercises: Exercise[] = [];
  unit.levels.forEach(lvl => {
    if (lvl.exercises) {
      exercises.push(...lvl.exercises);
    }
  });

  return { unit, exercises };
}

// Course structure configured with the lightweight manifest
const initialCourseUnits: Unit[] = UNIT_MANIFEST.map((meta) => ({
  id: meta.id,
  title: meta.title,
  color: meta.color,
  levels: meta.levels.map((lvl) => ({
    id: lvl.id,
    title: lvl.title,
    exercises: [], // loaded dynamically on demand
  })),
}));

export const content = {
  courses: [
    {
      id: 'portuguese_a1',
      title: 'Portugiesisch A1',
      units: initialCourseUnits,
    },
  ],
} as unknown as { courses: Course[] };

export const ensureContentLoaded = fetchContent;

export default content;
