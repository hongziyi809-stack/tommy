import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { COURSES } from '../data/curriculum';
import { LearningProgress, StudyNote } from '../types/learning';

interface StudyNotesViewProps {
  progress: LearningProgress;
  onSaveNote: (input: {
    id?: string;
    courseId: string;
    lessonId?: string;
    title: string;
    content: string;
  }) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenCourse: (courseId: string, lessonId?: string) => void;
  onResetProgress: () => void;
}

export function StudyNotesView({
  progress,
  onSaveNote,
  onDeleteNote,
  onOpenCourse,
  onResetProgress,
}: StudyNotesViewProps) {
  const [filterCourseId, setFilterCourseId] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [confirmReset, setConfirmReset] = useState(false);

  const startNewNote = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCourseId(filterCourseId !== 'all' ? filterCourseId : COURSES[0].id);
  };

  const startEdit = (note: StudyNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCourseId(note.courseId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSaveNote({
      id: editingNote?.id,
      courseId,
      lessonId: editingNote?.lessonId,
      title: title.trim(),
      content: content.trim(),
    });
    startNewNote();
  };

  const filteredNotes =
    filterCourseId === 'all'
      ? progress.notes
      : progress.notes.filter((n) => n.courseId === filterCourseId);

  const getCourseTitle = (id: string) => COURSES.find((c) => c.id === id)?.title ?? '未分類課程';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">個人研習筆記與學習紀錄</h1>
          <p className="text-sm text-slate-600 mt-1">
            整理各學科的實驗觀察與推導心得，並檢視單元完成及隨堂測驗紀錄。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              重設學習紀錄
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
              <span className="text-xs text-rose-900 font-medium">確定清除全部進度？</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-700 rounded hover:bg-rose-800 cursor-pointer"
              >
                確認重設
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Grid: Editor + Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Note Editor */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {editingNote ? '編輯現有筆記' : '新增研習筆記'}
            </h2>
            {editingNote && (
              <button
                type="button"
                onClick={startNewNote}
                className="text-xs font-medium text-sky-700 hover:text-sky-800 cursor-pointer"
              >
                改為新增筆記
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="note-course" className="text-xs font-medium text-slate-700 block">
              關聯課程
            </label>
            <select
              id="note-course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-sky-700 cursor-pointer"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.discipline} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="note-title" className="text-xs font-medium text-slate-700 block">
              筆記標題
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：波耳效應曲線右移條件整理"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-sky-700"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="note-body" className="text-xs font-medium text-slate-700 block">
              筆記內容
            </label>
            <textarea
              id="note-body"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="撰寫您的公式推導、實驗現象或易錯觀念..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed focus:outline-none focus:bg-white focus:border-sky-700 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 disabled:opacity-45 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {editingNote ? '更新筆記內容' : '儲存新筆記'}
          </button>
        </form>

        {/* Right: Saved Notes List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">
              已保存筆記（<span className="font-mono-tabular">{filteredNotes.length}</span> 篇）
            </h2>
            <select
              aria-label="依課程篩選筆記"
              value={filterCourseId}
              onChange={(e) => setFilterCourseId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
            >
              <option value="all">全部課程筆記</option>
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
              目前尚無符合篩選條件的學習筆記，可從左側新增或在互動實驗室隨堂記錄。
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <article
                  key={note.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenCourse(note.courseId, note.lessonId)}
                          className="font-medium text-sky-700 hover:underline cursor-pointer"
                        >
                          {getCourseTitle(note.courseId)}
                        </button>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">
                          {new Date(note.updatedAt).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{note.title}</h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        aria-label={`編輯筆記 ${note.title}`}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        aria-label={`刪除筆記 ${note.title}`}
                        className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Progress Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">各課程學習達成與評量總表</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-3 pr-4 font-medium">學科</th>
                <th className="py-3 px-4 font-medium">課程名稱</th>
                <th className="py-3 px-4 font-medium text-right">單元完成</th>
                <th className="py-3 px-4 font-medium text-right">完成率</th>
                <th className="py-3 pl-4 font-medium text-right">快速前往</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COURSES.map((course) => {
                const done = course.lessons.filter((l) =>
                  progress.completedLessonIds.includes(l.id)
                ).length;
                const total = course.lessons.length;
                const pct = Math.round((done / total) * 100);
                return (
                  <tr key={course.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 pr-4 text-xs font-medium text-sky-700 whitespace-nowrap">
                      {course.discipline}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{course.title}</td>
                    <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700">
                      {done} / {total}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-tabular font-semibold text-slate-900">
                      {pct}%
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenCourse(course.id, course.lessons[0].id)}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer whitespace-nowrap"
                      >
                        開啟課程
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
