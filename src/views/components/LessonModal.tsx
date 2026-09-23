import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  HeartCrack,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  Trophy,
  Sparkles,
  Keyboard,
  Layers,
  Lightbulb,
  Gauge,
  RotateCw,
  Headphones,
  Puzzle,
  Shuffle,
  MessageSquare,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Fuse from 'fuse.js';
import { Exercise, MatchingPair } from '@/src/models/types';
import { LeitnerService } from '@/src/models/services/LeitnerService';
import { ProgressService } from '@/src/models/services/ProgressService';
import { StreakService } from '@/src/models/services/StreakService';
import { SoundEffects, speakPortuguese, playExerciseAudio, stopCurrentAudio } from '@/src/utils/audio';
import { getExerciseTip, getLessonTip, LessonTip } from '@/src/models/data/lessonTips';
import { findCulturalFact, CulturalFact } from '@/src/models/data/culturalContent';
import { CulturalCardModal } from './CulturalCardModal';

const ACCENT_LETTERS = ['á', 'à', 'ã', 'â', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'];

interface LessonModalProps {
  lessonId: string;
  lessonType: 'lesson' | 'exam' | 'practice';
  lessonTitle: string;
  exercises: Exercise[];
  onClose: (completed: boolean) => void;
}

const normalizeText = (str: string, removeArticle: boolean = false) => {
  if (!str) return '';
  let lowerStr = str.toLowerCase().trim();

  if (removeArticle) {
    const articles = [
      'o ', 'a ', 'os ', 'as ', 'um ', 'uma ', 'uns ', 'umas ',
      'der ', 'die ', 'das ', 'ein ', 'eine ', 'einen ', 'einem ', 'einer ',
    ];
    for (const article of articles) {
      if (lowerStr.startsWith(article)) {
        lowerStr = lowerStr.substring(article.length).trim();
        break;
      }
    }
  }

  return lowerStr
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    .replace(/\s+/g, '');
};

const COMMON_DISTRACTORS: Record<string, string[]> = {
  de: ['und', 'sehr', 'bitte', 'danke', 'hier', 'dort', 'wir', 'sie', 'gut'],
  pt: ['e', 'muito', 'por favor', 'obrigado', 'aqui', 'lá', 'nós', 'eles', 'bem', 'sim', 'não'],
};

export const LessonModal: React.FC<LessonModalProps> = ({
  lessonId,
  lessonType,
  lessonTitle,
  exercises,
  onClose,
}) => {
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Input states
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Word-Bank / Sentence Scramble Mode
  const [useWordBank, setUseWordBank] = useState(true);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<{ id: string; text: string; used: boolean }[]>([]);

  // Audio speed toggle
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // 3D Card Mode Flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Match Pairs Mode state
  const [shuffledDePairs, setShuffledDePairs] = useState<MatchingPair[]>([]);
  const [selectedPtId, setSelectedPtId] = useState<string | null>(null);
  const [selectedDeId, setSelectedDeId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);

  // Checking and feedback states
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [activeTooltip, setActiveTooltip] = useState<{ word: string; translation: string } | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [activeCulturalFact, setActiveCulturalFact] = useState<CulturalFact | null>(null);
  const lastAutoPlayedExerciseIdRef = useRef<string | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  // Initialize queue
  useEffect(() => {
    let list = [...exercises];
    if (lessonType === 'exam') {
      list.sort(() => Math.random() - 0.5);
      list = list.slice(0, 30);
    }
    setQueue(list);
    setCurrentIndex(0);
  }, [exercises, lessonType]);

  const currentExercise = queue[currentIndex];
  const progressPercent = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

  // Retrieve contextual pedagogical tip directly matching the active exercise
  const lessonTip: LessonTip = useMemo(() => {
    return getExerciseTip(currentExercise, lessonId);
  }, [currentExercise, lessonId]);

  // Detect cultural facts in current exercise vocabulary, question, prompt, or dialogue
  const detectedCulturalFact: CulturalFact | null = useMemo(() => {
    if (!currentExercise) return null;
    const texts = [
      currentExercise.question || '',
      currentExercise.correctAnswer || '',
      currentExercise.prompt || '',
      currentExercise.cardFront || '',
      currentExercise.cardBack || '',
      currentExercise.cardNotes || '',
      currentExercise.dialogueContext || '',
      currentExercise.dialoguePrompt || '',
      ...(currentExercise.options || []),
      ...(currentExercise.vocabulary?.flatMap((v) => [v.text, v.translation || '']) || []),
    ];
    return findCulturalFact(texts);
  }, [currentExercise]);

  // Setup current exercise states
  useEffect(() => {
    if (currentExercise) {
      setUserInput('');
      setSelectedOption(null);
      setSelectedTokens([]);
      setIsAnswerChecked(false);
      setActiveTooltip(null);
      setIsCardFlipped(false);
      setSelectedPtId(null);
      setSelectedDeId(null);
      setMatchedPairIds([]);

      // Initialize Pair Matching
      if (currentExercise.type === 'match_pairs' && currentExercise.matchingPairs) {
        const shuffled = [...currentExercise.matchingPairs].sort(() => Math.random() - 0.5);
        setShuffledDePairs(shuffled);
      }

      // Audio auto-playback (strictly once per exercise)
      const autoPlayTypes = ['card', 'translate_to_de', 'listen', 'listen_choice', 'dialogue'];
      if (
        autoPlayTypes.includes(currentExercise.type) &&
        lastAutoPlayedExerciseIdRef.current !== currentExercise.id
      ) {
        lastAutoPlayedExerciseIdRef.current = currentExercise.id;
        const audioText =
          currentExercise.audioText ||
          (currentExercise.type === 'dialogue'
            ? currentExercise.dialoguePrompt
            : currentExercise.type === 'listen'
            ? currentExercise.correctAnswer
            : currentExercise.question);
        if (audioText) {
          playExerciseAudio(currentExercise.id, audioText, audioSpeed);
        }
      }

      // Word bank preparation
      const rawWords = currentExercise.correctAnswer.split(/\s+/).map((w) => w.trim()).filter(Boolean);
      const isTargetPortuguese =
        currentExercise.type === 'translate_to_pt' ||
        currentExercise.type === 'scramble' ||
        currentExercise.type === 'listen';
      const distractorPool = isTargetPortuguese ? COMMON_DISTRACTORS.pt : COMMON_DISTRACTORS.de;

      const distractors =
        currentExercise.type === 'scramble'
          ? []
          : distractorPool
              .filter((w) => !rawWords.some((rw) => rw.toLowerCase() === w.toLowerCase()))
              .sort(() => Math.random() - 0.5)
              .slice(0, Math.min(2, Math.max(1, 4 - rawWords.length)));

      const allTokens = [...rawWords, ...distractors]
        .sort(() => Math.random() - 0.5)
        .map((text, idx) => ({
          id: `${text}-${idx}-${Date.now()}`,
          text,
          used: false,
        }));

      setAvailableTokens(allTokens);
      setUseWordBank(rawWords.length >= 2 || currentExercise.type === 'listen' || currentExercise.type === 'scramble');
    }
  }, [currentIndex, currentExercise, audioSpeed]);

  // Word token selection handlers
  const handleSelectToken = (token: { id: string; text: string; used: boolean }) => {
    if (isAnswerChecked || token.used) return;
    SoundEffects.playTap();

    setSelectedTokens((prev) => [...prev, token.text]);
    setAvailableTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, used: true } : t))
    );
  };

  const handleDeselectToken = (indexToRemove: number) => {
    if (isAnswerChecked) return;
    SoundEffects.playTap();

    const tokenText = selectedTokens[indexToRemove];
    setSelectedTokens((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    let returned = false;
    setAvailableTokens((prev) =>
      prev.map((t) => {
        if (!returned && t.text === tokenText && t.used) {
          returned = true;
          return { ...t, used: false };
        }
        return t;
      })
    );
  };

  const playQuestionAudio = (slow: boolean = false) => {
    if (!currentExercise) return;
    const textToSpeak =
      currentExercise.audioText ||
      (currentExercise.type === 'listen'
        ? currentExercise.correctAnswer
        : currentExercise.type === 'dialogue'
        ? currentExercise.dialoguePrompt
        : currentExercise.question);
    playExerciseAudio(currentExercise.id, textToSpeak || '', slow ? 0.75 : 1.0);
  };

  // Pair Matching Logic
  const handleMatchPairTap = (side: 'pt' | 'de', pairId: string) => {
    if (isAnswerChecked || matchedPairIds.includes(pairId)) return;
    SoundEffects.playTap();

    if (side === 'pt') {
      setSelectedPtId(pairId);
      if (selectedDeId) {
        checkPairMatch(pairId, selectedDeId);
      }
    } else {
      setSelectedDeId(pairId);
      if (selectedPtId) {
        checkPairMatch(selectedPtId, pairId);
      }
    }
  };

  const checkPairMatch = (ptId: string, deId: string) => {
    if (ptId === deId) {
      SoundEffects.playCorrect();
      const updated = [...matchedPairIds, ptId];
      setMatchedPairIds(updated);
      setSelectedPtId(null);
      setSelectedDeId(null);

      const totalPairs = currentExercise?.matchingPairs?.length || 0;
      if (updated.length >= totalPairs) {
        setIsAnswerChecked(true);
        setIsCorrect(true);
      }
    } else {
      SoundEffects.playWrong();
      setMistakes((prev) => prev + 1);
      setTimeout(() => {
        setSelectedPtId(null);
        setSelectedDeId(null);
      }, 550);
    }
  };

  // Instant evaluation handler for multiple choice, listen choice, and dialogue
  const handleSelectOption = async (idx: number) => {
    if (isAnswerChecked || !currentExercise || !currentExercise.options) return;
    SoundEffects.playTap();
    setSelectedOption(idx);

    const chosen = currentExercise.options[idx];
    const isOptCorrect =
      idx === currentExercise.correctAnswerIndex ||
      chosen.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();

    setIsCorrect(isOptCorrect);
    setIsAnswerChecked(true);

    if (isOptCorrect) {
      SoundEffects.playCorrect();
      if (currentExercise.vocabulary && currentExercise.vocabulary.length > 0) {
        await LeitnerService.recordExerciseResult(currentExercise, true);
      }
    } else {
      SoundEffects.playWrong();
      setMistakes((prev) => prev + 1);
      if (currentExercise.vocabulary && currentExercise.vocabulary.length > 0) {
        await LeitnerService.recordExerciseResult(currentExercise, false);
      }
    }
  };

  // Card Mode Finished
  const handleCardLearned = async () => {
    SoundEffects.playCorrect();
    setIsCorrect(true);
    setIsAnswerChecked(true);
    if (currentExercise?.vocabulary && currentExercise.vocabulary.length > 0) {
      await LeitnerService.recordExerciseResult(currentExercise, true);
    }
    handleNextQuestion();
  };

  // Check Answer Handler
  const handleCheckAnswer = async () => {
    if (!currentExercise || isAnswerChecked) return;

    let correct = false;

    if (currentExercise.type === 'card') {
      correct = true;
    } else if (currentExercise.type === 'match_pairs') {
      correct = true;
    } else if (
      currentExercise.type === 'listen_choice' ||
      currentExercise.type === 'dialogue' ||
      currentExercise.type === 'multiple_choice'
    ) {
      if (selectedOption !== null && currentExercise.options) {
        const chosen = currentExercise.options[selectedOption];
        if (
          selectedOption === currentExercise.correctAnswerIndex ||
          chosen === currentExercise.correctAnswer
        ) {
          correct = true;
        }
      }
    } else if (
      currentExercise.type.includes('translate') ||
      currentExercise.type === 'listen' ||
      currentExercise.type === 'scramble'
    ) {
      const answerGiven = useWordBank ? selectedTokens.join(' ') : userInput;
      const inputNorm = normalizeText(answerGiven);
      const answerNorm = normalizeText(currentExercise.correctAnswer);
      const altAnswers = currentExercise.alternativeAnswers || [];

      // 1. Exact match
      const exactMatches = [answerNorm, ...altAnswers.map((a) => normalizeText(a))];
      if (exactMatches.includes(inputNorm)) {
        correct = true;
      } else {
        // 2. Soft match (without leading articles)
        const inputSoft = normalizeText(answerGiven, true);
        const softMatches = [
          normalizeText(currentExercise.correctAnswer, true),
          ...altAnswers.map((a) => normalizeText(a, true)),
        ];
        if (softMatches.includes(inputSoft)) {
          correct = true;
        } else {
          // 3. Fuzzy match with Fuse
          const validOptions = [currentExercise.correctAnswer, ...altAnswers].map((text) => ({
            text: normalizeText(text),
          }));
          const fuse = new Fuse(validOptions, {
            keys: ['text'],
            includeScore: true,
            threshold: 0.25,
          });
          const results = fuse.search(inputNorm);
          if (results.length > 0 && results[0].score !== undefined && results[0].score <= 0.25) {
            correct = true;
          }
        }
      }
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      SoundEffects.playCorrect();
      if (currentExercise.vocabulary && currentExercise.vocabulary.length > 0) {
        await LeitnerService.recordExerciseResult(currentExercise, true);
      }
    } else {
      SoundEffects.playWrong();
      setMistakes((prev) => prev + 1);
      if (currentExercise.vocabulary && currentExercise.vocabulary.length > 0) {
        await LeitnerService.recordExerciseResult(currentExercise, false);
      }
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      const totalMistakes = mistakes;
      let stars = 3;
      if (totalMistakes > 0 && totalMistakes <= 2) stars = 2;
      else if (totalMistakes > 2) stars = 1;
      setEarnedStars(stars);
      setIsFinished(true);

      SoundEffects.playLevelComplete();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      try {
        await StreakService.updateStreak();
        if (lessonType === 'exam') {
          await ProgressService.markExamPassed(lessonId);
        } else if (lessonType === 'lesson') {
          await ProgressService.saveLessonScore(lessonId, stars);
        }
      } catch (e) {
        console.error('Progress update error:', e);
      }
    }
  };

  const addAccent = (char: string) => {
    setUserInput((prev) => prev + char);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Top Header Bar */}
      <header className="max-w-2xl mx-auto w-full px-4 h-16 flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => onClose(false)}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:white rounded-full transition-colors active:scale-95"
          title="Lektion beenden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Mistakes / Lives count (Broken Hearts) */}
        <div
          className="flex items-center gap-1.5 text-rose-500 font-bold text-sm bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/40 shadow-xs"
          title="Fehler"
        >
          <HeartCrack className="w-4 h-4 text-rose-500" />
          <span>{mistakes}</span>
        </div>
      </header>

      {/* Main Content Area */}
      {!isFinished ? (
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col justify-between overflow-y-auto">
          {currentExercise ? (
            <div className="space-y-6">
              {/* Exercise Mode Badge and Tip Trigger */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {currentExercise.type === 'multiple_choice' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      MULTIPLE CHOICE
                    </span>
                  )}
                  {currentExercise.type === 'card' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      LERNKARTE (3D KARTENMODUS)
                    </span>
                  )}
                  {currentExercise.type === 'listen_choice' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800">
                      <Headphones className="w-3.5 h-3.5 text-sky-500" />
                      HÖRVERSTÄNDNIS
                    </span>
                  )}
                  {currentExercise.type === 'scramble' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300/60 dark:border-purple-800">
                      <Puzzle className="w-3.5 h-3.5 text-purple-500" />
                      SATZBAU-PUZZLE
                    </span>
                  )}
                  {currentExercise.type === 'match_pairs' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                      <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
                      WORTPAARE VERBINDEN
                    </span>
                  )}
                  {currentExercise.type === 'dialogue' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-300/60 dark:border-indigo-800">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      SITUATIONS-DIALOG
                    </span>
                  )}
                  {currentExercise.type.includes('translate') && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      ÜBERSETZEN
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowTip((prev) => !prev)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 active:scale-95 transition-all"
                  title="Grammatik- & Kulturtipp anzeigen"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showTip ? 'Tipp verbergen' : 'Tipp'}</span>
                </button>
              </div>

              {/* Cultural & Grammar Tip Drawer */}
              {showTip && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 animate-fade-in text-xs space-y-1.5">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lessonTip.title}</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-300">{lessonTip.tip}</p>
                  {lessonTip.culturalNote && (
                    <p className="text-amber-700 dark:text-amber-400 italic">
                      💡 {lessonTip.culturalNote}
                    </p>
                  )}
                  {lessonTip.pronunciationTip && (
                    <p className="text-amber-700 dark:text-amber-400 font-mono text-[11px]">
                      🗣️ {lessonTip.pronunciationTip}
                    </p>
                  )}
                </div>
              )}

              {/* Cultural Context Badge if detected in current exercise */}
              {detectedCulturalFact && (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/25 flex items-center justify-between animate-fade-in text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <span>{detectedCulturalFact.emoji}</span>
                    <span>Kultur-Begriff: <strong>{detectedCulturalFact.term}</strong></span>
                  </span>
                  <button
                    onClick={() => setActiveCulturalFact(detectedCulturalFact)}
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-xs"
                  >
                    Hintergrund lesen
                  </button>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 1: 3D CARD MODE (FLASHCARD DISCOVERY) */}
              {/* ========================================================= */}
              {currentExercise.type === 'card' && (
                <div className="space-y-5">
                  <div
                    onClick={() => setIsCardFlipped((prev) => !prev)}
                    className="cursor-pointer min-h-[260px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200/70 dark:border-amber-800/60 shadow-lg flex flex-col items-center justify-between text-center transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden select-none"
                  >
                    <div className="w-full flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                      <span>{isCardFlipped ? 'Deutsche Übersetzung' : 'Europäisches Portugiesisch'}</span>
                      <span className="flex items-center gap-1 opacity-80">
                        <RotateCw className="w-3.5 h-3.5" /> Tippe zum Wenden
                      </span>
                    </div>

                    <div className="my-auto py-4 space-y-3">
                      {!isCardFlipped ? (
                        <>
                          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {currentExercise.cardFront || currentExercise.question}
                          </h2>
                          {currentExercise.pronunciation && (
                            <p className="font-mono text-sm text-slate-400 dark:text-slate-500">
                              🗣️ {currentExercise.pronunciation}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <h2 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                            {currentExercise.cardBack || currentExercise.correctAnswer}
                          </h2>
                          {currentExercise.cardNotes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                              💡 {currentExercise.cardNotes}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="w-full flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playQuestionAudio(false);
                        }}
                        className="p-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-95 transition-all flex items-center gap-2 font-bold text-xs"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Aussprache</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCardFlipped((prev) => !prev);
                        }}
                        className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <RotateCw className="w-4 h-4 text-amber-500" />
                        <span>{isCardFlipped ? 'Zurück' : 'Umdrehen'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Learned Action */}
                  <button
                    onClick={handleCardLearned}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Gelernt & Weiter</span>
                  </button>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 2: CLASSIC MULTIPLE CHOICE */}
              {/* ========================================================= */}
              {currentExercise.type === 'multiple_choice' && (
                <div className="space-y-6">
                  {/* Question Card */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        Wähle die richtige Antwort:
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {currentExercise.question}
                      </h3>
                      {currentExercise.dialogueContext && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                          💡 {currentExercise.dialogueContext}
                        </p>
                      )}
                    </div>

                    {(currentExercise.audioText || currentExercise.correctAnswer) && (
                      <button
                        onClick={() => playQuestionAudio(false)}
                        className="p-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl active:scale-95 transition-all shadow-sm flex-shrink-0"
                        title="Aussprache anhören"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Multiple Choice Options with Instant Feedback */}
                  <div className="space-y-2.5">
                    {currentExercise.options?.map((option, idx) => {
                      const isChosen = selectedOption === idx;
                      const isOptionCorrect =
                        idx === currentExercise.correctAnswerIndex ||
                        option.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();

                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50';

                      if (isAnswerChecked) {
                        if (isOptionCorrect) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                        } else if (isChosen && !isOptionCorrect) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/20';
                        } else {
                          btnStyle =
                            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 opacity-60';
                        }
                      } else if (isChosen) {
                        btnStyle =
                          'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-amber-500/20';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerChecked}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between shadow-xs active:scale-[0.99] ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <span className="font-bold">{option}</span>
                          </div>
                          {isAnswerChecked && isOptionCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {isAnswerChecked && isChosen && !isOptionCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 3: PURE LISTENING WITH CHOICES */}
              {/* ========================================================= */}
              {currentExercise.type === 'listen_choice' && (
                <div className="space-y-6">
                  {/* Audio Listening Player Station */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      Höre aufmerksam zu und wähle die richtige deutsche Bedeutung:
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => playQuestionAudio(false)}
                        className="px-6 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl active:scale-95 transition-all shadow-md flex items-center gap-2 font-bold text-base"
                      >
                        <Volume2 className="w-6 h-6" />
                        <span>Abspielen (Normal)</span>
                      </button>

                      <button
                        onClick={() => {
                          const newSpeed = audioSpeed === 1.0 ? 0.75 : 1.0;
                          setAudioSpeed(newSpeed);
                          playQuestionAudio(newSpeed === 0.75);
                        }}
                        className="p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl active:scale-95 transition-all border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                        title="Geschwindigkeit umschalten"
                      >
                        <Gauge className="w-4 h-4 text-amber-500" />
                        <span>{audioSpeed === 1.0 ? '0.75x' : '1.0x'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2.5">
                    {currentExercise.options?.map((option, idx) => {
                      const isChosen = selectedOption === idx;
                      const isOptionCorrect =
                        idx === currentExercise.correctAnswerIndex ||
                        option.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();

                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50';

                      if (isAnswerChecked) {
                        if (isOptionCorrect) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                        } else if (isChosen && !isOptionCorrect) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/20';
                        } else {
                          btnStyle =
                            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 opacity-60';
                        }
                      } else if (isChosen) {
                        btnStyle =
                          'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-sky-500/20';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerChecked}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between shadow-xs active:scale-[0.99] ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <span>{option}</span>
                          </div>
                          {isAnswerChecked && isOptionCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {isAnswerChecked && isChosen && !isOptionCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 3: SATZBAU-PUZZLE (SENTENCE SCRAMBLE) */}
              {/* ========================================================= */}
              {currentExercise.type === 'scramble' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                      Aufgabe:
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {currentExercise.question}
                    </h3>
                  </div>

                  {/* Assembled Sentence Drop Zone */}
                  <div className="min-h-24 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-purple-300 dark:border-purple-800 flex flex-wrap gap-2 items-center">
                    {selectedTokens.length === 0 ? (
                      <span className="text-sm text-slate-400 font-medium px-2">
                        Tippe auf die Bausteine unten, um den portugiesischen Satz zu formen...
                      </span>
                    ) : (
                      selectedTokens.map((token, idx) => (
                        <button
                          key={idx}
                          disabled={isAnswerChecked}
                          onClick={() => handleDeselectToken(idx)}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-sm hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <span>{token}</span>
                          <span className="text-white/70 text-xs">✕</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Tokens Pool */}
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {availableTokens.map((token) => (
                      <button
                        key={token.id}
                        disabled={token.used || isAnswerChecked}
                        onClick={() => handleSelectToken(token)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          token.used
                            ? 'opacity-20 bg-slate-200 dark:bg-slate-800 text-transparent cursor-not-allowed'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-95 hover:border-purple-400'
                        }`}
                      >
                        {token.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 4: WORTPAARE VERBINDEN (MATCH PAIRS) */}
              {/* ========================================================= */}
              {currentExercise.type === 'match_pairs' && currentExercise.matchingPairs && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center">
                    Tippe auf ein portugiesisches Wort und die passende deutsche Übersetzung:
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Left Column: Portuguese */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-400 uppercase text-center">Portugiesisch</div>
                      {currentExercise.matchingPairs.map((pair) => {
                        const isMatched = matchedPairIds.includes(pair.id);
                        const isSelected = selectedPtId === pair.id;
                        return (
                          <button
                            key={`pt_${pair.id}`}
                            disabled={isMatched || isAnswerChecked}
                            onClick={() => handleMatchPairTap('pt', pair.id)}
                            className={`w-full p-3.5 rounded-2xl border-2 font-bold text-sm text-center transition-all flex items-center justify-center gap-1.5 ${
                              isMatched
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 opacity-60 cursor-default'
                                : isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 scale-[1.02]'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>{pair.pt}</span>
                            {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: German */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-400 uppercase text-center">Deutsch</div>
                      {shuffledDePairs.map((pair) => {
                        const isMatched = matchedPairIds.includes(pair.id);
                        const isSelected = selectedDeId === pair.id;
                        return (
                          <button
                            key={`de_${pair.id}`}
                            disabled={isMatched || isAnswerChecked}
                            onClick={() => handleMatchPairTap('de', pair.id)}
                            className={`w-full p-3.5 rounded-2xl border-2 font-bold text-sm text-center transition-all flex items-center justify-center gap-1.5 ${
                              isMatched
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 opacity-60 cursor-default'
                                : isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 scale-[1.02]'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>{pair.de}</span>
                            {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 5: SITUATIONAL DIALOGUE */}
              {/* ========================================================= */}
              {currentExercise.type === 'dialogue' && (
                <div className="space-y-5">
                  {/* Context Banner */}
                  {currentExercise.dialogueContext && (
                    <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Situation: {currentExercise.dialogueContext}</span>
                    </div>
                  )}

                  {/* Speaker Bubble */}
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                      {currentExercise.dialogueSpeaker ? currentExercise.dialogueSpeaker[0] : 'P'}
                    </div>

                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        {currentExercise.dialogueSpeaker || 'Gesprächspartner'}
                      </span>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        «{currentExercise.dialoguePrompt}»
                      </p>
                    </div>

                    <button
                      onClick={() => playQuestionAudio(false)}
                      className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-95 transition-all flex-shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {currentExercise.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentExercise.options?.map((option, idx) => {
                      const isChosen = selectedOption === idx;
                      const isOptionCorrect =
                        idx === currentExercise.correctAnswerIndex ||
                        option.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();

                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50';

                      if (isAnswerChecked) {
                        if (isOptionCorrect) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                        } else if (isChosen && !isOptionCorrect) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/20';
                        } else {
                          btnStyle =
                            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 opacity-60';
                        }
                      } else if (isChosen) {
                        btnStyle =
                          'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-500/20';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerChecked}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between shadow-xs active:scale-[0.99] ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <span>{option}</span>
                          </div>
                          {isAnswerChecked && isOptionCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {isAnswerChecked && isChosen && !isOptionCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 6: CLASSIC TRANSLATION & DICTATION */}
              {/* ========================================================= */}
              {(currentExercise.type.includes('translate') || currentExercise.type === 'listen') && (
                <div className="space-y-4">
                  {/* Prompt Text with Audio and Vocabulary tooltips */}
                  {currentExercise.type === 'listen' ? (
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => playQuestionAudio(false)}
                          className="p-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl active:scale-95 transition-all shadow-md flex items-center gap-2 font-bold text-sm"
                        >
                          <Volume2 className="w-6 h-6" />
                          <span>Anhören</span>
                        </button>
                        <button
                          onClick={() => playQuestionAudio(true)}
                          className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-semibold"
                        >
                          0.75x
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        Tippe auf den Lautsprecher und stelle das Gehörte zusammen
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3.5 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <button
                        onClick={() => playQuestionAudio(false)}
                        className="p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl active:scale-95 transition-all shadow-sm flex-shrink-0"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>

                      <div className="flex-1 pt-1">
                        <div className="flex flex-wrap gap-1.5 items-center relative">
                          {currentExercise.vocabulary && currentExercise.vocabulary.length > 0 ? (
                            currentExercise.vocabulary.map((vocab, vIdx) => (
                              <button
                                key={vIdx}
                                onClick={() => {
                                  speakPortuguese(vocab.audio || vocab.text);
                                  setActiveTooltip(
                                    activeTooltip?.word === vocab.text
                                      ? null
                                      : { word: vocab.text, translation: vocab.translation }
                                  );
                                }}
                                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white border-b-2 border-dotted border-slate-300 dark:border-slate-600 hover:text-emerald-600 transition-colors relative"
                              >
                                {vocab.text}
                                {activeTooltip?.word === vocab.text && (
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl shadow-xl whitespace-nowrap z-30 animate-fade-in border border-slate-700">
                                    {vocab.translation}
                                  </div>
                                )}
                              </button>
                            ))
                          ) : (
                            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                              {currentExercise.question}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode Toggle: Word-Bank vs Keyboard */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-400 font-medium">Eingabemodus:</span>
                    <button
                      onClick={() => {
                        SoundEffects.playTap();
                        setUseWordBank((prev) => !prev);
                      }}
                      className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline active:scale-95 transition-all"
                    >
                      {useWordBank ? (
                        <>
                          <Keyboard className="w-3.5 h-3.5" />
                          <span>Tastatur verwenden</span>
                        </>
                      ) : (
                        <>
                          <Layers className="w-3.5 h-3.5" />
                          <span>Wortbausteine nutzen</span>
                        </>
                      )}
                    </button>
                  </div>

                  {useWordBank ? (
                    <div className="space-y-4">
                      <div className="min-h-20 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center">
                        {selectedTokens.length === 0 ? (
                          <span className="text-sm text-slate-400 font-medium px-2">
                            Tippe auf die Wörter unten, um die Antwort zu bauen...
                          </span>
                        ) : (
                          selectedTokens.map((token, idx) => (
                            <button
                              key={idx}
                              disabled={isAnswerChecked}
                              onClick={() => handleDeselectToken(idx)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5"
                            >
                              <span>{token}</span>
                              <span className="text-white/60 text-xs">✕</span>
                            </button>
                          ))
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        {availableTokens.map((token) => (
                          <button
                            key={token.id}
                            disabled={token.used || isAnswerChecked}
                            onClick={() => handleSelectToken(token)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                              token.used
                                ? 'opacity-20 bg-slate-200 dark:bg-slate-800 text-transparent cursor-not-allowed'
                                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-95 hover:border-emerald-400'
                            }`}
                          >
                            {token.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        rows={3}
                        value={userInput}
                        disabled={isAnswerChecked}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Deine Antwort hier eingeben..."
                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none shadow-sm transition-colors"
                      />

                      {currentExercise.type === 'translate_to_pt' && !isAnswerChecked && (
                        <div className="flex flex-wrap gap-1.5 justify-center py-1">
                          {ACCENT_LETTERS.map((char) => (
                            <button
                              key={char}
                              onClick={() => addAccent(char)}
                              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200 active:scale-95 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700"
                            >
                              {char}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Lade Übung...</div>
          )}

          {/* Action Check Button (Hidden for Card & instant-selection choice modes) */}
          {currentExercise?.type !== 'card' &&
            currentExercise?.type !== 'multiple_choice' &&
            currentExercise?.type !== 'listen_choice' &&
            currentExercise?.type !== 'dialogue' &&
            !isAnswerChecked && (
            <div className="pt-6">
              <button
                disabled={
                  currentExercise?.type === 'match_pairs'
                    ? matchedPairIds.length < (currentExercise.matchingPairs?.length || 0)
                    : currentExercise?.type === 'scramble' || useWordBank
                    ? selectedTokens.length === 0
                    : !userInput.trim()
                }
                onClick={handleCheckAnswer}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-base shadow-md active:scale-[0.98] transition-all"
              >
                Prüfen
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Lesson Finished Victory Screen */
        <div className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Lektion abgeschlossen!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Großartige Leistung! Du hast das Kapitel erfolgreich gemeistert.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-10 h-10 ${
                  starIdx <= earnedStars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md animate-bounce'
                    : 'text-slate-200 dark:text-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => onClose(true)}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md active:scale-[0.98] transition-all"
          >
            Weiter
          </button>
        </div>
      )}

      {/* Answer Verification Sheet (Bottom Drawer) */}
      {isAnswerChecked && currentExercise?.type !== 'card' && (
        <div
          className={`p-6 border-t animate-slide-up ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-black text-lg">
                  {isCorrect ? 'Ausgezeichnet!' : 'Nicht ganz richtig'}
                </h4>
                {!isCorrect && (
                  <p className="text-sm font-medium opacity-90 mt-0.5">
                    Richtige Antwort:{' '}
                    <span className="font-bold underline">{currentExercise?.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className={`px-6 py-3.5 rounded-2xl font-bold text-white shadow-md active:scale-95 transition-all flex items-center gap-2 ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cultural Info Card Modal */}
      {activeCulturalFact && (
        <CulturalCardModal
          fact={activeCulturalFact}
          onClose={() => setActiveCulturalFact(null)}
        />
      )}
    </div>
  );
};
