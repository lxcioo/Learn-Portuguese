import React, { useState, useRef } from 'react';
import { X, Volume2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise } from '@/src/models/types';
import { LeitnerService } from '@/src/models/services/LeitnerService';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

interface FlashcardsModalProps {
  exercises: Exercise[];
  onClose: (completed: boolean) => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({ exercises, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Gesture Swipe State
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const currentEx = exercises[currentIndex];

  if (!currentEx) {
    return null;
  }

  const handleFlip = () => {
    SoundEffects.playTap();
    setIsFlipped((f) => !f);
    if (!isFlipped) {
      speakPortuguese(currentEx.question, 0.9);
    }
  };

  const handleRate = async (rating: 1 | 2 | 3 | 4) => {
    SoundEffects.playTap();
    await LeitnerService.recordExerciseResult(currentEx, rating >= 3);

    if (rating >= 3) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playWrong();
    }

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    if (currentIndex < exercises.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    } else {
      SoundEffects.playLevelComplete();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        onClose(true);
      }, 700);
    }
  };

  // Touch and Mouse Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current || !isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const { time: startTime } = touchStartRef.current;
    const deltaX = dragOffset.x;
    const duration = Date.now() - startTime;

    setIsDragging(false);
    touchStartRef.current = null;

    // Check if it's a tap (< 12px drag and < 350ms duration)
    if (Math.abs(deltaX) < 12 && Math.abs(dragOffset.y) < 12 && duration < 350) {
      handleFlip();
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    // Swipe Threshold: 80px or fast swipe > 50px
    const SWIPE_THRESHOLD = 80;
    if (deltaX > SWIPE_THRESHOLD) {
      // Swiped Right -> Known / Good (Rating 4)
      handleRate(4);
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swiped Left -> Repeat / Hard (Rating 1)
      handleRate(1);
    } else {
      // Reset card position
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const cardRotation = dragOffset.x * 0.08;
  const isSwipingRight = dragOffset.x > 30;
  const isSwipingLeft = dragOffset.x < -30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                Spaced Repetition &bull; Swipe
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Karte {currentIndex + 1} von {exercises.length}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onClose(false)}
            aria-label="Schließen"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Flashcard Canvas with Gesture Swipe */}
        <div className="p-6 flex flex-col items-center">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            style={{
              transform: `translateX(${dragOffset.x}px) rotate(${cardRotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease, border-color 0.2s',
            }}
            className={`relative w-full h-76 rounded-3xl cursor-grab active:cursor-grabbing p-6 flex flex-col items-center justify-between text-center shadow-lg border select-none transition-colors ${
              isSwipingRight
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/30'
                : isSwipingLeft
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 ring-2 ring-rose-400/30'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
            }`}
          >
            {/* Gesture Swipe Overlay Badges */}
            {isSwipingRight && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-md flex items-center gap-1 animate-fade-in">
                <span>GEWUSST</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
            {isSwipingLeft && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-md flex items-center gap-1 animate-fade-in">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>NOCHMAL</span>
              </div>
            )}

            {/* Top Bar inside Card */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {isFlipped ? 'Antwort / Deutsch' : 'Portugiesisch'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakPortuguese(currentEx.question, 0.85);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-transform"
                title="Aussprache anhören"
              >
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            {/* Center Content */}
            <div className="my-auto px-2">
              {!isFlipped ? (
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {currentEx.question}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    (Tippen zum Umdrehen)
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                    {currentEx.correctAnswer}
                  </h3>
                  {currentEx.vocabulary && currentEx.vocabulary[0]?.translation && (
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {currentEx.vocabulary[0].translation}
                    </p>
                  )}
                  {currentEx.alternativeAnswers && currentEx.alternativeAnswers.length > 0 && (
                    <p className="text-xs text-slate-400 mt-2">
                      Auch möglich: {currentEx.alternativeAnswers.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Gesture Hint at Bottom */}
            <div className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                &larr; Wischen: Wiederholen
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                Wischen: Gewusst &rarr;
              </span>
            </div>
          </div>

          {/* Quick Rating Buttons Alternative */}
          <div className="w-full mt-6 space-y-2">
            <p className="text-[11px] font-bold text-center uppercase tracking-wider text-slate-400">
              Oder Stufe direkt wählen
            </p>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRate(1)}
                className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 text-xs font-bold hover:bg-rose-100 active:scale-95 transition-all text-center"
              >
                <span className="block text-base mb-0.5">🔄</span>
                <span>Nochmals</span>
              </button>

              <button
                onClick={() => handleRate(2)}
                className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-xs font-bold hover:bg-amber-100 active:scale-95 transition-all text-center"
              >
                <span className="block text-base mb-0.5">⏱️</span>
                <span>Schwer</span>
              </button>

              <button
                onClick={() => handleRate(3)}
                className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40 text-xs font-bold hover:bg-sky-100 active:scale-95 transition-all text-center"
              >
                <span className="block text-base mb-0.5">👍</span>
                <span>Gut</span>
              </button>

              <button
                onClick={() => handleRate(4)}
                className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all text-center"
              >
                <span className="block text-base mb-0.5">🌟</span>
                <span>Einfach</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
