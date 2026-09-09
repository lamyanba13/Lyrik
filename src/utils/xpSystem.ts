import { UserProgress, UserXpStats } from "../types";

export const XP_CONFIG = {
  XP_PER_LESSON: 150,
  XP_BASE_QUIZ: 100,
  XP_PER_PERCENT: 2, // e.g. 80% = 160 XP
  XP_PERFECT_SCORE_BONUS: 50, // 100% score bonus
  XP_PER_LEVEL: 500,
  DAILY_STREAK_BONUS: 50,
  AI_DOUBT_BONUS: 25,
};

export const LEVEL_TITLES: { minLevel: number; title: string; badge: string; perk: string }[] = [
  { minLevel: 1, title: "Novice Scholar", badge: "🌱", perk: "Access to Class 8-10 syllabus video walkthroughs" },
  { minLevel: 2, title: "STEM Inquirer", badge: "🔍", perk: "Unlocks personalized formula notebooks & doubt history" },
  { minLevel: 3, title: "Formula Specialist", badge: "📐", perk: "Unlocks advanced algebraic derivations & speed solver" },
  { minLevel: 4, title: "Theorem Master", badge: "⚡", perk: "Unlocks chapter milestone certificates & priority teacher queue" },
  { minLevel: 5, title: "Hypothesis Explorer", badge: "🔬", perk: "Unlocks Olympiad-level STEM diagnostic test banks" },
  { minLevel: 6, title: "Laboratory Pioneer", badge: "🧪", perk: "Unlocks multi-concept cross-subject practical challenges" },
  { minLevel: 7, title: "STEM Olympian", badge: "🏆", perk: "Lyrik STEM Top 5% Honors badge on school transcript" },
  { minLevel: 8, title: "Academic Luminary", badge: "👑", perk: "Peer mentor designation and full curriculum mastery" },
];

export function getLevelDetails(level: number) {
  const matching = [...LEVEL_TITLES].reverse().find(t => level >= t.minLevel);
  return matching || LEVEL_TITLES[0];
}

export function calculateQuizXp(score: number | null): number {
  if (score === null || score === undefined) return 0;
  let xp = XP_CONFIG.XP_BASE_QUIZ + Math.round(score * XP_CONFIG.XP_PER_PERCENT);
  if (score >= 100) {
    xp += XP_CONFIG.XP_PERFECT_SCORE_BONUS;
  }
  return xp;
}

export function calculateUserXp(
  userProgress: UserProgress[],
  bonusXp = 0
): UserXpStats {
  const completedLessons = userProgress.filter(p => p.completed_status);
  const completedLessonsCount = completedLessons.length;
  const lessonXp = completedLessonsCount * XP_CONFIG.XP_PER_LESSON;

  const attemptedQuizzes = userProgress.filter(p => p.quiz_score !== null && p.quiz_score !== undefined);
  const completedQuizzesCount = attemptedQuizzes.length;
  const quizXp = attemptedQuizzes.reduce((acc, p) => acc + calculateQuizXp(p.quiz_score), 0);

  const totalXp = lessonXp + quizXp + bonusXp;

  const currentLevel = Math.max(1, Math.floor(totalXp / XP_CONFIG.XP_PER_LEVEL) + 1);
  const currentLevelXp = totalXp % XP_CONFIG.XP_PER_LEVEL;
  const xpForNextLevel = XP_CONFIG.XP_PER_LEVEL;
  const xpToNextLevel = xpForNextLevel - currentLevelXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / xpForNextLevel) * 100)));

  const levelInfo = getLevelDetails(currentLevel);
  const nextLevelInfo = getLevelDetails(currentLevel + 1);

  return {
    totalXp,
    currentLevel,
    currentLevelXp,
    xpForNextLevel,
    xpToNextLevel,
    progressPercent,
    levelTitle: levelInfo.title,
    nextLevelTitle: nextLevelInfo.title,
    completedLessonsCount,
    completedQuizzesCount,
    lessonXp,
    quizXp,
    bonusXp,
  };
}
