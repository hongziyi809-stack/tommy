export type Discipline = '自然科學' | '數學幾何' | '資訊工程' | '物理波動';

export type SimulationKind = 'bohr-effect' | 'golden-ratio' | 'algorithm-lab' | 'wave-interference';

export type AppView = 'catalog' | 'workspace' | 'flashcards' | 'notes';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonPrinciple {
  heading: string;
  summary: string;
  formula?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  simulationKind: SimulationKind;
  simulationFocus: string;
  principles: LessonPrinciple[];
  keyTakeaways: string[];
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  discipline: Discipline;
  level: '入門' | '進階';
  estimatedMinutes: number;
  coverImage: string;
  coverAlt: string;
  instructor: string;
  lessons: Lesson[];
}

export interface Flashcard {
  id: string;
  discipline: Discipline;
  courseId: string;
  term: string;
  formula?: string;
  definition: string;
  example: string;
}

export interface StudyNote {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  content: string;
  updatedAt: string;
}

export type FlashcardStatus = 'new' | 'review' | 'mastered';

export interface LearningProgress {
  completedLessonIds: string[];
  quizScores: Record<string, { score: number; total: number; updatedAt: string }>;
  flashcardStatuses: Record<string, FlashcardStatus>;
  notes: StudyNote[];
  lastVisitedCourseId: string;
  lastVisitedLessonId: string;
}
