import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Puzzle,
  PenTool,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FLUENCY_CHUNKS, CLOZE_EXERCISES, SentenceChunk, ClozeExercise } from '@/src/models/data/immersiveContent';
import { findCulturalFact, CulturalFact } from '@/src/models/data/culturalContent';
import { CulturalCardModal } from './CulturalCardModal';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

interface SentenceLabModalProps {
  onClose: (completed: boolean) => void;
}

type LabMode = 'puzzle' | 'cloze';

const PORTUGUESE_SPECIAL_CHARS = ['á', 'à', 'ã', 'â', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'];

export const SentenceLabModal: React.FC<SentenceLabModalProps> = ({ onClose }) => {
  const [activeMode, setActiveMode] = useState<LabMode>('puzzle');

  // Sentence Builder Puzzle State
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentChunk: SentenceChunk = FLUENCY_CHUNKS[puzzleIndex];
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [puzzleStatus, setPuzzleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Cloze Exercise State
  const [clozeIndex, setClozeIndex] = useState(0);
  const currentCloze: ClozeExercise = CLOZE_EXERCISES[clozeIndex];
  const [typedInput, setTypedInput] = useState('');
  const [clozeStatus, setClozeStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showOptionsHint, setShowOptionsHint] = useState(false);

  // Cultural Fact Modal State
  const [activeCulturalFact, setActiveCulturalFact] = useState<CulturalFact | null>(null);

  // Reset tokens on puzzle change
  useEffect(() => {
    if (!currentChunk) return;
    const shuffled = [...currentChunk.tokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setPuzzleStatus('idle');
  }, [puzzleIndex, currentChunk]);

  // Reset cloze input on index change
  useEffect(() => {
    setTypedInput('');
    setClozeStatus('idle');
    setShowOptionsHint(false);
  }, [clozeIndex]);

  // Puzzle handlers
  const handleSelectToken = (token: string, index: number) => {
    SoundEffects.playTap();
    setSelectedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((_, i) => i !== index));
    setPuzzleStatus('idle');
  };

  const handleDeselectToken = (token: string, index: number) => {
    SoundEffects.playTap();
    setAvailableTokens((prev) => [...prev, token]);
    setSelectedTokens((prev) => prev.filter((_, i) => i !== index));
    setPuzzleStatus('idle');
  };

  const handleCheckPuzzle = () => {
    const constructed = selectedTokens.join(' ');
    const target = currentChunk.tokens.join(' ');

    if (constructed === target) {
      SoundEffects.playCorrect();
      setPuzzleStatus('correct');
      speakPortuguese(currentChunk.phrasePt, 0.9);
      if (puzzleIndex === FLUENCY_CHUNKS.length - 1) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      SoundEffects.playWrong();
      setPuzzleStatus('wrong');
    }
  };

  const handleResetPuzzle = () => {
    SoundEffects.playTap();
    const shuffled = [...currentChunk.tokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setPuzzleStatus('idle');
  };

  const handleNextPuzzle = () => {
    SoundEffects.playTap();
    if (puzzleIndex < FLUENCY_CHUNKS.length - 1) {
      setPuzzleIndex((i) => i + 1);
    } else {
      SoundEffects.playLevelComplete();
      onClose(true);
    }
  };

  // Cloze handlers
  const handleInsertChar = (ch: string) => {
    SoundEffects.playTap();
    setTypedInput((prev) => prev + ch);
  };

  const handleCheckCloze = (overrideText?: string) => {
    const textToCheck = (overrideText !== undefined ? overrideText : typedInput).trim().toLowerCase();
    const expected = currentCloze.gapTarget.trim().toLowerCase();

    if (textToCheck === expected) {
      SoundEffects.playCorrect();
      setClozeStatus('correct');
      speakPortuguese(currentCloze.fullSentencePt, 0.9);
      if (clozeIndex === CLOZE_EXERCISES.length - 1) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      SoundEffects.playWrong();
      setClozeStatus('wrong');
    }
  };

  const handleNextCloze = () => {
    SoundEffects.playTap();
    if (clozeIndex < CLOZE_EXERCISES.length - 1) {
      setClozeIndex((i) => i + 1);
    } else {
      SoundEffects.playLevelComplete();
      onClose(true);
    }
  };

  // Cultural Fact Detection
  const puzzleCulture = findCulturalFact(currentChunk?.phrasePt || '');
  const clozeCulture = findCulturalFact(currentCloze?.fullSentencePt || '');
  const currentCulturalMatch = activeMode === 'puzzle' ? puzzleCulture : clozeCulture;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                  Aktive Sprachproduktion
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {activeMode === 'puzzle'
                    ? `Satzbau-Puzzle (${puzzleIndex + 1} / ${FLUENCY_CHUNKS.length})`
                    : `Lückentext-Training (${clozeIndex + 1} / ${CLOZE_EXERCISES.length})`}
                </h2>
              </div>
            </div>

            <button
              onClick={() => onClose(false)}
              aria-label="Schließen"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold">
            <button
              onClick={() => {
                SoundEffects.playTap();
                setActiveMode('puzzle');
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeMode === 'puzzle'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>Satzbau-Puzzle</span>
            </button>

            <button
              onClick={() => {
                SoundEffects.playTap();
                setActiveMode('cloze');
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeMode === 'cloze'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Lückentexte (Cloze)</span>
            </button>
          </div>

          {/* Cultural Context Badge if detected */}
          {currentCulturalMatch && (
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <span>{currentCulturalMatch.emoji}</span>
                <span>Kultur-Begriff erkannt: <strong>{currentCulturalMatch.term}</strong></span>
              </span>
              <button
                onClick={() => setActiveCulturalFact(currentCulturalMatch)}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-xs"
              >
                Hintergrund lesen
              </button>
            </div>
          )}

          {/* Body Content */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[65vh]">
            {activeMode === 'puzzle' ? (
              /* PUZZLE MODE */
              <div className="space-y-6">
                {/* Target German Meaning */}
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Bringe die Satzbausteine in die richtige Reihenfolge:
                  </span>
                  <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    „{currentChunk.phraseDe}“
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    💡 Kontext: {currentChunk.contextUsage}
                  </p>
                </div>

                {/* Sentence Construction Drop Area */}
                <div className="min-h-[90px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center gap-2 transition-all">
                  {selectedTokens.length === 0 ? (
                    <span className="text-sm text-slate-400 select-none mx-auto py-2">
                      Tippe auf die Bausteine unten, um den Satz zu bauen...
                    </span>
                  ) : (
                    selectedTokens.map((token, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDeselectToken(token, idx)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all transform active:scale-95 animate-scale-in"
                      >
                        {token}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Source Tokens */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Verfügbare Bausteine:
                    </span>
                    <button
                      onClick={handleResetPuzzle}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Mischen</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5 min-h-[48px]">
                    {availableTokens.map((token, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectToken(token, idx)}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-xs transition-all active:scale-95"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Feedback */}
                {puzzleStatus === 'correct' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1 animate-fade-in">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Hervorragend gebaut!</span>
                    </div>
                    <p className="text-xs opacity-90">Aussprache: [{currentChunk.phoneticPt}]</p>
                  </div>
                )}

                {puzzleStatus === 'wrong' && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs sm:text-sm animate-fade-in">
                    <p className="font-bold">Noch nicht ganz richtig.</p>
                    <p className="opacity-90">Überprüfe die Reihenfolge der Wörter und versuche es erneut.</p>
                  </div>
                )}
              </div>
            ) : (
              /* CLOZE (LÜCKENTEXT) MODE */
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
                    {currentCloze.contextTitleDe}
                  </span>
                  <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    „{currentCloze.sentenceDe}“
                  </p>
                </div>

                {/* Cloze Sentence Box */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="text-base sm:text-lg font-mono font-bold text-slate-800 dark:text-slate-100 leading-relaxed text-center">
                    <span>{currentCloze.beforeGap}</span>
                    <span className="inline-block px-3 py-1 mx-1.5 rounded-lg border-2 border-dashed border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      {typedInput ? typedInput : '______'}
                    </span>
                    <span>{currentCloze.afterGap}</span>
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    💡 Gesuchtes Verb/Form: <strong>[{currentCloze.infinitiveCue}]</strong>
                  </p>
                </div>

                {/* Input with Accent Toolbar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <span>Tippe die richtige Form ein:</span>
                    <button
                      onClick={() => setShowOptionsHint((h) => !h)}
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold lowercase"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showOptionsHint ? 'Optionen ausblenden' : 'Auswahl anzeigen'}</span>
                    </button>
                  </div>

                  {/* Special Portuguese Accent Helper Row */}
                  <div className="flex items-center justify-center gap-1.5 py-1 flex-wrap">
                    {PORTUGUESE_SPECIAL_CHARS.map((char) => (
                      <button
                        key={char}
                        onClick={() => handleInsertChar(char)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-purple-500 hover:text-white font-mono font-bold text-xs sm:text-sm transition-colors active:scale-95"
                      >
                        {char}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={typedInput}
                      onChange={(e) => {
                        setTypedInput(e.target.value);
                        setClozeStatus('idle');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && typedInput.trim()) {
                          handleCheckCloze();
                        }
                      }}
                      placeholder={`Form für „${currentCloze.infinitiveCue}“...`}
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:outline-hidden focus:border-purple-500 transition-all text-center"
                    />
                  </div>

                  {/* Multiple Choice Hint if Toggled */}
                  {showOptionsHint && (
                    <div className="pt-2 space-y-1.5 animate-fade-in">
                      <span className="text-[11px] font-bold text-slate-400">Schnellauswahl:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {currentCloze.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setTypedInput(opt);
                              handleCheckCloze(opt);
                            }}
                            className="py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm border border-purple-200 dark:border-purple-800/40 transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Feedback Box */}
                {clozeStatus === 'correct' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1 animate-fade-in">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Richtig konjugiert!</span>
                    </div>
                    <p className="text-xs opacity-90">{currentCloze.grammaticalExplanation}</p>
                  </div>
                )}

                {clozeStatus === 'wrong' && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs sm:text-sm animate-fade-in">
                    <p className="font-bold">Leider nicht die gesuchte Form.</p>
                    <p className="opacity-90">Achte auf die Person und Zeitform. Tipp: Nutze die Schnellauswahl oben.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
            <button
              onClick={() => {
                SoundEffects.playTap();
                if (activeMode === 'puzzle') {
                  speakPortuguese(currentChunk.phrasePt, 0.9);
                } else {
                  speakPortuguese(currentCloze.fullSentencePt, 0.9);
                }
              }}
              className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
              title="Aussprache anhören"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {activeMode === 'puzzle' ? (
              puzzleStatus === 'correct' ? (
                <button
                  onClick={handleNextPuzzle}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>{puzzleIndex === FLUENCY_CHUNKS.length - 1 ? 'Abschließen' : 'Nächster Satz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCheckPuzzle}
                  disabled={selectedTokens.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-all"
                >
                  Prüfen
                </button>
              )
            ) : clozeStatus === 'correct' ? (
              <button
                onClick={handleNextCloze}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span>{clozeIndex === CLOZE_EXERCISES.length - 1 ? 'Abschließen' : 'Nächste Lücke'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleCheckCloze()}
                disabled={!typedInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-all"
              >
                Lücke prüfen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cultural Info Card Modal */}
      {activeCulturalFact && (
        <CulturalCardModal
          fact={activeCulturalFact}
          onClose={() => setActiveCulturalFact(null)}
        />
      )}
    </>
  );
};
