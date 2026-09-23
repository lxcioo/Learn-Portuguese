import React from 'react';
import { X, Flame, Snowflake, Calendar } from 'lucide-react';
import { StreakData } from '@/src/models/types';

interface StreakModalProps {
  streak: number;
  streakData: StreakData | null;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ streak, streakData, onClose }) => {
  // Generate last 14 days
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const weekday = d.toLocaleDateString('de-DE', { weekday: 'narrow' });
    const dayNum = d.getDate();
    const status = streakData?.history?.[dateStr];
    const isToday = i === 13;

    return {
      dateStr,
      weekday,
      dayNum,
      status, // 'learned' | 'frozen' | undefined
      isToday,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-[#232526] rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large Flame */}
        <div className="w-20 h-20 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3 shadow-inner">
          <Flame className="w-12 h-12 fill-current animate-pulse" />
        </div>

        <h3 className="text-3xl font-black text-gray-900 dark:text-white">
          {streak} {streak === 1 ? 'Tag' : 'Tage'} Streak!
        </h3>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
          Lerne jeden Tag mindestens 15 Vokabeln, um deine Lernserie aktiv zu halten.
        </p>

        {/* Ice freezes card */}
        <div className="w-full p-4 mt-5 rounded-2xl bg-[#4DA8DA]/10 border border-[#4DA8DA]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4DA8DA]/20 text-[#4DA8DA] flex items-center justify-center">
              <Snowflake className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Eisflammen</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Schützt deinen Streak bei Pausen</p>
            </div>
          </div>
          <span className="text-lg font-black text-[#4DA8DA]">
            {streakData?.streakOnIceCount || 0}
          </span>
        </div>

        {/* 14 Days History Grid */}
        <div className="w-full mt-6 text-left">
          <div className="flex items-center gap-1.5 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Letzte 14 Tage
            </h4>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  day.status === 'learned'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold'
                    : day.status === 'frozen'
                    ? 'bg-[#4DA8DA]/15 border-[#4DA8DA]/30 text-[#4DA8DA] font-bold'
                    : day.isToday
                    ? 'bg-gray-100 dark:bg-[#333] border-gray-300 dark:border-gray-600 text-gray-400 font-medium'
                    : 'bg-transparent border-transparent text-gray-400 font-normal'
                }`}
              >
                <span className="text-[10px] text-gray-400 uppercase">{day.weekday}</span>
                <span className="text-xs mt-0.5">{day.dayNum}</span>
                <div className="mt-1">
                  {day.status === 'learned' ? (
                    <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                  ) : day.status === 'frozen' ? (
                    <Snowflake className="w-3.5 h-3.5 text-[#4DA8DA]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-bold text-sm shadow-md transition-all active:scale-95"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
};
