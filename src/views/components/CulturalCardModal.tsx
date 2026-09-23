import React from 'react';
import { X, Volume2, Sparkles, BookOpen, Lightbulb, Compass } from 'lucide-react';
import { CulturalFact } from '@/src/models/data/culturalContent';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

interface CulturalCardModalProps {
  fact: CulturalFact | null;
  onClose: () => void;
}

export const CulturalCardModal: React.FC<CulturalCardModalProps> = ({ fact, onClose }) => {
  if (!fact) return null;

  const handleSpeak = () => {
    SoundEffects.playTap();
    speakPortuguese(fact.audioPronunciation || fact.term, 0.85);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-amber-900/40 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Portuguese cultural banner aesthetic */}
        <div className="relative p-6 bg-gradient-to-br from-amber-600 via-rose-700 to-slate-900 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-amber-200 border border-white/20">
              <Compass className="w-3.5 h-3.5" />
              {fact.category}
            </span>

            <button
              onClick={onClose}
              aria-label="Schließen"
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{fact.emoji}</span>
                <h3 className="text-2xl font-black tracking-tight">{fact.term}</h3>
                <button
                  onClick={handleSpeak}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95"
                  title="Aussprache anhören"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-medium text-white/80 mt-1">{fact.germanTitle}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-amber-100 text-sm leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Kultureller Kern:</span>
            </div>
            {fact.summary}
          </div>

          {/* Details list */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Hintergrund &amp; Tradition
            </h4>
            <div className="space-y-2">
              {fact.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                >
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Did You Know Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Schon gewusst?</span>
            </div>
            {fact.didYouKnow}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Tipp: Verbinde Wörter mit Bildern im Kopf!</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            Weiterlernen
          </button>
        </div>
      </div>
    </div>
  );
};
