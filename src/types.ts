export type UserRole = 'student' | 'teacher' | 'parent';
export type GradeLevel = 8 | 9 | 10;
export type Subject = 'Math' | 'Science';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  grade?: GradeLevel;
  email: string;
  avatarUrl?: string;
  linkedStudentId?: string; // For parent role to monitor a student
}

export interface TimestampedNote {
  timestamp: number; // in seconds
  timestampFormatted: string; // e.g. "01:45"
  label: string;
  text: string;
}

export interface CourseLesson {
  id: string;
  class_level: GradeLevel;
  subject: Subject;
  chapter_number: number;
  chapter_title: string;
  topic: string;
  duration: string;
  duration_seconds: number;
  video_url: string;
  thumbnail_url?: string;
  transcript: string;
  notes: TimestampedNote[];
  summary: string[];
  key_formulas?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  chapter_title: string;
  class_level: GradeLevel;
  subject: Subject;
  time_limit_minutes: number;
  questions: QuizQuestion[];
}

export interface UserProgress {
  user_id: string;
  course_id: string;
  quiz_score: number | null; // percentage e.g. 85, or null if unattempted
  completed_status: boolean;
  time_spent_minutes: number;
  last_accessed: string;
  quiz_attempts?: number;
}

export interface UserXpStats {
  totalXp: number;
  currentLevel: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  levelTitle: string;
  nextLevelTitle: string;
  completedLessonsCount: number;
  completedQuizzesCount: number;
  lessonXp: number;
  quizXp: number;
  bonusXp: number;
}

export interface DoubtMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  subject?: Subject;
  class_level?: GradeLevel;
  keyPoints?: string[];
  formula?: string;
  imageUrl?: string;
}

export interface DoubtNotification {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  subject: Subject;
  question: string;
  answer?: string;
  status: 'pending' | 'resolved' | 'ai_answered';
  timestamp: string;
}

export interface TeacherAnalytics {
  totalStudents: number;
  averageQuizScore: number;
  class8Stats: { studentCount: number; avgMath: number; avgScience: number };
  class9Stats: { studentCount: number; avgMath: number; avgScience: number };
  class10Stats: { studentCount: number; avgMath: number; avgScience: number };
  pendingDoubtsCount: number;
  subjectHeatmap: {
    topic: string;
    grade: GradeLevel;
    subject: Subject;
    masteryPercent: number;
    difficultyRating: 'Low' | 'Medium' | 'High';
  }[];
}

export interface ParentAlert {
  id: string;
  topic: string;
  subject: Subject;
  severity: 'warning' | 'info' | 'urgent';
  message: string;
  recommendedAction: string;
  timestamp: string;
}

export interface ParentReport {
  student: User;
  totalStudyHoursThisWeek: number;
  quizzesCompleted: number;
  averageAccuracy: number;
  alerts?: ParentAlert[];
  scoreProgression: {
    week: string;
    mathScore: number;
    scienceScore: number;
  }[];
  subjectMastery: {
    subject: Subject;
    masteryRate: number;
    strengths: string[];
    focusAreas: string[];
  }[];
  recentActivity: {
    id: string;
    activity: string;
    chapter: string;
    subject: Subject;
    date: string;
    scoreOrDuration: string;
  }[];
}
