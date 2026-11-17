import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FlaskConical,
  NotebookPen,
  Save,
} from 'lucide-react';
import { COURSES } from '../data/curriculum';
import { Course, LearningProgress, Lesson } from '../types/learning';
import { AlgorithmLabSim } from './simulations/AlgorithmLabSim';
import { BohrEffectSim } from './simulations/BohrEffectSim';
import { GoldenRatioSim } from './simulations/GoldenRatioSim';
import { WaveInterferenceSim } from './simulations/WaveInterferenceSim';

interface LessonWorkspaceProps {
  course: Course;
  lesson: Lesson;
  progress: LearningProgress;
  onSelectCourseLesson: (courseId: string, lessonId: string) => void;
  onBackToCatalog: () => void;
  onToggleComplete: (lessonId: string) => void;
  onRecordQuizScore: (lessonId: string, score: number, total: number) => void;
  onSaveNote: (input: { courseId: string; lessonId?: string; title: string; content: string }) => void;
}

type WorkspaceTab = 'simulation' | 'principles' | 'quiz';

export function LessonWorkspace({
  course,
  lesson,
  progress,
  onSelectCourseLesson,
  onBackToCatalog,
  onToggleComplete,
  onRecordQuizScore,
  onSaveNote,
}: LessonWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('simulation');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Quick note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSavedNotice, setNoteSavedNotice] = useState(false);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setNoteTitle(`${lesson.title} 重點筆記`);
    setNoteContent('');
    setNoteSavedNotice(false);
  }, [lesson.id, lesson.title]);

  const isCompleted = progress.completedLessonIds.includes(lesson.id);
  const existingQuiz = progress.quizScores[lesson.id];

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  const handleSubmitQuiz = () => {
    let score = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizSubmitted(true);
    onRecordQuizScore(lesson.id, score, lesson.quiz.length);
  };

  const handleQuickNoteSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onSaveNote({
      courseId: course.id,
      lessonId: lesson.id,
      title: noteTitle.trim() || `${lesson.title} 筆記`,
      content: noteContent.trim(),
    });
    setNoteContent('');
    setNoteSavedNotice(true);
    window.setTimeout(() => setNoteSavedNotice(false), 2500);
  };

  const renderSimulation = () => {
    switch (lesson.simulationKind) {
      case 'bohr-effect':
        return <BohrEffectSim />;
      case 'golden-ratio':
        return <GoldenRatioSim />;
      case 'algorithm-lab':
        return <AlgorithmLabSim />;
      case 'wave-interference':
        return <WaveInterferenceSim />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      {/* Top Breadcrumb & Course Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回課程總覽
          </button>
          <div className="text-xs text-slate-500 truncate">
            <span>{course.discipline}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-slate-900 font-medium">{course.title}</span>
          </div>
        </div>

        {/* Switch between courses inside lab */}
        <div className="flex items-center gap-2">
          <label htmlFor="workspace-course-switch" className="text-xs text-slate-500 whitespace-nowrap">
            切換學科實驗室：
          </label>
          <select
            id="workspace-course-switch"
            value={course.id}
            onChange={(e) => {
              const target = COURSES.find((c) => c.id === e.target.value);
              if (target) onSelectCourseLesson(target.id, target.lessons[0].id);
            }}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 cursor-pointer max-w-[240px]"
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.discipline} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Balanced Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Zone (8 cols): Interactive Stage, Principles, Quiz */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-sky-700">單元 {lesson.order}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">預計 {lesson.durationMinutes} 分鐘</span>
                  {isCompleted && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">已完成研習</span>
                    </>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{lesson.title}</h1>
                <p className="text-sm text-slate-600">{lesson.summary}</p>
              </div>

              <button
                type="button"
                onClick={() => onToggleComplete(lesson.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
                {isCompleted ? '已完成單元' : '標記為已完成'}
              </button>
            </div>

            {/* Segmented Mode Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('simulation')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'simulation'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                互動模擬實驗
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('principles')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'principles'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                核心原理解析
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                隨堂測驗（{lesson.quiz.length} 題）
              </button>
            </div>

            {/* Tab 1: Interactive Simulation */}
            {activeTab === 'simulation' && (
              <div className="space-y-4">
                <div className="bg-sky-50/70 border border-sky-200 rounded-lg px-4 py-3 text-xs sm:text-sm text-sky-950">
                  <span className="font-semibold">實驗觀察目標：</span>
                  {lesson.simulationFocus}
                </div>
                {renderSimulation()}
              </div>
            )}

            {/* Tab 2: Core Principles */}
            {activeTab === 'principles' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {lesson.principles.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
                    >
                      <h3 className="text-base font-bold text-slate-900">{p.heading}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{p.summary}</p>
                      {p.formula && (
                        <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 font-serif-math text-sm sm:text-base text-slate-900 overflow-x-auto">
                          {p.formula}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">本單元關鍵結論</h4>
                  <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                    {lesson.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {existingQuiz && !quizSubmitted && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-700 flex items-center justify-between">
                    <span>此單元歷史最高紀錄：</span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      {existingQuiz.score} / {existingQuiz.total} 題正確
                    </span>
                  </div>
                )}

                <div className="space-y-5">
                  {lesson.quiz.map((q, qIdx) => {
                    const userPick = selectedAnswers[q.id];
                    const isCorrect = userPick === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          第 {qIdx + 1} 題：{q.question}
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const picked = userPick === optIdx;
                            let optStyle =
                              'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
                              } else if (picked && optIdx !== q.correctIndex) {
                                optStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                              }
                            } else if (picked) {
                              optStyle = 'bg-sky-50 border-sky-600 text-sky-950 font-medium';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                }
                                className={`w-full text-left px-4 py-2.5 text-sm border rounded-lg transition-colors cursor-pointer disabled:cursor-default ${optStyle}`}
                              >
                                <span className="font-mono-tabular mr-2 text-xs text-slate-500">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div
                            className={`text-xs leading-relaxed p-3 rounded-lg border ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-amber-50 border-amber-200 text-amber-950'
                            }`}
                          >
                            <span className="font-semibold">
                              {isCorrect ? '回答正確：' : '解析提示：'}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 disabled:opacity-45 transition-colors cursor-pointer"
                    >
                      送出答案並檢核
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-sm font-semibold text-slate-900 font-mono-tabular">
                        本次測驗得分：
                        {
                          lesson.quiz.filter((q) => selectedAnswers[q.id] === q.correctIndex).length
                        }{' '}
                        / {lesson.quiz.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        重新作答
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lesson Prev / Next Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
              {prevLesson ? (
                <button
                  type="button"
                  onClick={() => onSelectCourseLesson(course.id, prevLesson.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  上一單元：{prevLesson.title}
                </button>
              ) : (
                <span />
              )}

              {nextLesson && (
                <button
                  type="button"
                  onClick={() => onSelectCourseLesson(course.id, nextLesson.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer"
                >
                  下一單元：{nextLesson.title}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone (4 cols): Syllabus Navigator & Quick Notes */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Course Chapters */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">課程章節目錄</h2>
              <span className="text-xs font-mono-tabular text-slate-500">
                {course.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length} /{' '}
                {course.lessons.length} 完成
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {course.lessons.map((item) => {
                const active = item.id === lesson.id;
                const done = progress.completedLessonIds.includes(item.id);
                const qScore = progress.quizScores[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectCourseLesson(course.id, item.id)}
                    className={`w-full text-left py-3 px-2.5 rounded-lg transition-colors flex items-start gap-3 cursor-pointer ${
                      active ? 'bg-sky-50 text-sky-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className={`text-xs font-semibold ${active ? 'text-sky-900' : 'text-slate-900'}`}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono-tabular">
                        <span>{item.durationMinutes} 分鐘</span>
                        {qScore && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>
                              測驗 {qScore.score}/{qScore.total}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Contextual Study Note Pad */}
          <form
            onSubmit={handleQuickNoteSave}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <NotebookPen className="w-4 h-4 text-sky-700" aria-hidden="true" />
                <span>隨堂研習筆記</span>
              </div>
              {noteSavedNotice && (
                <span className="text-xs font-medium text-emerald-700">已儲存至筆記本</span>
              )}
            </div>

            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="筆記標題"
              aria-label="筆記標題"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-sky-700"
            />

            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="記錄模擬觀察結果、疑問或推導重點..."
              aria-label="筆記內容"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:bg-white focus:border-sky-700 resize-y"
            />

            <button
              type="submit"
              disabled={!noteContent.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              儲存單元筆記
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
