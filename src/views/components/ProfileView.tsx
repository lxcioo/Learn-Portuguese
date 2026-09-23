import React, { useState, useEffect } from 'react';
import {
  Flame,
  Star,
  Brain,
  Award,
  Lock,
  Calendar,
  Trophy,
  HardDriveDownload,
  CheckCircle2,
} from 'lucide-react';
import { AchievementService } from '@/src/models/services/AchievementService';
import { LeitnerService } from '@/src/models/services/LeitnerService';
import { StorageService } from '@/src/models/services/StorageService';
import { Achievement, StreakData } from '@/src/models/types';
import content from '@/src/models/data/content';
import { SoundEffects } from '@/src/utils/audio';

interface ProfileViewProps {
  scores: Record<string, number>;
  examScores: Record<string, boolean>;
  streak: number;
  streakData: StreakData | null;
  onOpenOfflineTracker?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  scores,
  examScores,
  streak,
  streakData,
  onOpenOfflineTracker,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [box4Count, setBox4Count] = useState(0);
  const [userName, setUserName] = useState('Lerner');

  const course = content.courses[0];
  const totalLevelsCount = course.units.reduce((acc, u) => acc + u.levels.length, 0);
  const completedLessonsCount = Object.values(scores).filter((s) => s > 0).length;
  const threeStarLessonsCount = Object.values(scores).filter((s) => s >= 3).length;
  const passedExamsCount = Object.values(examScores).filter(Boolean).length;
  const totalStars = Object.values(scores).reduce((acc, s) => acc + s, 0);

  useEffect(() => {
    const loadProfileData = async () => {
      // 1. Daily count
      const todayDateString = new Date().toDateString();
      const dailyData = await StorageService.getItem<{ count: number; date: string }>('dailyProgress');
      if (dailyData && dailyData.date === todayDateString) {
        setDailyCount(dailyData.count);
      } else {
        setDailyCount(0);
      }

      // 2. Leitner Box 4 count
      const leitner = await LeitnerService.getLeitnerStats();
      const box4 = leitner[4] || 0;
      setBox4Count(box4);

      // 3. User Name
      const profile = await StorageService.getItem<{ name: string }>('userProfile');
      if (profile?.name) {
        setUserName(profile.name);
      }

      // 4. Achievements
      const stats = {
        completedLessonsCount,
        threeStarLessonsCount,
        passedExamsCount,
        streak,
        totalStars,
        longTermMemoryCount: box4,
        hasCleanSlate: false,
        streakData,
      };

      const loadedAchievements = await AchievementService.loadAchievements(stats);
      setAchievements(loadedAchievements);
    };

    loadProfileData();
  }, [completedLessonsCount, threeStarLessonsCount, passedExamsCount, streak, totalStars, streakData]);

  const dailyGoal = 15;
  const dailyProgressPercent = Math.min(Math.round((dailyCount / dailyGoal) * 100), 100);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-5">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 p-0.5 shadow-md flex-shrink-0">
          <div className="w-full h-full rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-3xl font-bold">
            🇵🇹
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{userName}</h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Europäisches Portugiesisch A1
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
              Lektion {completedLessonsCount} / {totalLevelsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Offline Storage Tracker Tile */}
      {onOpenOfflineTracker && (
        <button
          onClick={() => {
            SoundEffects.playTap();
            onOpenOfflineTracker();
          }}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-sky-950/40 border border-emerald-500/20 dark:border-emerald-500/30 text-left flex items-center justify-between group active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 transition-colors">
                  Offline-Speicher &amp; Content-Tracker
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-600 text-white">
                  Aktiv
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                5 Kapitel, Dialoge &amp; Audios offline verfügbar • Speicher analysieren
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pr-2">
            Öffnen →
          </span>
        </button>
      )}

      {/* Daily Goal Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Tagesziel: 15 Übungen
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {dailyCount} / {dailyGoal}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${dailyProgressPercent}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {dailyCount >= dailyGoal
            ? '🎉 Tagesziel erreicht! Dein Streak ist für heute gesichert.'
            : `Noch ${dailyGoal - dailyCount} Übungen, um den heutigen Streak zu sichern.`}
        </p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{streak}</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tage-Streak</p>
          </div>
        </div>

        {/* Total Stars */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalStars}</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sterne</p>
          </div>
        </div>

        {/* Long-term memory */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{box4Count}</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gedächtnis (Box 4)</p>
          </div>
        </div>

        {/* Exams passed */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{passedExamsCount}</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Prüfungen bestanden</p>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Erfolge ({achievements.filter((a) => a.isUnlocked).length} / {achievements.length})
            </h3>
          </div>
        </div>

        <div className="space-y-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                ach.isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40 opacity-70'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
                  ach.isUnlocked
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {ach.isUnlocked ? ach.icon || '🏆' : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-bold text-sm ${
                      ach.isUnlocked
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  {ach.isUnlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
