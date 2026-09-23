import React from 'react';
import { MapPin, Sparkles, Volume2, ArrowRight, Coffee, Compass, Sun, ShieldCheck } from 'lucide-react';
import { IMMERSIVE_SCENARIOS, ImmersiveScenario } from '@/src/models/data/immersiveContent';
import { SoundEffects } from '@/src/utils/audio';

interface ImmersiveViewProps {
  onSelectScenario: (scenario: ImmersiveScenario) => void;
  onOpenSentenceLab: () => void;
  onOpenEarTraining: () => void;
}

export const ImmersiveView: React.FC<ImmersiveViewProps> = ({
  onSelectScenario,
  onOpenSentenceLab,
  onOpenEarTraining,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return Coffee;
      case 'Compass':
        return Compass;
      case 'Sun':
        return Sun;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-8 animate-fade-in">
      {/* Intro Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Natürlicher Spracherwerb</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Echte Dialoge &amp; lebendige Situationen
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
            Keine trockenen Grammatiktabellen: Lerne europäisches Portugiesisch so, wie es Einheimische in Lissabon und Porto tatsächlich sprechen.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => {
                SoundEffects.playTap();
                onOpenSentenceLab();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs font-bold transition-all active:scale-95"
            >
              <span>🧩 Satzbausteine-Lab</span>
            </button>
            <button
              onClick={() => {
                SoundEffects.playTap();
                onOpenEarTraining();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs font-bold transition-all active:scale-95"
            >
              <span>🎧 Aussprache-Training</span>
            </button>
          </div>
        </div>

        {/* Decorative Azulejo overlay pattern */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Scenarios List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span>Szenarien vor Ort</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {IMMERSIVE_SCENARIOS.length} Situationen verfügbar
          </span>
        </div>

        <div className="grid gap-4">
          {IMMERSIVE_SCENARIOS.map((sc) => {
            const Icon = getIcon(sc.iconName);

            return (
              <div
                key={sc.id}
                onClick={() => {
                  SoundEffects.playTap();
                  onSelectScenario(sc);
                }}
                className="group relative p-5 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-98 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${sc.accentColor}18`, color: sc.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {sc.difficulty}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500 inline" />
                          {sc.location}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {sc.titlePt}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {sc.titleDe}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {sc.summaryDe}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Volume2 className="w-3.5 h-3.5 inline" />
                    {sc.dialogue.length} Dialogzeilen mit Audio
                  </span>
                  <span>{sc.questions.length} Verständnis-Checks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline Assurance Card */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-900 dark:text-emerald-200 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p>
          <strong>100% Offline-fähig:</strong> Alle Dialoge, Audio-Sprachsynthese und Vokabeln funktionieren ganz ohne Internetverbindung im Flugzeug- oder U-Bahn-Modus.
        </p>
      </div>
    </div>
  );
};
