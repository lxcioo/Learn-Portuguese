import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Puzzle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { loadUnit, UNIT_MANIFEST } from '@/src/models/data/content';
import { Unit } from '@/src/models/types';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

interface GrammarModalProps {
  unitId: string | null;
  onClose: () => void;
}

type TabType = 'textbook' | 'blocks' | 'cheatsheet';

interface BuildingBlockTask {
  id: string;
  title: string;
  contextDe: string;
  subjectPronoun: string;
  stem: string;
  endingOptions: string[];
  correctEnding: string;
  meaningDe: string;
  ruleExplanation: string;
}

const SAMPLE_BUILDING_TASKS: BuildingBlockTask[] = [
  {
    id: 'bb_1',
    title: 'Regelmäßiges -AR Verb',
    contextDe: 'Setze die richtige Endung für "Eu" (ich) beim Verb "falar" (sprechen) ein:',
    subjectPronoun: 'Eu',
    stem: 'fal',
    endingOptions: ['-o', '-as', '-a', '-amos', '-am'],
    correctEnding: '-o',
    meaningDe: 'Eu falo = Ich spreche',
    ruleExplanation: 'Die 1. Person Singular ("eu") endet bei regelmäßigen -ar Verben im Präsens immer auf -o.',
  },
  {
    id: 'bb_2',
    title: 'Du-Form bei -AR Verben',
    contextDe: 'Wie sprichst du einen Freund an ("Tu") mit dem Verb "falar"?',
    subjectPronoun: 'Tu',
    stem: 'fal',
    endingOptions: ['-o', '-as', '-a', '-amos', '-am'],
    correctEnding: '-as',
    meaningDe: 'Tu falas = Du sprichst',
    ruleExplanation: 'Die Du-Form ("tu") endet bei -ar Verben auf -as (fal + as = falas).',
  },
  {
    id: 'bb_3',
    title: 'Wir-Form (Nós)',
    contextDe: 'Baue die Form für "Nós" (wir) mit dem Verb "morar" (wohnen):',
    subjectPronoun: 'Nós',
    stem: 'mor',
    endingOptions: ['-o', '-as', '-a', '-amos', '-am'],
    correctEnding: '-amos',
    meaningDe: 'Nós moramos = Wir wohnen',
    ruleExplanation: 'Die Wir-Form ("nós") endet immer auf -amos: mor + amos = moramos.',
  },
  {
    id: 'bb_4',
    title: 'Essen & Trinken (-ER Verb)',
    contextDe: 'Baue die Ich-Form für "comer" (essen):',
    subjectPronoun: 'Eu',
    stem: 'com',
    endingOptions: ['-o', '-es', '-e', '-emos', '-em'],
    correctEnding: '-o',
    meaningDe: 'Eu como = Ich esse',
    ruleExplanation: 'Auch bei -er Verben endet die Ich-Form auf -o: com + o = como.',
  },
];

interface SerEstarLogicTask {
  id: string;
  scenarioDe: string;
  contextPt: string;
  options: { verb: string; isCorrect: boolean; explanation: string }[];
}

const SER_ESTAR_TASKS: SerEstarLogicTask[] = [
  {
    id: 'se_1',
    scenarioDe: 'Herkunft & Identität: "O João ist aus Lissabon."',
    contextPt: 'O João ___ de Lisboa.',
    options: [
      { verb: 'é (ser)', isCorrect: true, explanation: 'Richtig! Die Herkunft ist eine feste, unveränderliche Eigenschaft -> SER.' },
      { verb: 'está (estar)', isCorrect: false, explanation: 'Falsch: estar beschreibt nur temporäre Aufenthaltsorte ("O João está em Lisboa"), nicht Herkunft mit "de".' },
    ],
  },
  {
    id: 'se_2',
    scenarioDe: 'Momentaner Zustand: "Der Kaffee ist sehr heiß."',
    contextPt: 'O café ___ muito quente.',
    options: [
      { verb: 'está (estar)', isCorrect: true, explanation: 'Richtig! Der Kaffee kühlt ab – Temperatur ist ein veränderlicher Zustand -> ESTAR.' },
      { verb: 'é (ser)', isCorrect: false, explanation: 'Falsch: "é" würde bedeuten, Kaffee sei von seiner fundamentalen Natur her ewig heiß.' },
    ],
  },
  {
    id: 'se_3',
    scenarioDe: 'Gefühl & Emotion: "Ich bin heute sehr glücklich."',
    contextPt: 'Hoje eu ___ muito feliz.',
    options: [
      { verb: 'estou (estar)', isCorrect: true, explanation: 'Richtig! Gefühle und Stimmungen schwanken im Tagesverlauf -> ESTAR.' },
      { verb: 'sou (ser)', isCorrect: false, explanation: 'Falsch: "Eu sou feliz" hieße "Ich bin ein grundsätzlich glücklicher Mensch". Für das heutige Gefühl nutzt man "estou".' },
    ],
  },
];

export const GrammarModal: React.FC<GrammarModalProps> = ({ unitId, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('textbook');
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

  // Building Blocks state
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [blockStatus, setBlockStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Ser vs Estar state
  const [currentLogicIndex, setCurrentLogicIndex] = useState(0);
  const [selectedLogicOption, setSelectedLogicOption] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchUnit() {
      if (!unitId) return;
      setLoading(true);
      const data = await loadUnit(unitId);
      if (isMounted) {
        setUnit(data);
        setLoading(false);
      }
    }
    fetchUnit();
    return () => {
      isMounted = false;
    };
  }, [unitId]);

  const activeBlock = SAMPLE_BUILDING_TASKS[currentBlockIndex];
  const activeLogic = SER_ESTAR_TASKS[currentLogicIndex];

  const handleSelectEnding = (ending: string) => {
    SoundEffects.playTap();
    setSelectedEnding(ending);
    if (ending === activeBlock.correctEnding) {
      SoundEffects.playCorrect();
      setBlockStatus('correct');
      speakPortuguese(`${activeBlock.subjectPronoun} ${activeBlock.stem}${ending.replace('-', '')}`);
    } else {
      SoundEffects.playWrong();
      setBlockStatus('wrong');
    }
  };

  const handleSelectLogic = (optIdx: number) => {
    SoundEffects.playTap();
    setSelectedLogicOption(optIdx);
    const opt = activeLogic.options[optIdx];
    if (opt.isCorrect) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playWrong();
    }
  };

  const meta = UNIT_MANIFEST.find(u => u.id === unitId) || {
    title: unit?.title || 'Kapitel-Grammatik',
    color: unit?.color || '#58cc02',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Textbook Header */}
        <div
          className="p-5 text-white flex items-center justify-between flex-shrink-0 relative overflow-hidden"
          style={{ backgroundColor: meta.color }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white/80">
                Interaktives Lehrbuch &amp; Grammatiklogik
              </span>
              <h3 className="font-black text-xl leading-tight drop-shadow-sm">{meta.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              SoundEffects.playTap();
              setActiveTab('textbook');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'textbook'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Textbuch &amp; System</span>
          </button>

          <button
            onClick={() => {
              SoundEffects.playTap();
              setActiveTab('blocks');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'blocks'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>2. Baustein-Labor</span>
          </button>

          <button
            onClick={() => {
              SoundEffects.playTap();
              setActiveTab('cheatsheet');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'cheatsheet'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Spickzettel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'textbook' && (
            <div className="space-y-6">
              {/* Visual System Principle Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-purple-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Das visuelle Baukasten-Prinzip:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Portugiesische Verben bestehen aus zwei klaren Teilen: dem{' '}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    Wortstamm (grün)
                  </span>
                  , der die Bedeutung trägt, und der{' '}
                  <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
                    Personalendung (lila)
                  </span>
                  , die anzeigt, wer die Handlung ausführt.
                </p>
              </div>

              {/* Conjugation Visualizer Table */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Musterverb: falar (sprechen)</span>
                  </h4>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    Regelmäßige -AR Verben
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { pr: 'Eu', stem: 'fal', end: 'o', trans: 'ich spreche' },
                    { pr: 'Tu', stem: 'fal', end: 'as', trans: 'du sprichst' },
                    { pr: 'Ele / Ela / Você', stem: 'fal', end: 'a', trans: 'er/sie spricht' },
                    { pr: 'Nós', stem: 'fal', end: 'amos', trans: 'wir sprechen' },
                    { pr: 'Eles / Elas / Vocês', stem: 'fal', end: 'am', trans: 'sie sprechen' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-12 sm:w-14 shrink-0">
                          {row.pr}
                        </span>
                        <div className="inline-flex items-center font-mono text-sm font-black">
                          <span className="px-1.5 py-0.5 rounded-l-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-r border-emerald-300 dark:border-emerald-700">
                            {row.stem}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-r-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                            {row.end}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                          {row.trans}
                        </span>
                        <button
                          onClick={() => speakPortuguese(`${row.pr} ${row.stem}${row.end}`)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                          title="Anhören"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ser vs Estar Logic Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Logik-System: Ser vs. Estar („sein“)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                    <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-1">
                      🔹 SER = Wesensart &amp; Identität
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      Für dauerhafte Tatsachen: Name, Herkunft, Beruf, Nationalität und Uhrzeiten.
                    </p>
                    <p className="font-mono text-xs font-bold text-blue-900 dark:text-blue-200 mt-2">
                      Eu sou português. (Identität)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                    <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                      🔸 ESTAR = Zustand &amp; Ort
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      Für momentane Stimmungen, veränderliche Zustände und Aufenthaltsorte.
                    </p>
                    <p className="font-mono text-xs font-bold text-amber-900 dark:text-amber-200 mt-2">
                      Eu estou cansado / em Lisboa. (Zustand)
                    </p>
                  </div>
                </div>
              </div>

              {/* Unit Specific Notes if Available */}
              {unit?.grammarGuide && unit.grammarGuide.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                    Kapitel-Leitfaden
                  </h4>
                  {unit.grammarGuide.map((g, gIdx) => (
                    <div
                      key={gIdx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {g.heading}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {g.explanation}
                      </p>
                      {g.examples && g.examples.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                          {g.examples.map((ex, eIdx) => (
                            <div
                              key={eIdx}
                              className="text-xs flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                            >
                              <span className="font-medium text-slate-800 dark:text-slate-200">{ex}</span>
                              <button
                                onClick={() => speakPortuguese(ex.split('-')[0].trim())}
                                className="p-1 text-emerald-600 hover:text-emerald-700"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="space-y-6">
              {/* Untimed Baustein-Labor */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Aufgabe {currentBlockIndex + 1} von {SAMPLE_BUILDING_TASKS.length}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Ohne Zeitdruck</span>
                  </div>
                  <button
                    onClick={() => {
                      SoundEffects.playTap();
                      setSelectedEnding(null);
                      setBlockStatus('idle');
                    }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Zurücksetzen</span>
                  </button>
                </div>

                <div className="text-center py-2 space-y-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {activeBlock.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {activeBlock.contextDe}
                  </p>
                </div>

                {/* Construction Assembly Workspace */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-purple-300 dark:border-purple-800/60 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-mono font-black">
                    <span className="text-slate-600 dark:text-slate-300">{activeBlock.subjectPronoun}</span>
                    <div className="flex items-center">
                      <span className="px-3 py-1.5 rounded-l-xl bg-emerald-500 text-white shadow-xs">
                        {activeBlock.stem}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-r-xl border-l-2 border-emerald-600 transition-all ${
                          selectedEnding
                            ? blockStatus === 'correct'
                              ? 'bg-purple-600 text-white'
                              : 'bg-rose-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {selectedEnding ? selectedEnding.replace('-', '') : '?'}
                      </span>
                    </div>
                  </div>

                  {blockStatus === 'correct' && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{activeBlock.meaningDe}</span>
                    </div>
                  )}
                </div>

                {/* Available Endings to Click */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Wähle die passende Endung:
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {activeBlock.endingOptions.map((ending) => {
                      const isSelected = selectedEnding === ending;
                      return (
                        <button
                          key={ending}
                          onClick={() => handleSelectEnding(ending)}
                          className={`py-3 rounded-xl font-mono font-black text-sm sm:text-base border-2 transition-all active:scale-95 ${
                            isSelected
                              ? blockStatus === 'correct'
                                ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                                : 'bg-rose-500 border-rose-500 text-white'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                          }`}
                        >
                          {ending}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Box */}
                {blockStatus !== 'idle' && (
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm ${
                      blockStatus === 'correct'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    <p className="font-bold mb-0.5">
                      {blockStatus === 'correct' ? '🎉 Ausgezeichnet!' : '❌ Probiere es nochmal'}
                    </p>
                    <p className="opacity-90">{activeBlock.ruleExplanation}</p>
                  </div>
                )}

                {/* Next Task Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      SoundEffects.playTap();
                      setCurrentBlockIndex((prev) => (prev + 1) % SAMPLE_BUILDING_TASKS.length);
                      setSelectedEnding(null);
                      setBlockStatus('idle');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Nächster Baustein</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Untimed Ser vs Estar Logic Decider */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Logik-Training: Ser oder Estar?
                  </span>
                  <span className="text-xs text-slate-400">
                    {currentLogicIndex + 1} von {SER_ESTAR_TASKS.length}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {activeLogic.scenarioDe}
                  </h4>
                  <p className="text-base sm:text-lg font-mono font-bold text-slate-800 dark:text-slate-200 mt-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    {activeLogic.contextPt}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeLogic.options.map((opt, idx) => {
                    const isSelected = selectedLogicOption === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectLogic(idx)}
                        className={`p-3.5 rounded-xl border-2 text-left font-bold text-sm transition-all active:scale-95 ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'bg-rose-500 border-rose-500 text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {opt.verb}
                      </button>
                    );
                  })}
                </div>

                {selectedLogicOption !== null && (
                  <div
                    className={`p-3.5 rounded-xl text-xs sm:text-sm ${
                      activeLogic.options[selectedLogicOption].isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {activeLogic.options[selectedLogicOption].explanation}
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      SoundEffects.playTap();
                      setCurrentLogicIndex((prev) => (prev + 1) % SER_ESTAR_TASKS.length);
                      setSelectedLogicOption(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Nächstes Szenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cheatsheet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-amber-100 text-xs sm:text-sm space-y-2">
                <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Wichtige Grundregeln auf einen Blick:
                </span>
                <ul className="space-y-1.5 list-disc pl-4 opacity-95">
                  <li>
                    <strong>Pronomen weglassen:</strong> Im Alltag lässt man „eu“, „tu“, „nós“ oft weg, da die Endung die Person bereits verrät (z.B. „Falo português“ statt „Eu falo...“).
                  </li>
                  <li>
                    <strong>Fragen ohne Umstellung:</strong> Aussagesatz und Fragesatz haben meist die gleiche Wortstellung. Die Frage wird rein durch die Hebung der Stimme am Satzende gebildet („Tu falas português?“).
                  </li>
                  <li>
                    <strong>Verneinung:</strong> Das Wörtchen „não“ steht immer direkt vor dem finiten Verb („Eu <strong>não</strong> falo inglês“).
                  </li>
                  <li>
                    <strong>Höflichkeitsform:</strong> Statt „du“ (tu) verwendet man im formalen Alltag den Vornamen mit Artikel („O senhor“, „A senhora“) oder schlicht die 3. Person Singular ohne Pronomen.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-400">Verstehe die Grammatik als klares System</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
  );
};
