import React, { useState } from "react";
import { 
  BookOpen, 
  Video, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Bot, 
  Award, 
  Atom, 
  Calculator, 
  Play,
  Layers,
  Sparkles,
  ChevronRight,
  Bookmark,
  Sigma,
  FileCheck2,
  Zap,
  Flame,
  ShieldCheck,
  X,
  Info
} from "lucide-react";
import { CourseLesson, GradeLevel, Subject, User, UserProgress, UserXpStats } from "../types";
import { calculateUserXp, calculateQuizXp, getLevelDetails, LEVEL_TITLES, XP_CONFIG } from "../utils/xpSystem";

interface StudentDashboardProps {
  currentUser: User;
  selectedGrade: GradeLevel;
  onChangeGrade: (grade: GradeLevel) => void;
  lessons: CourseLesson[];
  userProgress: UserProgress[];
  onSelectLesson: (lesson: CourseLesson) => void;
  onTakeQuiz: (lessonId: string) => void;
  onOpenDoubts: (initialQuery?: string) => void;
  onOpenPerformance: () => void;
  xpStats?: UserXpStats;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  selectedGrade,
  onChangeGrade,
  lessons,
  userProgress,
  onSelectLesson,
  onTakeQuiz,
  onOpenDoubts,
  onOpenPerformance,
  xpStats: passedXpStats,
}) => {
  const [activeSubjectTab, setActiveSubjectTab] = useState<"ALL" | Subject>("ALL");
  const [showXpModal, setShowXpModal] = useState(false);

  // Compute or use passed XP statistics
  const xpStats = passedXpStats || calculateUserXp(userProgress);

  // Filter lessons by grade & subject tab
  const gradeLessons = lessons.filter(l => l.class_level === selectedGrade);
  const displayedLessons = activeSubjectTab === "ALL" 
    ? gradeLessons 
    : gradeLessons.filter(l => l.subject === activeSubjectTab);

  // Compute stats
  const completedLessonIds = new Set(
    userProgress.filter(p => p.completed_status).map(p => p.course_id)
  );
  const totalInGrade = gradeLessons.length;
  const completedInGrade = gradeLessons.filter(l => completedLessonIds.has(l.id)).length;
  const gradeProgressPercent = totalInGrade > 0 ? Math.round((completedInGrade / totalInGrade) * 100) : 0;

  const mathLessons = gradeLessons.filter(l => l.subject === "Math");
  const scienceLessons = gradeLessons.filter(l => l.subject === "Science");
  const completedMath = mathLessons.filter(l => completedLessonIds.has(l.id)).length;
  const completedScience = scienceLessons.filter(l => completedLessonIds.has(l.id)).length;

  const mathPercent = mathLessons.length > 0 ? Math.round((completedMath / mathLessons.length) * 100) : 0;
  const sciencePercent = scienceLessons.length > 0 ? Math.round((completedScience / scienceLessons.length) * 100) : 0;

  // Recent lesson to resume
  const recentLesson = gradeLessons.find(l => !completedLessonIds.has(l.id)) || gradeLessons[0];

  const quickDoubtQuestions = [
    { label: "Prove √2 is an irrational number", subject: "Math" as Subject },
    { label: "Derive first equation of motion v = u + at", subject: "Science" as Subject },
    { label: "Explain Factor Theorem for cubic polynomials", subject: "Math" as Subject },
    { label: "Why is boiling a bulk phenomenon?", subject: "Science" as Subject },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Academic Command Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1524] via-[#162235] to-[#0c1524] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-800/80">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur text-xs font-semibold text-slate-300 border border-slate-700/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="tracking-wide">Academic Year 2026–27</span>
              <span className="text-slate-600">•</span>
              <span className="font-bold text-white tracking-wide">Class {selectedGrade} CBSE / ICSE Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display leading-[1.15]">
              Class {selectedGrade} STEM <br className="hidden sm:inline" />
              <span className="text-slate-200">Mastery Studio</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Welcome back, <strong className="text-white font-bold">{currentUser.name}</strong>. Master foundational mathematics proofs, chemistry concepts, and physical kinematics with structured video walk-throughs and diagnostic tests.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              {recentLesson && (
                <button
                  id="btn-resume-lesson"
                  onClick={() => onSelectLesson(recentLesson)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-accent font-black text-sm shadow-sm transition-all group cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>Resume Chapter {recentLesson.chapter_number}: {recentLesson.chapter_title.substring(0, 22)}...</span>
                </button>
              )}
              <button
                id="btn-ask-doubt-hero"
                onClick={() => onOpenDoubts()}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 backdrop-blur transition-all cursor-pointer shadow-xs"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Lyrik AI Doubt Tutor</span>
              </button>
            </div>
          </div>

          {/* Quick Syllabus Readiness Card inside Hero */}
          <div className="bg-[#111c2e]/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between min-w-[300px] shadow-2xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              <span className="flex items-center gap-2 text-white font-display">
                <Layers className="w-4 h-4 text-amber-400" /> Syllabus Readiness
              </span>
              <span className="text-white font-black bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                {gradeProgressPercent}%
              </span>
            </div>

            <div className="space-y-4 my-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
                  <span>Completed Modules</span>
                  <span className="font-bold text-white">{completedInGrade} of {totalInGrade} Chapters</span>
                </div>
                <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${gradeProgressPercent}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-center">
                  <div className="text-slate-400 font-semibold text-[11px] mb-0.5 flex items-center justify-center gap-1">
                    <Calculator className="w-3 h-3 text-[#7ea6c9]" /> Math
                  </div>
                  <span className="font-black text-white text-sm">{completedMath}/{mathLessons.length}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Chapters</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-center">
                  <div className="text-slate-400 font-semibold text-[11px] mb-0.5 flex items-center justify-center gap-1">
                    <Atom className="w-3 h-3 text-[#87b89e]" /> Science
                  </div>
                  <span className="font-black text-white text-sm">{completedScience}/{scienceLessons.length}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Chapters</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenPerformance}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 pt-3 border-t border-slate-800/80 transition-colors cursor-pointer group"
            >
              <span>View Full Academic Transcript</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* USER EXPERIENCE PROGRESS BAR & XP POINT SYSTEM */}
      <div id="student-xp-progress-section" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/30 via-amber-100/10 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="relative z-10 space-y-5">
          {/* Header Row: Level Emblem, Rank Title, and Total Experience */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* High-contrast Level Emblem */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-md border-2 border-amber-300">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90 leading-none">Level</span>
                  <span className="text-2xl leading-tight font-black font-display">{xpStats.currentLevel}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-slate-700 shadow-xs">
                  XP
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    {xpStats.levelTitle}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Tier {xpStats.currentLevel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Complete syllabus lessons and score high on chapter diagnostic quizzes to level up your scholar standing.
                </p>
              </div>
            </div>

            {/* Quick Experience Badges and Rules trigger */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <div className="px-3.5 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Experience</div>
                <div className="text-lg font-black text-slate-900 font-display flex items-center justify-end gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{xpStats.totalXp.toLocaleString()} XP</span>
                </div>
              </div>
              <button
                id="btn-open-xp-rules"
                onClick={() => setShowXpModal(true)}
                className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="View XP points distribution rules"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>XP Rules</span>
              </button>
            </div>
          </div>

          {/* Core Experience Progress Bar */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <span>Level {xpStats.currentLevel} Progress:</span>
                <span className="text-amber-700 font-extrabold">{xpStats.currentLevelXp} / {xpStats.xpForNextLevel} XP</span>
                <span className="text-slate-400 font-normal">({xpStats.xpToNextLevel} XP needed for Level {xpStats.currentLevel + 1})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">Next Milestone:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                  Level {xpStats.currentLevel + 1} • {xpStats.nextLevelTitle}
                </span>
                <span className="font-black font-mono text-xs bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-md">
                  {xpStats.progressPercent}%
                </span>
              </div>
            </div>

            {/* Custom Styled Experience Track */}
            <div className="relative">
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                <div 
                  id="student-xp-progress-bar"
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full transition-all duration-700 relative shadow-xs"
                  style={{ width: `${Math.max(4, xpStats.progressPercent)}%` }}
                />
              </div>

              {/* Milestone Ticks */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1.5 px-1">
                <span>0% (Lv. {xpStats.currentLevel})</span>
                <span className="hidden sm:inline">25%</span>
                <span>50%</span>
                <span className="hidden sm:inline">75%</span>
                <span className="text-amber-800 font-bold">100% (Lv. {xpStats.currentLevel + 1})</span>
              </div>
            </div>
          </div>

          {/* 4 Point Distribution and Activity Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#365b49]" /> Lessons Completed
                </span>
                <span className="text-[10px] font-bold bg-[#edf4f0] text-[#254636] px-1.5 py-0.2 rounded">
                  +150 XP
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 font-display">
                {xpStats.completedLessonsCount} <span className="text-xs font-normal text-slate-500">Modules</span>
              </div>
              <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                +{xpStats.lessonXp} XP earned
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Quizzes Mastered
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                  Up to +300 XP
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 font-display">
                {xpStats.completedQuizzesCount} <span className="text-xs font-normal text-slate-500">Passed</span>
              </div>
              <div className="text-[11px] font-bold text-amber-800 mt-0.5">
                +{xpStats.quizXp} XP earned
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Study Streak
                </span>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 font-display">
                3 Days <span className="text-xs font-normal text-slate-500">Streak</span>
              </div>
              <div className="text-[11px] font-bold text-rose-600 mt-0.5">
                +{xpStats.bonusXp} XP streak bonus
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#334e68]" /> Next Milestone
                </span>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                  Lv. {xpStats.currentLevel + 1}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                {xpStats.nextLevelTitle}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {getLevelDetails(xpStats.currentLevel + 1).perk}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Selector & Academic Pillars (3 Balanced Bento Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Class Level Selector Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-display">Target Syllabus</div>
            <div className="text-lg font-black text-slate-900 font-display">Class {selectedGrade} Academic Track</div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Standardized with CBSE & ICSE board patterns, textbook theorems, and formative assessments.
            </p>
          </div>
          <div className="mt-5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Switch Grade Level:</div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {([8, 9, 10] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  id={`dashboard-grade-btn-${g}`}
                  onClick={() => onChangeGrade(g)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    selectedGrade === g
                      ? "bg-white text-slate-950 shadow-xs font-black border border-slate-300"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Class {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mathematics Module Progress */}
        <div 
          onClick={() => setActiveSubjectTab("Math")}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-display">
              <span className="flex items-center gap-1.5 text-[#243b53] font-bold">
                <Calculator className="w-4 h-4 text-[#334e68]" /> Mathematics Department
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {completedMath}/{mathLessons.length} Mastered
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-display mt-2">
              {mathPercent}% Completed
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-1">
              Polynomials, Linear Equations, Real Numbers & Coordinate Geometry.
            </p>
          </div>

          <div className="mt-5">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#334e68] rounded-full transition-all duration-500" style={{ width: `${mathPercent}%` }} />
            </div>
            <div className="text-xs text-[#334e68] font-bold mt-2.5 flex items-center justify-between">
              <span>View Math Modules ({mathLessons.length})</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Science Module Progress */}
        <div 
          onClick={() => setActiveSubjectTab("Science")}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-display">
              <span className="flex items-center gap-1.5 text-[#254636] font-bold">
                <Atom className="w-4 h-4 text-[#365b49]" /> Science Department
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {completedScience}/{scienceLessons.length} Mastered
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-display mt-2">
              {sciencePercent}% Completed
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-1">
              Physics Motion & Forces, Chemistry Matter, Biology Fundamentals.
            </p>
          </div>

          <div className="mt-5">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#365b49] rounded-full transition-all duration-500" style={{ width: `${sciencePercent}%` }} />
            </div>
            <div className="text-xs text-[#365b49] font-bold mt-2.5 flex items-center justify-between">
              <span>View Science Modules ({scienceLessons.length})</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Subject Tabs & Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-display mb-0.5">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>Academic Curriculum Modules</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Class {selectedGrade} Syllabus & Coursework
          </h2>
          <p className="text-xs text-slate-500">
            Each chapter includes video lecture walkthroughs, core formula sheets, and chapter diagnostic assessments.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto shadow-2xs">
          <button
            id="tab-all-subjects"
            onClick={() => setActiveSubjectTab("ALL")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubjectTab === "ALL"
                ? "bg-white text-slate-950 shadow-xs font-black border border-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Modules ({gradeLessons.length})
          </button>
          <button
            id="tab-math-subject"
            onClick={() => setActiveSubjectTab("Math")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubjectTab === "Math"
                ? "bg-white text-[#243b53] shadow-xs font-black border border-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-[#334e68]" />
            <span>Mathematics ({mathLessons.length})</span>
          </button>
          <button
            id="tab-science-subject"
            onClick={() => setActiveSubjectTab("Science")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubjectTab === "Science"
                ? "bg-white text-[#254636] shadow-xs font-black border border-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Atom className="w-3.5 h-3.5 text-[#365b49]" />
            <span>Science ({scienceLessons.length})</span>
          </button>
        </div>
      </div>

      {/* Chapters Grid with Academic Card Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedLessons.map((lesson) => {
          const prog = userProgress.find(p => p.course_id === lesson.id);
          const isCompleted = prog?.completed_status;
          const score = prog?.quiz_score;
          const isMath = lesson.subject === "Math";

          return (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    isMath ? "badge-steel" : "badge-sage"
                  }`}>
                    {isMath ? <Calculator className="w-3 h-3 text-[#334e68]" /> : <Atom className="w-3 h-3 text-[#365b49]" />}
                    <span>{lesson.subject} • Chapter {lesson.chapter_number}</span>
                  </span>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#254636] bg-[#edf4f0] border border-[#c4d7cd] px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#365b49]" /> Mastered
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {lesson.duration}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug font-display group-hover:text-[#334e68] transition-colors">
                  {lesson.chapter_title}
                </h3>
                
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {lesson.topic}
                </p>

                {/* Key formula preview */}
                {lesson.key_formulas && lesson.key_formulas.length > 0 && (
                  <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-stem shrink-0">
                      Theorem:
                    </span>
                    <span className="font-stem font-bold text-slate-800 text-[11px] truncate bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {lesson.key_formulas[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Assessment Status and Buttons */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Diagnostic Status:</span>
                  {score !== undefined && score !== null ? (
                    <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                      score >= 80 ? "bg-[#edf4f0] text-[#254636] border border-[#c4d7cd]" : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}>
                      {score}% Accuracy
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px] font-semibold">Diagnostic Quiz Pending</span>
                  )}
                </div>

                {/* XP Reward Indicator */}
                <div className="flex items-center justify-between text-[11px] font-semibold pt-0.5">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> XP Rewards:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="text-[10px] font-bold bg-[#edf4f0] text-[#254636] border border-[#c4d7cd] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#365b49]" /> +150 XP Lesson
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        +150 XP Lesson
                      </span>
                    )}
                    {score !== undefined && score !== null ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-md">
                        +{calculateQuizXp(score)} XP Quiz
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md">
                        +250 XP Quiz
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id={`btn-watch-${lesson.id}`}
                    onClick={() => onSelectLesson(lesson)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 shadow-2xs transition-all cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-slate-600" />
                    <span>Watch Lesson</span>
                  </button>
                  <button
                    id={`btn-quiz-${lesson.id}`}
                    onClick={() => onTakeQuiz(lesson.id)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black btn-accent shadow-2xs transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-950" />
                    <span>{score !== undefined && score !== null ? "Retake Quiz" : "Chapter Quiz"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 24/7 AI STEM Tutor Homework Banner with Quick Prompts */}
      <div className="bg-gradient-to-br from-[#0c1524] via-[#14232f] to-[#0c1524] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-bold border border-slate-700 shadow-xs">
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="tracking-wide">Lyrik Pedagogical AI Tutor • Class {selectedGrade} Syllabus</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight leading-snug">
              Stuck on a Complex Formula or Science Derivation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Get immediate, step-by-step guidance tailored to Class {selectedGrade} CBSE & ICSE standards. Ask questions or test hypotheses with real-time academic explanations.
            </p>

            {/* Quick Prompt Chips */}
            <div className="pt-2 flex flex-wrap gap-2">
              {quickDoubtQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenDoubts(q.label)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-medium border border-slate-700 backdrop-blur transition-all flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenDoubts()}
            className="shrink-0 px-6 py-3 rounded-xl btn-accent font-black text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>Launch AI Doubt Solver →</span>
          </button>
        </div>
      </div>

      {/* XP Rules & Tier Milestones Modal */}
      {showXpModal && (
        <div 
          id="xp-rules-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Award className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    Scholar Experience & XP Point System
                  </h3>
                  <p className="text-xs text-slate-500">
                    How experience points, rank badges, and academic leveling work in Lyrik
                  </p>
                </div>
              </div>
              <button
                id="btn-close-xp-modal"
                onClick={() => setShowXpModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Point Distribution Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Point Earning Rules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">Complete Video Lesson</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{XP_CONFIG.XP_PER_LESSON} XP
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-slate-800">Complete Chapter Quiz</span>
                  </div>
                  <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    +{XP_CONFIG.XP_BASE_QUIZ} XP base
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">Quiz Accuracy Multiplier</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    +2 XP per 1%
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-slate-800">100% Perfect Quiz Bonus</span>
                  </div>
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    +{XP_CONFIG.XP_PERFECT_SCORE_BONUS} XP
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold text-slate-800">Daily Study Streak</span>
                  </div>
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    +{XP_CONFIG.DAILY_STREAK_BONUS} XP
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">STEM Doubt Inquiry</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    +{XP_CONFIG.AI_DOUBT_BONUS} XP
                  </span>
                </div>
              </div>
            </div>

            {/* All Levels & Perks */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scholar Tiers & Milestone Privileges ({XP_CONFIG.XP_PER_LEVEL} XP per Level)
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {LEVEL_TITLES.map((tier) => {
                  const isCurrent = tier.minLevel === xpStats.currentLevel;
                  const isUnlocked = tier.minLevel <= xpStats.currentLevel;
                  return (
                    <div
                      key={tier.minLevel}
                      className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                        isCurrent
                          ? "bg-amber-50/80 border-amber-300 shadow-xs"
                          : isUnlocked
                          ? "bg-white border-slate-200"
                          : "bg-slate-50/50 border-slate-100 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isCurrent
                            ? "bg-amber-500 text-slate-950 font-black shadow-2xs"
                            : isUnlocked
                            ? "bg-slate-200 text-slate-800"
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {tier.minLevel}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 font-display">
                              {tier.badge} Level {tier.minLevel}: {tier.title}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{tier.perk}</div>
                        </div>
                      </div>
                      <span className="font-mono text-slate-400 font-semibold shrink-0 ml-2">
                        {(tier.minLevel - 1) * XP_CONFIG.XP_PER_LEVEL} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              id="btn-confirm-xp-modal"
              onClick={() => setShowXpModal(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            >
              Got It • Back to Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

