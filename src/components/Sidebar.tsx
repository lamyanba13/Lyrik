import React from "react";
import { 
  LayoutDashboard, 
  Video, 
  HelpCircle, 
  BarChart3, 
  Bot, 
  Users, 
  FilePlus2, 
  HeartHandshake, 
  Settings, 
  Flame, 
  Sparkles,
  BookOpen,
  Target,
  Award,
  CheckCircle2
} from "lucide-react";
import { UserRole } from "../types";

interface SidebarProps {
  currentRole: UserRole;
  activeView: string;
  onNavigate: (view: string) => void;
  pendingDoubtsCount: number;
}

interface SidebarLinkGroup {
  groupTitle: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeView,
  onNavigate,
  pendingDoubtsCount,
}) => {
  const studentGroups: SidebarLinkGroup[] = [
    {
      groupTitle: "Classroom Curriculum",
      items: [
        { id: "overview", label: "Syllabus Dashboard", icon: LayoutDashboard },
        { id: "lessons", label: "Video Lectures & Notes", icon: Video },
        { id: "quizzes", label: "Chapter Assessments", icon: HelpCircle },
      ]
    },
    {
      groupTitle: "Mastery & Assistance",
      items: [
        { id: "performance", label: "Academic Analytics", icon: BarChart3 },
        { id: "doubts", label: "Lyrik AI STEM Tutor", icon: Bot, badge: "AI 24/7" },
      ]
    }
  ];

  const teacherGroups: SidebarLinkGroup[] = [
    {
      groupTitle: "Faculty Operations",
      items: [
        { id: "teacher", label: "Classroom Roster & Ranks", icon: Users, badge: pendingDoubtsCount > 0 ? `${pendingDoubtsCount} doubts` : undefined },
        { id: "teacher-quiz", label: "Quiz Authoring Studio", icon: FilePlus2 },
      ]
    },
    {
      groupTitle: "Curriculum & Inquiries",
      items: [
        { id: "lessons", label: "Inspect Lesson Modules", icon: Video },
        { id: "doubts", label: "Student Doubt Queue", icon: Bot },
      ]
    }
  ];

  const parentGroups: SidebarLinkGroup[] = [
    {
      groupTitle: "Guardian Insights",
      items: [
        { id: "parent", label: "Academic Audit Report", icon: HeartHandshake },
        { id: "performance", label: "Weekly Mastery Trends", icon: BarChart3 },
      ]
    },
    {
      groupTitle: "Curriculum Standards",
      items: [
        { id: "lessons", label: "Syllabus & Lesson Plans", icon: Video },
        { id: "parent-settings", label: "Notifications & Goals", icon: Settings },
      ]
    }
  ];

  const groups = currentRole === "teacher" 
    ? teacherGroups 
    : currentRole === "parent" 
    ? parentGroups 
    : studentGroups;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 select-none shadow-[1px_0_3px_0_rgba(0,0,0,0.01)]">
      <div className="p-4 space-y-5 flex-1">
        {groups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-outfit">
              {group.groupTitle}
            </div>
            {group.items.map((link) => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => onNavigate(link.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? "bg-slate-100 text-slate-950 font-black shadow-2xs border border-slate-200/90"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                      link.badge.includes("AI") 
                        ? "bg-amber-500 text-slate-950" 
                        : "badge-sage"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-500 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Academic Target & Streak Box */}
      {currentRole === "student" && (
        <div className="p-3.5 m-3 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 font-outfit">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>4-Day Active Streak</span>
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded border border-slate-300">
              Top 5%
            </span>
          </div>
          
          <p className="text-[11px] text-slate-500 leading-snug mb-2.5">
            Class 9 Math & Science weekly goal: <strong className="text-slate-700">3.8 / 5.0 hrs</strong> completed.
          </p>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-[#334e68] h-full rounded-full w-[76%]" />
          </div>

          <button
            onClick={() => onNavigate("quizzes")}
            className="w-full py-2 px-3 rounded-xl text-xs font-black btn-accent transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-slate-950" />
            <span>Daily Diagnostic Test</span>
          </button>
        </div>
      )}

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="font-semibold text-slate-500 font-outfit">Lyrik STEM v2.5</span>
        <span className="flex items-center gap-1 text-[#254636] font-bold text-[10px] uppercase tracking-wider bg-[#edf4f0] px-2 py-0.5 rounded-md border border-[#c4d7cd]">
          <CheckCircle2 className="w-3 h-3 text-[#365b49]" /> CBSE Verified
        </span>
      </div>
    </aside>
  );
};

