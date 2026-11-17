import { useCallback, useEffect, useState } from 'react';
import { COURSES } from '../data/curriculum';
import { FlashcardStatus, LearningProgress, StudyNote } from '../types/learning';

const STORAGE_KEY = 'zhiyan_academy_progress_v1';

const DEFAULT_NOTES: StudyNote[] = [
  {
    id: 'note-welcome-1',
    courseId: 'bio-bohr-effect',
    lessonId: 'bio-lesson-2',
    title: '波耳效應與運動生理筆記',
    content:
      '肌肉高強度運動時，pH 從 7.40 降至約 7.15，PCO₂ 上升至 65 mmHg。此時 P50 顯著上升（曲線右移），讓血紅素在組織微血管加速釋放 O₂，同時肺部高氧端依然維持 94% 以上飽和度。',
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_PROGRESS: LearningProgress = {
  completedLessonIds: [],
  quizScores: {},
  flashcardStatuses: {},
  notes: DEFAULT_NOTES,
  lastVisitedCourseId: COURSES[0].id,
  lastVisitedLessonId: COURSES[0].lessons[0].id,
};

function loadProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      quizScores: parsed.quizScores ?? {},
      flashcardStatuses: parsed.flashcardStatuses ?? {},
      notes: Array.isArray(parsed.notes) ? parsed.notes : DEFAULT_NOTES,
      lastVisitedCourseId: parsed.lastVisitedCourseId || COURSES[0].id,
      lastVisitedLessonId: parsed.lastVisitedLessonId || COURSES[0].lessons[0].id,
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [progress]);

  const setLastVisited = useCallback((courseId: string, lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      lastVisitedCourseId: courseId,
      lastVisitedLessonId: lessonId,
    }));
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      return {
        ...prev,
        completedLessonIds: exists
          ? prev.completedLessonIds.filter((id) => id !== lessonId)
          : [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  const recordQuizScore = useCallback((lessonId: string, score: number, total: number) => {
    setProgress((prev) => {
      const existing = prev.quizScores[lessonId];
      const bestScore = existing ? Math.max(existing.score, score) : score;
      const shouldComplete = score === total && !prev.completedLessonIds.includes(lessonId);
      return {
        ...prev,
        completedLessonIds: shouldComplete
          ? [...prev.completedLessonIds, lessonId]
          : prev.completedLessonIds,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: {
            score: bestScore,
            total,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const setFlashcardStatus = useCallback((cardId: string, status: FlashcardStatus) => {
    setProgress((prev) => ({
      ...prev,
      flashcardStatuses: {
        ...prev.flashcardStatuses,
        [cardId]: status,
      },
    }));
  }, []);

  const saveNote = useCallback(
    (noteInput: { id?: string; courseId: string; lessonId?: string; title: string; content: string }) => {
      const now = new Date().toISOString();
      setProgress((prev) => {
        if (noteInput.id) {
          return {
            ...prev,
            notes: prev.notes.map((n) =>
              n.id === noteInput.id
                ? {
                    ...n,
                    courseId: noteInput.courseId,
                    lessonId: noteInput.lessonId,
                    title: noteInput.title,
                    content: noteInput.content,
                    updatedAt: now,
                  }
                : n
            ),
          };
        }
        const newNote: StudyNote = {
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          courseId: noteInput.courseId,
          lessonId: noteInput.lessonId,
          title: noteInput.title,
          content: noteInput.content,
          updatedAt: now,
        };
        return {
          ...prev,
          notes: [newNote, ...prev.notes],
        };
      });
    },
    []
  );

  const deleteNote = useCallback((noteId: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId),
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress({
      ...INITIAL_PROGRESS,
      notes: [],
    });
  }, []);

  return {
    progress,
    setLastVisited,
    toggleLessonComplete,
    markLessonComplete,
    recordQuizScore,
    setFlashcardStatus,
    saveNote,
    deleteNote,
    resetAllProgress,
  };
}
