import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Star, Lock, CheckCircle2, Play } from 'lucide-react';
import content, { onContentLoaded, isContentLoaded } from '@/src/models/data/content';
import { Unit, Level } from '@/src/models/types';
import { SoundEffects } from '@/src/utils/audio';

interface PathViewProps {
  scores: Record<string, number>;
  examScores: Record<string, boolean>;
  onStartLesson: (lessonId: string, lessonType: 'lesson' | 'exam', title: string) => void;
  onOpenGrammar: (unitId: string) => void;
}

export const PathView: React.FC<PathViewProps> = ({
  scores,
  examScores,
  onStartLesson,
  onOpenGrammar,
}) => {
  const [, setContentReady] = useState(isContentLoaded());

  useEffect(() => {
    return onContentLoaded(() => setContentReady(true));
  }, []);

  const course = content.courses[0];
  const [selectedLevel, setSelectedLevel] = useState<{
    level: Level;
    unit: Unit;
    stars: number;
    isExam?: boolean;
  } | null>(null);

  // Winding offset calculations for the natural winding path
  const getOffsetClass = (index: number) => {
    const pattern = [0, 36, 64, 36, 0, -36, -64, -36];
    const offset = pattern[index % pattern.length];
    return {
      transform: `translateX(${offset}px)`,
    };
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28">
      {course.units.map((unit, unitIndex) => {
        const isUnitUnlocked =
          unitIndex === 0 || !!examScores[course.units[unitIndex - 1].id];
        const allLevelsDone = unit.levels.every((l) => (scores[l.id] || 0) > 0);
        const isExamUnlocked = isUnitUnlocked && allLevelsDone;
        const isExamPassed = !!examScores[unit.id];

        return (
          <section key={unit.id} className="mb-12">
            {/* Unit Header Card */}
            <div
              className={`rounded-3xl p-5 mb-8 shadow-sm transition-all border ${
                isUnitUnlocked
                  ? 'bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 border-emerald-600/30 text-white'
                  : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                      Kapitel {unitIndex + 1}
                    </span>
                    {isExamPassed && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Trophy className="w-3.5 h-3.5" />
                        Gemeistert
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-white drop-shadow-sm">
                    {unit.title}
                  </h2>
                  <p className="text-white/80 text-xs font-medium mt-1">
                    {unit.levels.length} Lektionen • Situative Grammatik & Dialoge
                  </p>
                </div>

                {unit.grammarGuide && unit.grammarGuide.length > 0 && isUnitUnlocked && (
                  <button
                    onClick={() => {
                      SoundEffects.playTap();
                      onOpenGrammar(unit.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-2xl text-xs font-bold backdrop-blur-sm transition-all shadow-sm border border-white/20"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Grammatik</span>
                  </button>
                )}
              </div>
            </div>

            {/* Level Nodes in Zigzag Path */}
            <div className="flex flex-col items-center gap-8 py-2">
              {unit.levels.map((level, levelIndex) => {
                const isFirstLevelOfUnit = levelIndex === 0;
                const prevLevelScore =
                  levelIndex > 0 ? scores[unit.levels[levelIndex - 1].id] || 0 : 3;
                const isLevelUnlocked =
                  isUnitUnlocked && (isFirstLevelOfUnit || prevLevelScore > 0);
                const levelStars = scores[level.id] || 0;
                const isCompleted = levelStars > 0;
                const isCurrent = isLevelUnlocked && !isCompleted;

                return (
                  <div
                    key={level.id}
                    style={getOffsetClass(levelIndex)}
                    className="flex flex-col items-center relative transition-transform duration-200"
                  >
                    <button
                      disabled={!isLevelUnlocked}
                      onClick={() => {
                        SoundEffects.playTap();
                        setSelectedLevel({
                          level,
                          unit,
                          stars: levelStars,
                          isExam: false,
                        });
                      }}
                      className={`relative w-18 h-18 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 active:scale-90 shadow-md ${
                        !isLevelUnlocked
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border-2 border-slate-300 dark:border-slate-700'
                          : isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 ring-4 ring-emerald-500/20'
                          : isCurrent
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-white ring-4 ring-emerald-500/40 animate-pulse'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {!isLevelUnlocked ? (
                        <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      ) : (
                        <Star className="w-7 h-7 fill-current text-white" />
                      )}
                    </button>

                    {/* Star ratings under node */}
                    {isCompleted && (
                      <div className="flex gap-0.5 mt-1.5">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-3.5 h-3.5 ${
                              starNum <= levelStars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Level Title label */}
                    <span
                      className={`text-xs mt-1.5 font-bold max-w-[150px] text-center truncate ${
                        isLevelUnlocked
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {level.title}
                    </span>
                  </div>
                );
              })}

              {/* Unit Exam Node */}
              <div
                style={getOffsetClass(unit.levels.length)}
                className="flex flex-col items-center mt-3"
              >
                <button
                  disabled={!isExamUnlocked}
                  onClick={() => {
                    SoundEffects.playTap();
                    setSelectedLevel({
                      level: {
                        id: unit.id,
                        title: `Kapitelprüfung: ${unit.title}`,
                        exercises: [],
                      },
                      unit,
                      stars: isExamPassed ? 3 : 0,
                      isExam: true,
                    });
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-bold transition-all duration-200 active:scale-95 shadow-lg ${
                    !isExamUnlocked
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border-2 border-slate-300 dark:border-slate-700'
                      : isExamPassed
                      ? 'bg-amber-500 hover:bg-amber-400 text-white border-2 border-amber-300 ring-4 ring-amber-400/20'
                      : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-2 border-white ring-4 ring-amber-400/40 animate-pulse'
                  }`}
                >
                  <Trophy className="w-9 h-9" />
                </button>
                <span
                  className={`text-xs mt-2 font-bold uppercase tracking-wider ${
                    isExamUnlocked
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {isExamPassed ? 'Kapitel Gemeistert' : 'Kapitel-Prüfung'}
                </span>
              </div>
            </div>
          </section>
        );
      })}

      {/* Level Details Modal / Popover */}
      {selectedLevel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedLevel(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white shadow-md ${
                selectedLevel.isExam
                  ? 'bg-amber-500 ring-4 ring-amber-400/20'
                  : 'bg-emerald-600 ring-4 ring-emerald-500/20'
              }`}
            >
              {selectedLevel.isExam ? (
                <Trophy className="w-8 h-8" />
              ) : (
                <Star className="w-8 h-8 fill-current" />
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {selectedLevel.level.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
              {selectedLevel.unit.title}
            </p>

            {/* Stars row */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  className={`w-7 h-7 ${
                    starNum <= selectedLevel.stars
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200 dark:text-slate-800'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  SoundEffects.playTap();
                  const isExam = !!selectedLevel.isExam;
                  const lId = selectedLevel.level.id;
                  const lTitle = selectedLevel.level.title;
                  setSelectedLevel(null);
                  onStartLesson(lId, isExam ? 'exam' : 'lesson', lTitle);
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{selectedLevel.stars > 0 ? 'Wiederholen' : 'Starten'}</span>
              </button>

              <button
                onClick={() => setSelectedLevel(null)}
                className="w-full py-2.5 rounded-2xl text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-xs transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
