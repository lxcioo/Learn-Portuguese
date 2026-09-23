import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronRight,
  BookOpen,
  Coffee,
  Compass,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  IMMERSIVE_SCENARIOS,
  ImmersiveScenario,
  DialogueLine,
  ComprehensionQuestion,
} from '@/src/models/data/immersiveContent';
import { findCulturalFact, CulturalFact } from '@/src/models/data/culturalContent';
import { CulturalCardModal } from './CulturalCardModal';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

interface ImmersiveDialogueModalProps {
  scenario?: ImmersiveScenario;
  onClose: (completed?: boolean) => void;
}

export const ImmersiveDialogueModal: React.FC<ImmersiveDialogueModalProps> = ({
  scenario: initialScenario,
  onClose,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(() => {
    if (initialScenario) {
      const idx = IMMERSIVE_SCENARIOS.findIndex((s) => s.id === initialScenario.id);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const scenario: ImmersiveScenario = IMMERSIVE_SCENARIOS[scenarioIndex] || initialScenario || IMMERSIVE_SCENARIOS[0];

  const [activeSpeakingLineId, setActiveSpeakingLineId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<0.75 | 0.9>(0.9);
  const [translationMode, setTranslationMode] = useState<'hidden' | 'visible'>('visible');
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});

  // Tooltip & Word inspection
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    meaning: string;
    phonetic: string;
    culturalFact?: CulturalFact | null;
  } | null>(null);

  // Cultural Modal State
  const [activeCulturalFact, setActiveCulturalFact] = useState<CulturalFact | null>(null);

  // Question answers
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleSpeakLine = (line: DialogueLine) => {
    SoundEffects.playTap();
    setActiveSpeakingLineId(line.id);
    speakPortuguese(line.pt, speechRate);
    setTimeout(() => {
      setActiveSpeakingLineId(null);
    }, 2800);
  };

  const handleSelectWord = (v: { word: string; meaning: string; phonetic: string }) => {
    SoundEffects.playTap();
    const fact = findCulturalFact(v.word);
    setSelectedWord({
      ...v,
      culturalFact: fact,
    });
    speakPortuguese(v.word, 0.85);
  };

  const handleToggleLineReveal = (lineId: string) => {
    SoundEffects.playTap();
    setRevealedLines((prev) => ({ ...prev, [lineId]: !prev[lineId] }));
  };

  const handleAnswerQuestion = (questionId: string, optionIndex: number, correctIndex: number) => {
    SoundEffects.playTap();
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (optionIndex === correctIndex) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playWrong();
    }
  };

  const allQuestionsAnsweredCorrectly = scenario.questions.every(
    (q) => userAnswers[q.id] === q.correctIndex
  );

  const handleFinish = () => {
    SoundEffects.playLevelComplete();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setHasCompleted(true);
    setTimeout(() => {
      onClose(true);
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2.5 sm:p-4 overflow-y-auto animate-fade-in">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: scenario.accentColor }}
              >
                {scenarioIndex === 0 ? <Coffee className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Kontext-Dialog &amp; Comprehensible Input
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {scenario.difficulty}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {scenario.titlePt}
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

          {/* Scenario Selector Carousel */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-bold text-slate-400 shrink-0">Szenario:</span>
            {IMMERSIVE_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  SoundEffects.playTap();
                  setScenarioIndex(idx);
                  setUserAnswers({});
                  setRevealedLines({});
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  scenarioIndex === idx
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                {sc.titlePt}
              </button>
            ))}
          </div>

          {/* Audio Toolbar */}
          <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Tempo:</span>
              <button
                onClick={() => {
                  SoundEffects.playTap();
                  setSpeechRate((r) => (r === 0.9 ? 0.75 : 0.9));
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  speechRate === 0.75
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {speechRate === 0.75 ? '0.75x (Langsamer)' : '0.9x (Natürlich)'}
              </button>
            </div>

            <button
              onClick={() => {
                SoundEffects.playTap();
                setTranslationMode((m) => (m === 'visible' ? 'hidden' : 'visible'));
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50"
            >
              {translationMode === 'visible' ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Übersetzung an</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nur Portugiesisch</span>
                </>
              )}
            </button>
          </div>

          {/* Dialogue Scroll Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Scenario Overview Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{scenario.titleDe}</p>
                <p className="text-xs opacity-90 mt-0.5">{scenario.summaryDe}</p>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mt-2">
                  💡 Klicke auf die markierten Wörter im Dialog, um Übersetzung und Aussprache zu öffnen!
                </p>
              </div>
            </div>

            {/* Dialogue Lines */}
            <div className="space-y-4">
              {scenario.dialogue.map((line) => {
                const isSpeaking = activeSpeakingLineId === line.id;
                const isUser = line.speaker.includes('Você');
                const isRevealed = translationMode === 'visible' || revealedLines[line.id];

                return (
                  <div
                    key={line.id}
                    className={`flex flex-col gap-1.5 p-4 rounded-2xl transition-all border ${
                      isUser
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 ml-2 sm:ml-4'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 mr-2 sm:mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{line.avatar}</span>
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {line.speaker}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSpeakLine(line)}
                        aria-label="Anhören"
                        className={`p-2 rounded-xl transition-all ${
                          isSpeaking
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Text with Clickable Context Words */}
                    <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed pt-1">
                      {line.vocab && line.vocab.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-slate-800 dark:text-slate-100">{line.pt}</p>
                          <div className="flex flex-wrap gap-1.5 items-center pt-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Schlüsselwörter:
                            </span>
                            {line.vocab.map((v, idx) => {
                              const isCultural = !!findCulturalFact(v.word);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleSelectWord(v)}
                                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                                    isCultural
                                      ? 'bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                                      : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-b-2 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                                  }`}
                                >
                                  {isCultural && <span>✨</span>}
                                  <span>{v.word}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p>{line.pt}</p>
                      )}
                    </div>

                    {/* German Translation */}
                    {isRevealed ? (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-100 dark:border-slate-700/50">
                        {line.de}
                      </p>
                    ) : (
                      <button
                        onClick={() => handleToggleLineReveal(line.id)}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline text-left pt-1"
                      >
                        + Übersetzung antippen
                      </button>
                    )}

                    {line.notes && (
                      <p className="text-xs text-amber-700 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md mt-1">
                        💡 {line.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cultural Insight Card */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Kultureller Kontext
                </span>
                {findCulturalFact(scenario.culturalNote) && (
                  <button
                    onClick={() => setActiveCulturalFact(findCulturalFact(scenario.culturalNote))}
                    className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    Kultur-Karte öffnen →
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {scenario.culturalNote}
              </p>
            </div>

            {/* Context-Aware Exercises Directly from the Story */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  Verständnis- &amp; Übungsphase
                </span>
                <span className="text-xs text-slate-400">Direkt bezogen auf den Dialog oben</span>
              </div>

              {scenario.questions.map((q, qIndex) => {
                const selectedOption = userAnswers[q.id];
                const isAnswered = selectedOption !== undefined;
                const isCorrect = isAnswered && selectedOption === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {qIndex + 1}. {q.questionDe}
                      </h4>
                      {isAnswered && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'Richtig' : 'Falsch'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {q.optionsPt.map((option, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        let optionStyle =
                          'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500';

                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            optionStyle =
                              'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isChosen) {
                            optionStyle =
                              'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerQuestion(q.id, optIdx, q.correctIndex)}
                            className={`w-full p-3 rounded-xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between active:scale-98 ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {isAnswered && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 italic">
                        {q.explanationDe}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word Inspector Modal Popover */}
          {selectedWord && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
              onClick={() => setSelectedWord(null)}
            >
              <div
                className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-emerald-500/30 text-center animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Volume2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedWord.word}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  Aussprache: {selectedWord.phonetic}
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  {selectedWord.meaning}
                </p>

                {selectedWord.culturalFact && (
                  <button
                    onClick={() => {
                      const fact = selectedWord.culturalFact!;
                      setSelectedWord(null);
                      setActiveCulturalFact(fact);
                    }}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{selectedWord.culturalFact.emoji}</span>
                    <span>Kulturellen Hintergrund anzeigen</span>
                  </button>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => speakPortuguese(selectedWord.word, 0.8)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    Anhören
                  </button>
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors"
                  >
                    Verstanden
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {allQuestionsAnsweredCorrectly
                ? '🎉 Szenario erfolgreich gemeistert!'
                : 'Beantworte die Fragen zum Abschließen'}
            </p>

            <button
              onClick={handleFinish}
              disabled={!allQuestionsAnsweredCorrectly || hasCompleted}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                allQuestionsAnsweredCorrectly && !hasCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Abschließen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cultural Fact Modal */}
      {activeCulturalFact && (
        <CulturalCardModal
          fact={activeCulturalFact}
          onClose={() => setActiveCulturalFact(null)}
        />
      )}
    </>
  );
};
