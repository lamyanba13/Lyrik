import React, { useState, useRef, useEffect } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  UserCheck, 
  Bell, 
  Atom,
  Calculator,
  ShieldCheck,
  Award,
  Layers,
  Zap,
  ChevronRight
} from "lucide-react";
import { User, UserRole, GradeLevel, UserXpStats } from "../types";

interface NavbarProps {
  currentUser: User;
  onSelectRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  selectedGrade: GradeLevel;
  onChangeGrade?: (grade: GradeLevel) => void;
  onGradeChange?: (grade: GradeLevel) => void;
  activeView?: string;
  onNavigate?: (view: string) => void;
  pendingDoubtsCount?: number;
  onOpenDoubtModal?: () => void;
  xpStats?: UserXpStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  onRoleChange,
  selectedGrade,
  onChangeGrade,
  onGradeChange,
  activeView: _activeView,
  onNavigate,
  pendingDoubtsCount = 0,
  onOpenDoubtModal,
  xpStats,
}) => {
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLevelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGrade = (g: GradeLevel) => {
    if (onChangeGrade) onChangeGrade(g);
    else if (onGradeChange) onGradeChange(g);
  };

  const handleRole = (r: UserRole) => {
    if (onSelectRole) onSelectRole(r);
    else if (onRoleChange) onRoleChange(r);
  };

  const handleNav = (v: string) => {
    if (onNavigate) onNavigate(v);
    else if (v === "doubts" && onOpenDoubtModal) onOpenDoubtModal();
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Academic Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none" 
            onClick={() => handleNav("overview")}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-900 transition-colors border border-slate-700">
              <GraduationCap className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-outfit">
                  Lyrik<span className="text-amber-500">.</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider uppercase bg-slate-800 text-slate-200 border border-slate-700 shadow-2xs">
                  Academic
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:flex items-center gap-1.5">
                <span>STEM Learning System</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-semibold">Class 8–10</span>
              </p>
            </div>
          </div>

          {/* Center: Grade Curriculum Selector */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Syllabus:</span>
            </div>
            {([8, 9, 10] as GradeLevel[]).map((g) => {
              const isSelected = selectedGrade === g;
              return (
                <button
                  key={g}
                  id={`btn-grade-${g}`}
                  onClick={() => handleGrade(g)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white text-slate-900 shadow-xs border border-slate-300 ring-1 ring-slate-400/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <span>Class {g}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section: Role Simulator & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Student Experience Level Badge */}
            {currentUser.role === "student" && xpStats && (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="nav-level-badge"
                  onClick={() => setShowLevelDropdown(prev => !prev)}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50/90 hover:bg-amber-100 border border-amber-300 text-slate-900 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                  title={`Level ${xpStats.currentLevel}: ${xpStats.levelTitle} • ${xpStats.progressPercent}% progress`}
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-2xs group-hover:scale-105 transition-transform">
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-xs font-black text-slate-900 font-display">
                        Level {xpStats.currentLevel}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-950 leading-none">
                        {xpStats.progressPercent}%
                      </span>
                    </div>
                    <div className="w-14 sm:w-20 h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${xpStats.progressPercent}%` }} 
                      />
                    </div>
                  </div>
                </button>

                {/* Interactive Level Popover */}
                {showLevelDropdown && (
                  <div 
                    id="nav-level-popover"
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                          {xpStats.currentLevel}
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Scholar Rank</div>
                          <div className="text-sm font-black text-slate-900 font-display">{xpStats.levelTitle}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200">
                        {xpStats.totalXp.toLocaleString()} XP
                      </span>
                    </div>

                    <div className="py-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Level {xpStats.currentLevel} Progress</span>
                        <span className="font-bold text-slate-800">{xpStats.currentLevelXp} / {xpStats.xpForNextLevel} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" 
                          style={{ width: `${xpStats.progressPercent}%` }} 
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>{xpStats.xpToNextLevel} XP to Level {xpStats.currentLevel + 1}</span>
                        <span className="font-semibold text-slate-700">{xpStats.nextLevelTitle}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 pb-3 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-slate-400 text-[10px] font-bold">Lessons Completed</div>
                        <div className="font-black text-slate-800 mt-0.5">{xpStats.completedLessonsCount} (+{xpStats.lessonXp} XP)</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-slate-400 text-[10px] font-bold">Quizzes Mastered</div>
                        <div className="font-black text-slate-800 mt-0.5">{xpStats.completedQuizzesCount} (+{xpStats.quizXp} XP)</div>
                      </div>
                    </div>

                    <button
                      id="btn-nav-view-xp-dashboard"
                      onClick={() => {
                        setShowLevelDropdown(false);
                        handleNav("overview");
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Open XP Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Multi-role Workspace Switcher */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 hidden lg:inline">
                Role:
              </span>
              {(["student", "teacher", "parent"] as UserRole[]).map((r) => {
                const isActive = currentUser.role === r;
                return (
                  <button
                    key={r}
                    id={`role-btn-${r}`}
                    onClick={() => handleRole(r)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                      isActive
                        ? "bg-slate-800 text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {r === "student" ? "Scholar" : r === "teacher" ? "Faculty" : "Guardian"}
                  </button>
                );
              })}
            </div>

            {/* AI Doubt Notification Alert */}
            <button
              id="btn-nav-doubts"
              onClick={() => handleNav(currentUser.role === "teacher" ? "teacher" : "doubts")}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title={pendingDoubtsCount > 0 ? `${pendingDoubtsCount} doubts pending in queue` : "Doubts & Inquiries"}
            >
              <Bell className="w-4 h-4" />
              {pendingDoubtsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 ring-2 ring-white" />
                </span>
              )}
            </button>

            {/* Profile Avatar Card */}
            <div className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-200">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#365b49] ring-2 ring-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1 font-outfit">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-semibold text-[#334e68] capitalize">
                  {currentUser.role === "student" ? `Class ${currentUser.grade} Scholar` : currentUser.role === "teacher" ? "STEM Instructor" : "Parent / Guardian"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

