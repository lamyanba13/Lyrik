import React, { useState } from "react";
import { 
  HeartHandshake, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  Mail, 
  Calculator, 
  Atom, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ParentAlert, ParentReport, User } from "../types";

interface ParentDashboardProps {
  parentReport: ParentReport | null;
  students: User[];
  onOpenTopicReview?: (topicName: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parentReport,
  students,
  onOpenTopicReview,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "usr_student_1");
  const [dailyGoalHours, setDailyGoalHours] = useState(1.5);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState<ParentAlert[]>(parentReport?.alerts || [
    {
      id: "alt_1",
      topic: "Polynomial Factorization (Cubic Roots)",
      subject: "Math",
      severity: "warning",
      message: "Scored 66% on the Chapter 2 assessment. Difficulty with trial root identification.",
      recommendedAction: "Review the 4-minute interactive lesson on Remainder Theorem with Aarav.",
      timestamp: "Yesterday",
    },
    {
      id: "alt_2",
      topic: "Study Schedule Goal",
      subject: "Science",
      severity: "info",
      message: "Aarav achieved 100% mastery in Matter in Our Surroundings and completed all science quizzes on time.",
      recommendedAction: "Acknowledge progress to reinforce consistent study habits.",
      timestamp: "2 days ago",
    }
  ]);

  const student = students.find(s => s.id === selectedStudentId) || students[0];

  const handleDismissAlert = (id: string) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Guardian & Parent Portal</span>
            <span>•</span>
            <span>Student Oversight & Progress Reports</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
            Academic Performance Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of learning milestones, study habits, and areas needing support.
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Viewing Child:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 shadow-xs focus:ring-2 focus:ring-[#334e68]"
          >
            {students.filter(s => s.role === "student").map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (Class {s.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 4 Key Metric Cards for Parent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Weekly Study Time</span>
            <Clock className="w-4 h-4 text-[#334e68]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-2">
            6.8 hrs
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Target: 8.0 hrs / week (85% reached)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Quiz Average</span>
            <Award className="w-4 h-4 text-[#365b49]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-2">
            88% Score
          </div>
          <div className="text-xs text-[#254636] font-semibold mt-1">
            Top 15% in Class {student?.grade || 9}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Chapters Finished</span>
            <CheckCircle2 className="w-4 h-4 text-[#334e68]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-2">
            4 of 6
          </div>
          <div className="text-xs text-slate-500 mt-1">
            On schedule for term exams
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Doubt Solver Activity</span>
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-2">
            8 Doubts Solved
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Active inquiry in Math & Science
          </div>
        </div>
      </div>

      {/* Academic Alert Notifications Banner (Topics Requiring Attention) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Academic Alerts & Focus Areas
              </h3>
              <p className="text-xs text-slate-500">
                Automated alerts flagging concepts where additional revision is suggested
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {activeAlerts.length} Action Items
          </span>
        </div>

        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.severity === "warning"
                  ? "bg-amber-50/60 border-amber-200"
                  : "bg-[#edf4f0] border-[#c4d7cd]"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    alert.severity === "warning" ? "bg-amber-200/80 text-amber-900" : "bg-[#c4d7cd] text-[#1e382d]"
                  }`}>
                    {alert.subject} • {alert.topic}
                  </span>
                  <span className="text-slate-400">• {alert.timestamp}</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">{alert.message}</div>
                <div className="text-xs text-slate-600 font-medium">
                  💡 <span className="font-bold text-slate-700">Recommended Action:</span> {alert.recommendedAction}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDismissAlert(alert.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Mastery Summaries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Mastery Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#edf2f7] text-[#334e68]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">Mathematics Mastery</h3>
                <p className="text-xs text-slate-500">Class {student?.grade || 9} Curriculum</p>
              </div>
            </div>
            <span className="text-sm font-black text-[#243b53] font-outfit">85% Aggregate</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-700">Real Numbers & Decimal Expansions</span>
                <span className="text-[#254636] font-bold">100% (Mastered)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#365b49] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-700">Linear Equations in Two Variables</span>
                <span className="text-[#254636] font-bold">90% (Proficient)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#365b49] rounded-full" style={{ width: "90%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-700">Polynomials & Factorization</span>
                <span className="text-amber-700 font-bold">66% (Needs Practice)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "66%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Science Mastery Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#edf4f0] text-[#365b49]">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">Science Mastery</h3>
                <p className="text-xs text-slate-500">Physics, Chemistry & Biology</p>
              </div>
            </div>
            <span className="text-sm font-black text-[#254636] font-outfit">91% Aggregate</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-700">Matter in Our Surroundings</span>
                <span className="text-[#254636] font-bold">100% (Mastered)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#365b49] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-700">Force & Newton's Laws of Motion</span>
                <span className="text-[#254636] font-bold">85% (Proficient)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#365b49] rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-700">Tissues & Cellular Organization</span>
                <span className="text-[#254636] font-bold">88% (Proficient)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#365b49] rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parental Controls & Alerts Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-slate-600" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">
            Parental Preferences & Notifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Daily Study Target: {dailyGoalHours} Hours
            </label>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.5}
              value={dailyGoalHours}
              onChange={(e) => setDailyGoalHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#334e68]"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>30m</span>
              <span>1.5h</span>
              <span>3.0h</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">Weekly Email Digest</div>
              <div className="text-[11px] text-slate-500">Sunday evening score breakdown</div>
            </div>
            <input
              type="checkbox"
              checked={emailDigestEnabled}
              onChange={(e) => setEmailDigestEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#334e68] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">SMS Topic Alert</div>
              <div className="text-[11px] text-slate-500">Notify if quiz score &lt; 70%</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlertsEnabled}
              onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#334e68] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
