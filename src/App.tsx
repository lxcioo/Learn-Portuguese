import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/src/views/components/Header';
import { TabBar, TabKey } from '@/src/views/components/TabBar';
import { PathView } from '@/src/views/components/PathView';
import { PracticeView } from '@/src/views/components/PracticeView';
import { ImmersiveView } from '@/src/views/components/ImmersiveView';
import { ProfileView } from '@/src/views/components/ProfileView';
import { LessonModal } from '@/src/views/components/LessonModal';
import { GrammarModal } from '@/src/views/components/GrammarModal';
import { StreakModal } from '@/src/views/components/StreakModal';
import { SettingsModal } from '@/src/views/components/SettingsModal';
import { BoxVocabModal } from '@/src/views/components/BoxVocabModal';
import { ImmersiveDialogueModal } from '@/src/views/components/ImmersiveDialogueModal';
import { SentenceLabModal } from '@/src/views/components/SentenceLabModal';
import { EarTrainingModal } from '@/src/views/components/EarTrainingModal';
import { FlashcardsModal } from '@/src/views/components/FlashcardsModal';
import { OfflineTrackerModal } from '@/src/views/components/OfflineTrackerModal';
import { PWAInstallBanner } from '@/src/views/components/PWAInstallBanner';
import { useUserProgress } from '@/src/viewmodels/useUserProgress';
import { LeitnerService } from '@/src/models/services/LeitnerService';
import { LectureEnhancer } from '@/src/models/services/LectureEnhancer';
import { Exercise } from '@/src/models/types';
import { ImmersiveScenario } from '@/src/models/data/immersiveContent';
import content, { loadLevel, loadExamExercises } from '@/src/models/data/content';
import { SoundEffects } from '@/src/utils/audio';

const TAB_ORDER: TabKey[] = ['path', 'dialogues', 'practice', 'profile'];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('path');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const { scores, examScores, streak, streakData, reload } = useUserProgress();

  // Active Lesson State
  const [activeLesson, setActiveLesson] = useState<{
    lessonId: string;
    lessonType: 'lesson' | 'exam' | 'practice';
    title: string;
    exercises: Exercise[];
  } | null>(null);

  // Modern Immersion States
  const [activeScenario, setActiveScenario] = useState<ImmersiveScenario | null>(null);
  const [isSentenceLabOpen, setIsSentenceLabOpen] = useState(false);
  const [isEarTrainingOpen, setIsEarTrainingOpen] = useState(false);
  const [activeFlashcardsDeck, setActiveFlashcardsDeck] = useState<Exercise[] | null>(null);

  // Modals & Trackers
  const [isOfflineTrackerOpen, setIsOfflineTrackerOpen] = useState(false);
  const [activeGrammarUnitId, setActiveGrammarUnitId] = useState<string | null>(null);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [boxModalData, setBoxModalData] = useState<{
    boxIndex: number;
    boxLabel: string;
    exercises: Exercise[];
  } | null>(null);

  // Alert Popover
  const [alertInfo, setAlertInfo] = useState<{ title: string; msg: string } | null>(null);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Purge legacy audio caches to guarantee Google Translator European Portuguese audio
  useEffect(() => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      window.caches.keys().then((names) => {
        names.forEach((name) => {
          if (name === 'audio-cache-v1') {
            window.caches.delete(name);
          }
        });
      });
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Start lesson from Path using dynamic lazy loading
  const handleStartPathLesson = async (
    lessonId: string,
    lessonType: 'lesson' | 'exam',
    title: string
  ) => {
    SoundEffects.playTap();
    try {
      if (lessonType === 'exam') {
        const data = await loadExamExercises(lessonId);
        if (!data || data.exercises.length === 0) {
          setAlertInfo({
            title: 'Ladefehler',
            msg: 'Die Prüfung konnte nicht geladen werden. Bitte versuche es erneut.',
          });
          return;
        }
        const enhanced = LectureEnhancer.enhanceLesson(data.exercises, lessonId, title);
        setActiveLesson({
          lessonId,
          lessonType: 'exam',
          title,
          exercises: enhanced.length > 0 ? enhanced : data.exercises,
        });
      } else {
        const data = await loadLevel(lessonId);
        if (!data || data.exercises.length === 0) {
          setAlertInfo({
            title: 'Ladefehler',
            msg: 'Die Lektion konnte nicht geladen werden. Bitte versuche es erneut.',
          });
          return;
        }
        const enhanced = LectureEnhancer.enhanceLesson(data.exercises, lessonId, title);
        setActiveLesson({
          lessonId,
          lessonType: 'lesson',
          title,
          exercises: enhanced.length > 0 ? enhanced : data.exercises,
        });
      }
    } catch (err) {
      console.error('Failed to load lesson:', err);
      setAlertInfo({
        title: 'Fehler',
        msg: 'Es gab ein Problem beim Laden der Inhalte. Bitte versuche es erneut.',
      });
    }
  };

  // Start Practice session
  const handleStartPractice = (exercises: Exercise[], title: string) => {
    const enhanced = LectureEnhancer.enhanceLesson(exercises, 'practice', title);
    setActiveLesson({
      lessonId: 'practice-session',
      lessonType: 'practice',
      title,
      exercises: enhanced.length > 0 ? enhanced : exercises,
    });
  };

  // Open Leitner Box Modal
  const handleOpenBoxModal = async (boxIndex: number, boxLabel: string) => {
    const words = await LeitnerService.getBoxWords(boxIndex);
    setBoxModalData({
      boxIndex,
      boxLabel,
      exercises: words,
    });
  };

  // Open Grammar guide
  const handleOpenGrammar = (unitId: string) => {
    setActiveGrammarUnitId(unitId);
  };

  // Check if any modal is currently active to avoid gesture collision
  const isAnyModalOpen =
    !!activeLesson ||
    !!activeScenario ||
    isSentenceLabOpen ||
    isEarTrainingOpen ||
    !!activeFlashcardsDeck ||
    isOfflineTrackerOpen ||
    !!activeGrammarUnitId ||
    isStreakModalOpen ||
    isSettingsModalOpen ||
    !!boxModalData ||
    !!alertInfo;

  // Touch Swipe Gesture Navigation across Main Tabs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleContainerTouchStart = (e: React.TouchEvent) => {
    if (isAnyModalOpen) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleContainerTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnyModalOpen) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    // Detect dominant horizontal swipe gesture (> 60px and within 500ms)
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && elapsed < 550) {
      const currentIndex = TAB_ORDER.indexOf(activeTab);
      if (deltaX < 0) {
        // Swiped Left -> Move to Next Tab
        if (currentIndex < TAB_ORDER.length - 1) {
          SoundEffects.playTap();
          setActiveTab(TAB_ORDER[currentIndex + 1]);
        }
      } else {
        // Swiped Right -> Move to Previous Tab
        if (currentIndex > 0) {
          SoundEffects.playTap();
          setActiveTab(TAB_ORDER[currentIndex - 1]);
        }
      }
    }
  };

  return (
    <div
      onTouchStart={handleContainerTouchStart}
      onTouchEnd={handleContainerTouchEnd}
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 select-none"
    >
      {/* Top Header */}
      <Header
        streak={streak}
        streakData={streakData}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenOfflineTracker={() => setIsOfflineTrackerOpen(true)}
      />

      {/* Main Tab Screen View */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {activeTab === 'path' && (
          <PathView
            scores={scores}
            examScores={examScores}
            onStartLesson={handleStartPathLesson}
            onOpenGrammar={handleOpenGrammar}
          />
        )}

        {activeTab === 'dialogues' && (
          <ImmersiveView
            onSelectScenario={(sc) => setActiveScenario(sc)}
            onOpenSentenceLab={() => setIsSentenceLabOpen(true)}
            onOpenEarTraining={() => setIsEarTrainingOpen(true)}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            onStartPractice={handleStartPractice}
            onOpenBoxModal={handleOpenBoxModal}
            showAlert={(title, msg) => setAlertInfo({ title, msg })}
            onOpenFlashcards={(cards) => setActiveFlashcardsDeck(cards)}
            onOpenSentenceLab={() => setIsSentenceLabOpen(true)}
            onOpenEarTraining={() => setIsEarTrainingOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            scores={scores}
            examScores={examScores}
            streak={streak}
            streakData={streakData}
            onOpenOfflineTracker={() => setIsOfflineTrackerOpen(true)}
          />
        )}
      </main>

      {/* PWA Offline Install Banner */}
      <PWAInstallBanner />

      {/* Modern Bottom Tab Bar */}
      <TabBar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Offline Content Tracker Modal */}
      <OfflineTrackerModal
        isOpen={isOfflineTrackerOpen}
        onClose={() => setIsOfflineTrackerOpen(false)}
      />

      {/* Interactive Flashcards 3D Deck */}
      {activeFlashcardsDeck && (
        <FlashcardsModal
          exercises={activeFlashcardsDeck}
          onClose={() => {
            setActiveFlashcardsDeck(null);
            reload();
          }}
        />
      )}

      {/* Sentence Lab Modal */}
      {isSentenceLabOpen && (
        <SentenceLabModal
          onClose={() => {
            setIsSentenceLabOpen(false);
            reload();
          }}
        />
      )}

      {/* Ear-Training & Phonetics Modal */}
      {isEarTrainingOpen && (
        <EarTrainingModal
          onClose={() => {
            setIsEarTrainingOpen(false);
            reload();
          }}
        />
      )}

      {/* Interactive Dialogue Modal */}
      {activeScenario && (
        <ImmersiveDialogueModal
          scenario={activeScenario}
          onClose={() => {
            setActiveScenario(null);
            reload();
          }}
        />
      )}

      {/* Interactive Lesson Modal Runner */}
      {activeLesson && (
        <LessonModal
          lessonId={activeLesson.lessonId}
          lessonType={activeLesson.lessonType}
          lessonTitle={activeLesson.title}
          exercises={activeLesson.exercises}
          onClose={(completed) => {
            setActiveLesson(null);
            if (completed) {
              reload();
            }
          }}
        />
      )}

      {/* Unit Grammar Modal */}
      {activeGrammarUnitId && (
        <GrammarModal
          unitId={activeGrammarUnitId}
          onClose={() => setActiveGrammarUnitId(null)}
        />
      )}

      {/* Streak Details Modal */}
      {isStreakModalOpen && (
        <StreakModal
          streak={streak}
          streakData={streakData}
          onClose={() => setIsStreakModalOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onClose={() => setIsSettingsModalOpen(false)}
          onDataReset={() => reload()}
        />
      )}

      {/* Leitner Box Words Modal */}
      {boxModalData && (
        <BoxVocabModal
          boxIndex={boxModalData.boxIndex}
          boxLabel={boxModalData.boxLabel}
          exercises={boxModalData.exercises}
          onClose={() => setBoxModalData(null)}
        />
      )}

      {/* Generic Alert Dialog */}
      {alertInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setAlertInfo(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {alertInfo.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {alertInfo.msg}
            </p>
            <button
              onClick={() => setAlertInfo(null)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
