import { useState } from 'react';
import { FlashcardDeck } from './components/FlashcardDeck';
import { HeroOverview } from './components/HeroOverview';
import { LessonWorkspace } from './components/LessonWorkspace';
import { StudyNotesView } from './components/StudyNotesView';
import { TopBar } from './components/TopBar';
import { COURSES } from './data/curriculum';
import { useLearningProgress } from './hooks/useLearningProgress';
import { AppView } from './types/learning';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('catalog');
  const {
    progress,
    setLastVisited,
    toggleLessonComplete,
    recordQuizScore,
    setFlashcardStatus,
    saveNote,
    deleteNote,
    resetAllProgress,
  } = useLearningProgress();

  const activeCourse =
    COURSES.find((c) => c.id === progress.lastVisitedCourseId) ?? COURSES[0];
  const activeLesson =
    activeCourse.lessons.find((l) => l.id === progress.lastVisitedLessonId) ??
    activeCourse.lessons[0];

  const handleOpenCourse = (courseId: string, lessonId?: string) => {
    const targetCourse = COURSES.find((c) => c.id === courseId) ?? COURSES[0];
    const targetLesson =
      targetCourse.lessons.find((l) => l.id === lessonId) ?? targetCourse.lessons[0];
    setLastVisited(targetCourse.id, targetLesson.id);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasAnyProgress =
    progress.completedLessonIds.length > 0 ||
    Object.keys(progress.quizScores).length > 0 ||
    Object.keys(progress.flashcardStatuses).length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onNavigate={handleNavigate}
        onResumeLearning={() =>
          handleOpenCourse(activeCourse.id, activeLesson.id)
        }
        hasProgress={hasAnyProgress}
      />

      <main className="flex-1">
        {activeView === 'catalog' && (
          <HeroOverview
            progress={progress}
            onSelectCourse={handleOpenCourse}
            onOpenFlashcards={() => handleNavigate('flashcards')}
          />
        )}

        {activeView === 'workspace' && (
          <LessonWorkspace
            course={activeCourse}
            lesson={activeLesson}
            progress={progress}
            onSelectCourseLesson={handleOpenCourse}
            onBackToCatalog={() => handleNavigate('catalog')}
            onToggleComplete={toggleLessonComplete}
            onRecordQuizScore={recordQuizScore}
            onSaveNote={saveNote}
          />
        )}

        {activeView === 'flashcards' && (
          <FlashcardDeck
            statuses={progress.flashcardStatuses}
            onSetStatus={setFlashcardStatus}
          />
        )}

        {activeView === 'notes' && (
          <StudyNotesView
            progress={progress}
            onSaveNote={saveNote}
            onDeleteNote={deleteNote}
            onOpenCourse={handleOpenCourse}
            onResetProgress={resetAllProgress}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>知研學苑 · 互動模擬與跨學科自主研習平台</div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigate('catalog')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              課程探索
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('workspace')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              互動實驗室
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('flashcards')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              記憶字卡
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('notes')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              學習筆記
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
