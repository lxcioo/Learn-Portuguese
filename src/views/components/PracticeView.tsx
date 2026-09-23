import React, { useState, useEffect } from 'react';
import {
  Brain,
  Dumbbell,
  AlertCircle,
  Skull,
  Search,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { LeitnerService } from '@/src/models/services/LeitnerService';
import { Exercise } from '@/src/models/types';
import content, { loadUnit } from '@/src/models/data/content';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

const BOX_COLORS = ['', '#f43f5e', '#f59e0b', '#0284c7', '#10b981'];
const BOX_LABELS = ['', 'Schwer', 'Mittel', 'Leicht', '⭐ Gelernt'];

interface PracticeViewProps {
  onStartPractice: (exercises: Exercise[], title: string) => void;
  onOpenBoxModal: (boxIndex: number, label: string) => void;
  showAlert: (title: string, msg: string) => void;
  onOpenFlashcards?: (exercises: Exercise[]) => void;
  onOpenSentenceLab?: () => void;
  onOpenEarTraining?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  onStartPractice,
  onOpenBoxModal,
  showAlert,
  onOpenFlashcards,
  onOpenSentenceLab,
  onOpenEarTraining,
}) => {
  const [leitnerCounts, setLeitnerCounts] = useState([0, 0, 0, 0, 0]);
  const [dueCount, setDueCount] = useState(0);
  const [todayMistakeCount, setTodayMistakeCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'practice' | 'dictionary'>('practice');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');

  const course = content.courses[0];

  const loadData = async () => {
    const stats = await LeitnerService.getLeitnerStats();
    setLeitnerCounts(stats);
    const due = await LeitnerService.getLeitnerDue();
    setDueCount(due.length);
    const mistakes = await LeitnerService.getTodayMistakes();
    setTodayMistakeCount(mistakes.length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const maxCount = Math.max(...leitnerCounts.slice(1), 10);

  // Quick Action Handlers
  const handleDailyWorkout = async () => {
    SoundEffects.playTap();
    const due = await LeitnerService.getLeitnerDue();
    if (due.length === 0) {
      showAlert('Alles erledigt! 🎉', 'Du hast für heute keine fälligen Wiederholungen.');
      return;
    }
    await LeitnerService.savePracticeSession(due);
    onStartPractice(due, 'Tägliches Workout (Spaced Repetition)');
  };

  const handleTodayMistakes = async () => {
    SoundEffects.playTap();
    const mistakes = await LeitnerService.getTodayMistakes();
    if (mistakes.length === 0) {
      showAlert('Klasse!', 'Keine ungelösten Fehler von heute.');
      return;
    }
    await LeitnerService.savePracticeSession(mistakes);
    onStartPractice(mistakes, 'Heutige Fehler');
  };

  const handleArchEnemies = async () => {
    SoundEffects.playTap();
    const enemies = await LeitnerService.getArchEnemies();
    if (enemies.length === 0) {
      showAlert('Keine Daten', 'Du hast noch keine schwierigen Wörter ("Erzfeinde") gesammelt.');
      return;
    }
    await LeitnerService.savePracticeSession(enemies);
    onStartPractice(enemies, 'Erzfeinde Training');
  };

  // Dynamically load vocabulary for the dictionary
  const [allVocabWords, setAllVocabWords] = useState<{
    text: string;
    translation: string;
    unitTitle: string;
    unitId: string;
    levelTitle: string;
  }[]>([]);
  const [isDictLoading, setIsDictLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'dictionary') return;
    let isCancelled = false;

    async function loadDictionaryVocab() {
      setIsDictLoading(true);
      const list: typeof allVocabWords = [];
      const seen = new Set<string>();

      const targetUnits = selectedUnitFilter === 'all'
        ? course.units.slice(0, 6)
        : course.units.filter((u) => u.id === selectedUnitFilter);

      for (const u of targetUnits) {
        const fullUnit = await loadUnit(u.id);
        if (!fullUnit || isCancelled) continue;

        fullUnit.levels.forEach((lvl) => {
          lvl.exercises.forEach((ex) => {
            ex.vocabulary?.forEach((v) => {
              const key = v.text.toLowerCase();
              if (!seen.has(key)) {
                seen.add(key);
                list.push({
                  text: v.text,
                  translation: v.translation,
                  unitTitle: fullUnit.title,
                  unitId: fullUnit.id,
                  levelTitle: lvl.title,
                });
              }
            });
          });
        });
      }

      if (!isCancelled) {
        setAllVocabWords(list.sort((a, b) => a.text.localeCompare(b.text)));
        setIsDictLoading(false);
      }
    }

    loadDictionaryVocab();
    return () => {
      isCancelled = true;
    };
  }, [activeTab, selectedUnitFilter, course.units]);

  // Filtered dictionary
  const filteredVocab = React.useMemo(() => {
    return allVocabWords.filter((item) => {
      const matchQuery =
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchUnit = selectedUnitFilter === 'all' || item.unitId === selectedUnitFilter;
      return matchQuery && matchUnit;
    });
  }, [allVocabWords, searchQuery, selectedUnitFilter]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28">
      {/* Tab Switcher: Üben vs Wörterbuch */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            SoundEffects.playTap();
            setActiveTab('practice');
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'practice'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Übungsbereich
        </button>
        <button
          onClick={() => {
            SoundEffects.playTap();
            setActiveTab('dictionary');
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'dictionary'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Wörterbuch ({allVocabWords.length})
        </button>
      </div>

      {activeTab === 'practice' ? (
        <div className="space-y-6">
          {/* Leitner Long-Term Memory Box Chart */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Dein Langzeit-Gedächtnis
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Tippe auf eine Box</span>
            </div>

            <div className="flex items-end justify-between gap-3 h-36 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {[1, 2, 3, 4].map((box) => {
                const count = leitnerCounts[box] || 0;
                const heightPercent = Math.max((count / maxCount) * 100, 12);

                return (
                  <button
                    key={box}
                    onClick={() => {
                      SoundEffects.playTap();
                      onOpenBoxModal(box, BOX_LABELS[box]);
                    }}
                    className="flex-1 flex flex-col items-center group active:scale-95 transition-transform"
                  >
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {count}
                    </span>
                    <div className="w-full flex items-end justify-center">
                      <div
                        className="w-8 sm:w-10 rounded-xl transition-all duration-300 shadow-sm"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: BOX_COLORS[box],
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2.5">
                      {BOX_LABELS[box]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              Wörter wandern mit jeder richtigen Wiederholung weiter nach rechts bis zu Box 4 (Dauerhaft verankert).
            </p>
          </section>

          {/* Quick Workouts Section */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Jetzt trainieren
            </h4>

            {/* Interactive Modern Acquisition Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* 3D Flashcards Deck */}
              <button
                onClick={async () => {
                  SoundEffects.playTap();
                  const due = await LeitnerService.getLeitnerDue();
                  let cards = due;
                  if (cards.length === 0) {
                    const u1 = await loadUnit('unit_1');
                    cards = u1?.levels[0]?.exercises || [];
                  }
                  if (onOpenFlashcards) onOpenFlashcards(cards);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all text-left flex items-start justify-between shadow-sm active:scale-98 group"
              >
                <div>
                  <span className="text-xl">🗂️</span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1 group-hover:text-emerald-600 transition-colors">
                    3D-Karteikarten Deck
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Aktives Erinnern mit Swipe-Gesten
                  </p>
                </div>
              </button>

              {/* Sentence Lab */}
              <button
                onClick={() => {
                  SoundEffects.playTap();
                  if (onOpenSentenceLab) onOpenSentenceLab();
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all text-left flex items-start justify-between shadow-sm active:scale-98 group"
              >
                <div>
                  <span className="text-xl">🧩</span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1 group-hover:text-amber-500 transition-colors">
                    Satzbausteine &amp; Muster
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Flüssige Sprachchunks puzzeln
                  </p>
                </div>
              </button>

              {/* Ear-Training & Phonetics */}
              <button
                onClick={() => {
                  SoundEffects.playTap();
                  if (onOpenEarTraining) onOpenEarTraining();
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left flex items-start justify-between shadow-sm active:scale-98 sm:col-span-2 group"
              >
                <div>
                  <span className="text-xl">🎧</span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1 group-hover:text-sky-500 transition-colors">
                    Aussprache &amp; Gehör-Training
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Europäisches Portugiesisch: reduzierte Vokale, Nasallaute und portugiesische Akzente
                  </p>
                </div>
              </button>
            </div>

            {/* Daily Workout (Due) */}
            <button
              onClick={handleDailyWorkout}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-between text-left group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 transition-colors">
                    Tägliches Workout
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Intelligentes Spaced-Repetition-System
                  </p>
                </div>
              </div>
              {dueCount > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  {dueCount} fällig
                </span>
              ) : (
                <CheckCircle2 className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              )}
            </button>

            {/* Today's Mistakes */}
            <button
              onClick={handleTodayMistakes}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all flex items-center justify-between text-left group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-rose-500 transition-colors">
                    Heutige Fehler
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Schwierige Aufgaben vom heutigen Tag
                  </p>
                </div>
              </div>
              {todayMistakeCount > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                  {todayMistakeCount} offen
                </span>
              ) : (
                <CheckCircle2 className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              )}
            </button>

            {/* Arch Enemies */}
            <button
              onClick={handleArchEnemies}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all flex items-center justify-between text-left group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Skull className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-purple-600 transition-colors">
                    Erzfeinde-Training
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Die 20 Vokabeln mit den meisten Fehlern
                  </p>
                </div>
              </div>
            </button>
          </section>
        </div>
      ) : (
        /* Dictionary View */
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Vokabel oder Übersetzung suchen..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
              />
            </div>

            <div className="relative">
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="all">Alle Kapitel</option>
                {course.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dictionary Results Count */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{filteredVocab.length} Einträge gefunden</span>
          </div>

          {/* Vocabulary List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredVocab.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.text}
                    </span>
                    <button
                      onClick={() => speakPortuguese(item.text)}
                      className="p-1 text-slate-400 hover:text-sky-600 transition-colors rounded-lg"
                      title="Anhören"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    {item.translation}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400 block">
                    {item.unitTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
