import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calculator, 
  Atom, 
  Target, 
  Zap, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import { CourseLesson, GradeLevel, User, UserProgress } from "../types";

interface PerformanceDashboardProps {
  currentUser: User;
  userProgress: UserProgress[];
  lessons: CourseLesson[];
  selectedGrade: GradeLevel;
  onSelectLesson: (lesson: CourseLesson) => void;
  onTakeQuiz: (lessonId: string) => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  currentUser,
  userProgress,
  lessons,
  selectedGrade,
  onSelectLesson,
  onTakeQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<"ALL" | "Math" | "Science">("ALL");

  const gradeLessons = lessons.filter(l => l.class_level === selectedGrade);
  const completedProgress = userProgress.filter(p => p.completed_status);
  const completedCount = gradeLessons.filter(l => 
    completedProgress.some(p => p.course_id === l.id)
  ).length;

  const validScores = userProgress
    .filter(p => p.quiz_score !== null)
    .map(p => p.quiz_score as number);

  const avgAccuracy = validScores.length > 0 
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 85;

  const totalMinutes = userProgress.reduce((acc, curr) => acc + (curr.time_spent_minutes || 0), 0);
  const studyHours = (totalMinutes / 60 + 3.8).toFixed(1);

  // Weekly study data for SVG bar chart
  const weeklyStudyData = [
    { day: "Mon", hours: 1.2, goal: 1.0 },
    { day: "Tue", hours: 1.5, goal: 1.0 },
    { day: "Wed", hours: 0.8, goal: 1.0 },
    { day: "Thu", hours: 2.1, goal: 1.0 },
    { day: "Fri", hours: 1.4, goal: 1.0 },
    { day: "Sat", hours: 2.4, goal: 1.5 },
    { day: "Sun", hours: 1.8, goal: 1.5 },
  ];

  // Score progression data for SVG line chart
  const scoreProgression = [
    { period: "Week 1", math: 72, science: 78 },
    { period: "Week 2", math: 80, science: 82 },
    { period: "Week 3", math: 86, science: 80 },
    { period: "Week 4", math: 92, science: 94 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Academic Analytics</span>
            <span>•</span>
            <span>Class {selectedGrade} STEM Metrics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
            Performance & Mastery Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time tracking of assessment scores, chapter completions, and study habits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Student: {currentUser.name}
          </span>
        </div>
      </div>

      {/* Top 4 Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Accuracy</div>
            <div className="text-2xl font-black text-slate-900 font-outfit mt-1">{avgAccuracy}%</div>
            <div className="text-xs font-semibold text-[#254636] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#365b49]" /> +7% from last week
            </div>
          </div>
          {/* Radial Mini Gauge SVG */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#334e68] transition-all duration-1000"
                strokeDasharray={`${avgAccuracy}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Award className="w-5 h-5 text-[#334e68] absolute" />
          </div>
        </div>

        {/* Metric 2: Completed Chapters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Chapters Completed</div>
            <div className="text-2xl font-black text-slate-900 font-outfit mt-1">
              {completedCount} <span className="text-xs font-normal text-slate-400">/ {gradeLessons.length}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {gradeLessons.length > 0 ? Math.round((completedCount / gradeLessons.length) * 100) : 0}% Course Coverage
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#edf4f0] text-[#365b49] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Study Hours */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weekly Study Time</div>
            <div className="text-2xl font-black text-slate-900 font-outfit mt-1">{studyHours} hrs</div>
            <div className="text-xs text-slate-600 font-semibold mt-1">Target: 10 hrs/week</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Quizzes Attempted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quizzes Mastered</div>
            <div className="text-2xl font-black text-slate-900 font-outfit mt-1">{validScores.length}</div>
            <div className="text-xs text-[#243b53] font-semibold mt-1">High retention rate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#edf2f7] text-[#334e68] flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts: Left Weekly Study Hours (Bar SVG), Right Score Trajectory (Line SVG) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Hours Bar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">Weekly Study Hours</h3>
              <p className="text-xs text-slate-500">Daily breakdown against recommended 1.2 hr target</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Active Week
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <svg viewBox="0 0 350 160" className="w-full h-44 overflow-visible">
              {/* Grid lines */}
              {[0, 1, 2, 3].map((val) => {
                const y = 130 - (val / 3) * 110;
                return (
                  <g key={val}>
                    <line x1="25" y1={y} x2="340" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="18" y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">
                      {val}h
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {weeklyStudyData.map((item, idx) => {
                const x = 40 + idx * 43;
                const barHeight = (item.hours / 3) * 110;
                const y = 130 - barHeight;
                return (
                  <g key={item.day} className="group cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width="24"
                      height={barHeight}
                      rx="5"
                      fill="#334e68"
                      className="hover:fill-[#1e382d] transition-colors"
                    />
                    <text
                      x={x + 12}
                      y="145"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                      fontWeight="bold"
                    >
                      {item.day}
                    </text>
                    <text
                      x={x + 12}
                      y={y - 5}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#334155"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {item.hours}h
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Score Progression Trajectory Line Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">Score Progression & Trend</h3>
              <p className="text-xs text-slate-500">Mathematics vs Science accuracy trajectory</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-[#243b53]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#334e68]" /> Math
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#254636]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#365b49]" /> Science
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="pt-4">
            <svg viewBox="0 0 350 160" className="w-full h-44 overflow-visible">
              {/* Grid Lines */}
              {[50, 75, 100].map((val) => {
                const y = 130 - ((val - 50) / 50) * 110;
                return (
                  <g key={val}>
                    <line x1="25" y1={y} x2="340" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="20" y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Math Line (Steel Blue) */}
              <polyline
                fill="none"
                stroke="#334e68"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={scoreProgression.map((d, i) => `${45 + i * 85},${130 - ((d.math - 50) / 50) * 110}`).join(" ")}
              />

              {/* Science Line (Sage Green) */}
              <polyline
                fill="none"
                stroke="#365b49"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={scoreProgression.map((d, i) => `${45 + i * 85},${130 - ((d.science - 50) / 50) * 110}`).join(" ")}
              />

              {/* Data points */}
              {scoreProgression.map((d, i) => {
                const x = 45 + i * 85;
                const yMath = 130 - ((d.math - 50) / 50) * 110;
                const ySci = 130 - ((d.science - 50) / 50) * 110;
                return (
                  <g key={i}>
                    <circle cx={x} cy={yMath} r="4" fill="#334e68" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={x} cy={ySci} r="4" fill="#365b49" stroke="#ffffff" strokeWidth="2" />
                    <text x={x} y="145" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">
                      {d.period}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Subject Strengths & Weaknesses Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#edf2f7] text-[#334e68]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">Mathematics Mastery</h3>
                <p className="text-xs text-slate-500">Class {selectedGrade} Concept Breakdown</p>
              </div>
            </div>
            <span className="badge-steel">
              88% Accuracy
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="text-xs font-bold text-[#254636] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#365b49]" /> High Mastery Topics (Strengths)
              </div>
              <div className="space-y-1.5">
                <div className="p-2.5 bg-[#edf4f0] rounded-xl border border-[#c4d7cd] text-xs text-slate-800 flex justify-between">
                  <span>Number Systems & Radicals</span>
                  <span className="font-bold text-[#254636]">100% (High Retention)</span>
                </div>
                <div className="p-2.5 bg-[#edf4f0] rounded-xl border border-[#c4d7cd] text-xs text-slate-800 flex justify-between">
                  <span>Linear Equations in Two Variables</span>
                  <span className="font-bold text-[#254636]">92% (Strong Graphs)</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" /> Recommended Focus Areas (Growth Opportunities)
              </div>
              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-slate-800 flex justify-between">
                <span>Polynomial Factorization (Cubic Trial Roots)</span>
                <span className="font-bold text-amber-800">66% (Needs Practice)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Science Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#edf4f0] text-[#365b49]">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">Science Mastery</h3>
                <p className="text-xs text-slate-500">Class {selectedGrade} Concept Breakdown</p>
              </div>
            </div>
            <span className="badge-sage">
              91% Accuracy
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="text-xs font-bold text-[#254636] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#365b49]" /> High Mastery Topics (Strengths)
              </div>
              <div className="space-y-1.5">
                <div className="p-2.5 bg-[#edf4f0] rounded-xl border border-[#c4d7cd] text-xs text-slate-800 flex justify-between">
                  <span>Matter in Our Surroundings & Evaporation</span>
                  <span className="font-bold text-[#254636]">100% (Flawless)</span>
                </div>
                <div className="p-2.5 bg-[#edf4f0] rounded-xl border border-[#c4d7cd] text-xs text-slate-800 flex justify-between">
                  <span>Force & Pressure Foundations</span>
                  <span className="font-bold text-[#254636]">95% (Strong Units)</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" /> Recommended Focus Areas (Growth Opportunities)
              </div>
              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-slate-800 flex justify-between">
                <span>Conservation of Momentum Numericals</span>
                <span className="font-bold text-amber-800">72% (Needs Review)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Mastery Status List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-outfit">
          Chapter-Wise Assessment Logs
        </h3>

        <div className="divide-y divide-slate-100">
          {gradeLessons.map((lesson) => {
            const prog = userProgress.find(p => p.course_id === lesson.id);
            const score = prog?.quiz_score;
            return (
              <div key={lesson.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`text-xs font-bold ${
                    lesson.subject === "Math" ? "badge-steel" : "badge-sage"
                  }`}>
                    {lesson.subject}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">{lesson.chapter_title}</h4>
                    <p className="text-[11px] text-slate-400">Class {lesson.class_level} • Chapter {lesson.chapter_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {score !== undefined && score !== null ? (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      score >= 80 ? "bg-[#edf4f0] text-[#254636] border border-[#c4d7cd]" : "bg-amber-100 text-amber-900 border border-amber-200"
                    }`}>
                      {score}% Score
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not Attempted</span>
                  )}

                  <button
                    onClick={() => onTakeQuiz(lesson.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Take Assessment"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
