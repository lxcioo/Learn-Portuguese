import React, { useState, useEffect } from 'react';
import { X, Headphones, Volume2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EAR_TRAINING_MODULES } from '@/src/models/data/immersiveContent';
import { playAudioWithFallback, prefetchAudio, SoundEffects } from '@/src/utils/audio';
import { OfflineTrackerService } from '@/src/models/services/OfflineTrackerService';

interface EarTrainingModalProps {
  onClose: (completed: boolean) => void;
}

export const EarTrainingModal: React.FC<EarTrainingModalProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentModule = EAR_TRAINING_MODULES[currentIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Background prefetch audio for zero latency
  useEffect(() => {
    OfflineTrackerService.prefetchEarTrainingAudio();
    if (currentModule) {
      prefetchAudio(currentModule.audioA.text);
      prefetchAudio(currentModule.audioB.text);
      prefetchAudio(currentModule.challenge.targetAudio);
    }
  }, [currentIndex, currentModule]);

  const handlePlay = (text: string, rate = 0.85) => {
    SoundEffects.playTap();
    playAudioWithFallback(text, text, rate);
  };

  const handleSelectOption = (index: number) => {
    SoundEffects.playTap();
    setSelectedOption(index);
    if (index === currentModule.challenge.correctIndex) {
      SoundEffects.playCorrect();
      setStatus('correct');
      if (currentIndex === EAR_TRAINING_MODULES.length - 1) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      SoundEffects.playWrong();
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    SoundEffects.playTap();
    if (currentIndex < EAR_TRAINING_MODULES.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setStatus('idle');
    } else {
      SoundEffects.playLevelComplete();
      onClose(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                Aussprache &amp; Gehör-Training
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentModule.title}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
            <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>{currentModule.ruleTitle}</span>
            </h3>
            <p className="text-xs text-indigo-800/90 dark:text-indigo-300 leading-relaxed">
              {currentModule.ruleExplanationDe}
            </p>
          </div>

          {/* Audio Examples A vs B */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Höre dir die Beispiele an:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handlePlay(currentModule.audioA.text)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 flex items-center justify-between text-left transition-all active:scale-98 shadow-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-base">
                    {currentModule.audioA.label}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                    {currentModule.audioA.phonetic}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                  <Volume2 className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => handlePlay(currentModule.audioB.text)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 flex items-center justify-between text-left transition-all active:scale-98 shadow-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-base">
                    {currentModule.audioB.label}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                    {currentModule.audioB.phonetic}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                  <Volume2 className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Listening Challenge */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Gehör-Test:
              </span>
              <button
                onClick={() => handlePlay(currentModule.challenge.targetAudio, 0.8)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio abspielen</span>
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
              {currentModule.challenge.question}
            </p>

            <div className="space-y-2">
              {currentModule.challenge.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentModule.challenge.correctIndex;

                let optStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';
                if (selectedOption !== null) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            Modul {currentIndex + 1} von {EAR_TRAINING_MODULES.length}
          </span>

          <button
            onClick={handleNext}
            disabled={status !== 'correct'}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-1.5 transition-all ${
              status === 'correct'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex === EAR_TRAINING_MODULES.length - 1 ? 'Abschließen' : 'Weiter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
