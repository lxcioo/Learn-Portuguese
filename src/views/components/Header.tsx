import React from 'react';
import { Flame, Snowflake, Moon, Sun, Settings, HardDriveDownload } from 'lucide-react';
import { StreakData } from '@/src/models/types';
import { SoundEffects } from '@/src/utils/audio';

interface HeaderProps {
  streak: number;
  streakData: StreakData | null;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenStreakModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenOfflineTracker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  streakData,
  isDarkMode,
  onToggleTheme,
  onOpenStreakModal,
  onOpenSettingsModal,
  onOpenOfflineTracker,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-200 bg-white/90 border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand & Offline Tracker status badge */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-sm shadow-sm ring-2 ring-emerald-500/20">
            PT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                LearnPortuguese
              </h1>
              <button
                onClick={() => {
                  SoundEffects.playTap();
                  onOpenOfflineTracker();
                }}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-all active:scale-95 cursor-pointer border border-emerald-200 dark:border-emerald-800/60"
                title="Offline-Inhalte & Speicher verwalten"
              >
                <HardDriveDownload className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>100% Offline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Offline button */}
          <button
            onClick={() => {
              SoundEffects.playTap();
              onOpenOfflineTracker();
            }}
            className="sm:hidden p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            title="Offline-Inhalte verwalten"
          >
            <HardDriveDownload className="w-4 h-4" />
          </button>

          {/* Ice / Frozen streak count */}
          {streakData && streakData.streakOnIceCount > 0 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-sky-600 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800"
              title="Aktive Eisflammen (Streak-Schutz)"
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>{streakData.streakOnIceCount}</span>
            </div>
          )}

          {/* Streak button */}
          <button
            onClick={() => {
              SoundEffects.playTap();
              onOpenStreakModal();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-transform active:scale-95 ${
              streak > 0
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
            title="Lernserie anzeigen"
          >
            <Flame
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                streak > 0 ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
              }`}
            />
            <span>{streak}</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => {
              SoundEffects.playTap();
              onToggleTheme();
            }}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Heller Modus' : 'Dunkler Modus'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => {
              SoundEffects.playTap();
              onOpenSettingsModal();
            }}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Einstellungen"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
