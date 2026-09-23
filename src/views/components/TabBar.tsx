import React from 'react';
import { Compass, Coffee, Dumbbell, User } from 'lucide-react';
import { SoundEffects } from '@/src/utils/audio';

export type TabKey = 'path' | 'dialogues' | 'practice' | 'profile';

interface TabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { key: 'path' as TabKey, label: 'Lernweg', icon: Compass },
    { key: 'dialogues' as TabKey, label: 'Dialoge', icon: Coffee },
    { key: 'practice' as TabKey, label: 'Training', icon: Dumbbell },
    { key: 'profile' as TabKey, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pb-safe pointer-events-none flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full shadow-xl border border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                SoundEffects.playTap();
                onSelectTab(tab.key);
              }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className={isActive ? 'inline' : 'hidden sm:inline'}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

