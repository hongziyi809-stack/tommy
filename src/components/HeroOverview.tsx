import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { COURSES, DISCIPLINES, FLASHCARDS } from '../data/curriculum';
import { Course, Discipline, LearningProgress } from '../types/learning';
import { SafeImage } from './SafeImage';

interface HeroOverviewProps {
  progress: LearningProgress;
  onSelectCourse: (courseId: string, lessonId?: string) => void;
  onOpenFlashcards: () => void;
}

export function HeroOverview({ progress, onSelectCourse, onOpenFlashcards }: HeroOverviewProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<'全部學科' | Discipline>('全部學科');
  const [searchQuery, setSearchQuery] = useState('');

  const totalLessons = useMemo(
    () => COURSES.reduce((sum, c) => sum + c.lessons.length, 0),
    []
  );

  const completedCount = progress.completedLessonIds.length;
  const masteredFlashcardsCount = Object.values(progress.flashcardStatuses).filter(
    (s) => s === 'mastered'
  ).length;
  const completedQuizzesCount = Object.keys(progress.quizScores).length;

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COURSES.filter((course) => {
      const matchesDiscipline =
        selectedDiscipline === '全部學科' || course.discipline === selectedDiscipline;
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.subtitle.toLowerCase().includes(q) ||
        course.discipline.toLowerCase().includes(q);
      return matchesDiscipline && matchesSearch;
    });
  }, [selectedDiscipline, searchQuery]);

  const getCourseProgress = (course: Course) => {
    const done = course.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
    return {
      done,
      total: course.lessons.length,
      pct: Math.round((done / course.lessons.length) * 100),
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      {/* Above-the-Fold 2-Column Editorial Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="text-sm font-medium text-sky-700">
            跨學科互動研習平台 · 自然科學、數學、資訊工程與物理
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-900 leading-[1.2] text-balance">
            透過即時互動模擬，把抽象定理化為直覺理解
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            不用死記靜態公式。在這裡你可以親手調整參數、單步追蹤演算法、翻轉間隔記憶字卡並記錄個人研習筆記，建立紮實的系統性知識。
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                onSelectCourse(progress.lastVisitedCourseId, progress.lastVisitedLessonId)
              }
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              進入互動課程
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenFlashcards}
              className="px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              複習記憶字卡
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] lg:min-h-[380px] rounded-xl overflow-hidden border border-slate-200 bg-white">
            <SafeImage
              src="/src/assets/images/hero_learning_studio_1794897688566.jpg"
              alt="明亮現代大學研習圖書館與幾何製圖研究工作桌"
              fallbackTitle="知研學苑互動研習空間"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Learning Telemetry Strip */}
      <section
        aria-label="學習進度摘要"
        className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 bg-white rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-slate-200"
      >
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">課程單元完成度</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {completedCount} / {totalLessons}
            </span>
            <span className="text-xs text-slate-500">個單元</span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">隨堂測驗通過</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {completedQuizzesCount} / {totalLessons}
            </span>
            <span className="text-xs text-slate-500">份評量</span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">記憶字卡精熟數</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {masteredFlashcardsCount} / {FLASHCARDS.length}
            </span>
            <span className="text-xs text-slate-500">張概念卡</span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">個人研習筆記</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono-tabular">
              {progress.notes.length}
            </span>
            <span className="text-xs text-slate-500">篇筆記</span>
          </div>
        </div>
      </section>

      {/* Course Catalog Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">互動核心課程</h2>
            <p className="text-sm text-slate-600 mt-1">
              每門課程皆配備即時參數模擬器、結構化核心原理與隨堂檢核測驗。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋課程主題或關鍵字..."
                aria-label="搜尋課程"
                className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700/20 focus:border-sky-700 w-full sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Interactive Discipline Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
          {DISCIPLINES.map((disc) => {
            const active = selectedDiscipline === disc;
            return (
              <button
                key={disc}
                type="button"
                onClick={() => setSelectedDiscipline(disc)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {disc}
              </button>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-700">找不到符合條件的課程內容</p>
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('全部學科');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
            >
              顯示全部課程
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const stats = getCourseProgress(course);
              return (
                <article
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
                >
                  <div className="aspect-[16/9] bg-slate-100 border-b border-slate-200 overflow-hidden">
                    <SafeImage
                      src={course.coverImage}
                      alt={course.coverAlt}
                      fallbackTitle={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2.5">
                      {/* Clean unboxed metadata with typographic separators */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-sky-700">{course.discipline}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.level}程度</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{course.lessons.length} 個單元</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">約 {course.estimatedMinutes} 分鐘</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">{course.subtitle}</p>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{course.instructor}</span>
                          <span className="font-mono-tabular font-medium text-slate-700 inline-flex items-center gap-1">
                            {stats.done === stats.total && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            已完成 {stats.done} / {stats.total} 單元 ({stats.pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-700 transition-all duration-300"
                            style={{ width: `${stats.pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectCourse(course.id, course.lessons[0].id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {stats.done > 0 ? '繼續學習單元' : '開始第一單元'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs text-slate-500 truncate">
                          首章：{course.lessons[0].title}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
