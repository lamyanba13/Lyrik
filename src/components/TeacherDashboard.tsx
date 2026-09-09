import React, { useState } from "react";
import { 
  Users, 
  FilePlus2, 
  BarChart3, 
  HelpCircle, 
  CheckCircle2, 
  Plus, 
  Search, 
  BookOpen, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Filter, 
  Award,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { CourseLesson, DoubtNotification, GradeLevel, Quiz, Subject, TeacherAnalytics, User } from "../types";

interface TeacherDashboardProps {
  users: User[];
  lessons: CourseLesson[];
  analytics: TeacherAnalytics | null;
  doubts: DoubtNotification[];
  onResolveDoubt: (doubtId: string, answer?: string) => void;
  onQuizCreated: (newQuiz: Partial<Quiz>) => void;
  onEnrollStudent: (student: { name: string; email: string; grade: GradeLevel }) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  users,
  lessons,
  analytics,
  doubts,
  onResolveDoubt,
  onQuizCreated,
  onEnrollStudent,
}) => {
  const [activeTab, setActiveTab] = useState<"classroom" | "quiz-creator" | "analytics" | "doubts">("classroom");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<"ALL" | GradeLevel>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Quiz Creator Form State
  const [quizGrade, setQuizGrade] = useState<GradeLevel>(9);
  const [quizSubject, setQuizSubject] = useState<Subject>("Math");
  const [quizChapterId, setQuizChapterId] = useState<string>("");
  const [quizTitle, setQuizTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanationText, setExplanationText] = useState("");
  const [hintText, setHintText] = useState("");
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);

  // Enroll Student Form State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState<GradeLevel>(9);

  // Filter students
  const enrolledStudents = users.filter(u => u.role === "student");
  const filteredStudents = enrolledStudents
    .filter(s => selectedGradeFilter === "ALL" || s.grade === selectedGradeFilter)
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddQuestionToQuiz = () => {
    if (!newQuestionText.trim() || !optionA.trim() || !optionB.trim()) {
      alert("Please enter a question and at least two options.");
      return;
    }
    const qObj = {
      id: `q_${Date.now()}_${questionsList.length + 1}`,
      question: newQuestionText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim() || "None of the above", optionD.trim() || "All of the above"],
      correct_index: correctIndex,
      explanation: explanationText.trim() || "Verified by teacher in classroom session.",
      hint: hintText.trim() || undefined,
    };
    setQuestionsList([...questionsList, qObj]);
    // Reset inputs
    setNewQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setExplanationText("");
    setHintText("");
  };

  const handlePublishQuiz = () => {
    if (questionsList.length === 0) {
      alert("Please add at least one question before publishing.");
      return;
    }
    const matchingLesson = lessons.find(l => l.id === quizChapterId);
    const resolvedTitle = quizTitle.trim() || matchingLesson?.chapter_title || `${quizSubject} Assessment`;

    onQuizCreated({
      course_id: quizChapterId || `custom_${Date.now()}`,
      chapter_title: resolvedTitle,
      class_level: quizGrade,
      subject: quizSubject,
      time_limit_minutes: timeLimitMinutes,
      questions: questionsList,
    });

    setIsSuccessNotification(true);
    setQuestionsList([]);
    setQuizTitle("");
    setTimeout(() => setIsSuccessNotification(false), 4000);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;
    onEnrollStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      grade: newStudentGrade,
    });
    setNewStudentName("");
    setNewStudentEmail("");
    setShowEnrollModal(false);
  };

  const pendingDoubts = doubts.filter(d => d.status === "pending");

  return (
    <div className="space-y-8">
      {/* Teacher Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#243b53] uppercase tracking-wider mb-1 font-outfit">
            <span>Faculty & Academic Portal</span>
            <span>•</span>
            <span>STEM Curriculum Class 8–10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
            Instructor Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor student cohorts, author customized diagnostic chapter tests, and guide pupils through challenging concepts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-accent font-black text-slate-950 text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" /> Enroll New Student
          </button>
        </div>
      </div>

      {/* Cohort Overview Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-outfit">
            <span>Total Enrolled</span>
            <Users className="w-3.5 h-3.5 text-[#334e68]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-1">
            {enrolledStudents.length} Students
          </div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
            <span className="badge-steel text-[10px] py-0.5 px-1.5">C8: {enrolledStudents.filter(s => s.grade === 8).length}</span>
            <span className="badge-sage text-[10px] py-0.5 px-1.5">C9: {enrolledStudents.filter(s => s.grade === 9).length}</span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">C10: {enrolledStudents.filter(s => s.grade === 10).length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-outfit">
            <span>Classroom Average</span>
            <BarChart3 className="w-3.5 h-3.5 text-[#365b49]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-1">
            82.4% Score
          </div>
          <p className="text-[11px] text-[#254636] font-bold mt-2">
            +4.2% across latest quizzes
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-outfit">
            <span>Active Chapters</span>
            <BookOpen className="w-3.5 h-3.5 text-[#334e68]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-1">
            {lessons.length} Modules
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            NCERT aligned video lectures & notes
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-outfit">
            <span>Doubt Queue</span>
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit mt-1">
            {pendingDoubts.length} Inquiries
          </div>
          <p className="text-[11px] text-amber-700 font-bold mt-2">
            {pendingDoubts.length > 0 ? "Requires faculty review" : "All doubts resolved"}
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab("classroom")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "classroom"
              ? "bg-white text-slate-950 shadow-xs font-black border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Enrolled Students ({enrolledStudents.length})
        </button>
        <button
          onClick={() => setActiveTab("quiz-creator")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "quiz-creator"
              ? "bg-white text-slate-950 shadow-xs font-black border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FilePlus2 className="w-3.5 h-3.5" /> Quiz Creation & Assignment
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "analytics"
              ? "bg-white text-slate-950 shadow-xs font-black border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Class Analytics & Heatmap
        </button>
        <button
          onClick={() => setActiveTab("doubts")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "doubts"
              ? "bg-white text-slate-950 shadow-xs font-black border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Student Doubts
          {pendingDoubts.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pendingDoubts.length}
            </span>
          )}
        </button>
      </div>


      {/* Success Notification Banner */}
      {isSuccessNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-medium">
            <span className="font-bold">Quiz Successfully Published!</span> The quiz is now live in the student curriculum catalog for Class {quizGrade}.
          </div>
        </div>
      )}

      {/* TAB 1: Classroom Management Overview */}
      {activeTab === "classroom" && (
        <div className="space-y-6">
          {/* Controls: Search & Grade Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#334e68]"
              />
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Filter Grade:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {(["ALL", 8, 9, 10] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGradeFilter(g)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      selectedGradeFilter === g
                        ? "bg-white text-[#243b53] shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {g === "ALL" ? "All Grades" : `Class ${g}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Student Profile</th>
                    <th className="px-6 py-3.5">Class Grade</th>
                    <th className="px-6 py-3.5">Subject Focus</th>
                    <th className="px-6 py-3.5">Quiz Mastery</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                            alt={student.name}
                            className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                            <div className="text-slate-400 text-[11px]">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        Class {student.grade}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          Math & Science
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#254636] bg-[#edf4f0] px-2.5 py-0.5 rounded-md border border-[#c4d7cd]">
                          {student.grade === 9 ? "88% Avg" : student.grade === 10 ? "92% Avg" : "84% Avg"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[#254636] font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#365b49]" /> Active Learner
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Quiz Creation and Assignment Panel */}
      {activeTab === "quiz-creator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Author New Chapter Assessment</h3>
              <p className="text-xs text-slate-500">Design multi-choice questions with automated marking and explanations</p>
            </div>

            {/* Target Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Grade</label>
                <select
                  value={quizGrade}
                  onChange={(e) => setQuizGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                >
                  <option value={8}>Class 8</option>
                  <option value={9}>Class 9</option>
                  <option value={10}>Class 10</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Subject</label>
                <select
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value as Subject)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                >
                  <option value="Math">Mathematics</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Time Limit</label>
                <select
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                >
                  <option value={3}>3 Minutes</option>
                  <option value={5}>5 Minutes</option>
                  <option value={10}>10 Minutes</option>
                </select>
              </div>
            </div>

            {/* Target Chapter or Custom Title */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Chapter Assessment Title</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g. Special Revision: Linear Equations & Graphs"
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
              />
            </div>

            {/* Question Authoring Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Compose Question #{questionsList.length + 1}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Question Prompt</label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g., What is the degree of the zero polynomial?"
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-600 block">Answer Choices & Correct Key</label>
                {[
                  { label: "Option A", val: optionA, set: setOptionA, idx: 0 },
                  { label: "Option B", val: optionB, set: setOptionB, idx: 1 },
                  { label: "Option C", val: optionC, set: setOptionC, idx: 2 },
                  { label: "Option D", val: optionD, set: setOptionD, idx: 3 },
                ].map((opt) => (
                  <div key={opt.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctChoice"
                      checked={correctIndex === opt.idx}
                      onChange={() => setCorrectIndex(opt.idx)}
                      className="w-4 h-4 accent-[#334e68] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={opt.val}
                      onChange={(e) => opt.set(e.target.value)}
                      placeholder={opt.label}
                      className="flex-1 text-xs p-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                    />
                    <span className="text-[11px] text-slate-400 shrink-0 w-12 text-right">
                      {correctIndex === opt.idx ? "Key ✓" : ""}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pedagogical Explanation</label>
                <input
                  type="text"
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder="Explain why this answer is correct step-by-step..."
                  className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="button"
                onClick={handleAddQuestionToQuiz}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question to Quiz
              </button>
            </div>
          </div>

          {/* Live Preview Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quiz Preview ({questionsList.length} Questions)
                </h3>
                <span className="badge-steel">
                  Class {quizGrade} • {quizSubject}
                </span>
              </div>

              {questionsList.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2 text-slate-400">
                  <FilePlus2 className="w-8 h-8 mx-auto" />
                  <p className="text-xs">No questions added yet. Use the editor to compose questions.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {questionsList.map((q, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="font-bold text-slate-900">
                        Q{idx + 1}. {q.question}
                      </div>
                      <div className="space-y-1 pl-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <div
                            key={optIdx}
                            className={`p-1.5 rounded text-[11px] ${
                              optIdx === q.correct_index
                                ? "bg-[#edf4f0] text-[#254636] font-bold border border-[#c4d7cd]"
                                : "text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correct_index ? "✓" : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                disabled={questionsList.length === 0}
                onClick={handlePublishQuiz}
                className="w-full py-3 rounded-xl btn-accent font-black text-slate-950 text-xs shadow-xs transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Publish & Assign to Class {quizGrade}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Class Analytics & Subject-wise Performance Heatmaps */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Top Grade-Wise Accuracy Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Class 8 Average</div>
              <div className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">86% Score</div>
              <div className="text-xs text-slate-500 mt-2 flex justify-between">
                <span>Math: 84%</span>
                <span>Science: 88%</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Class 9 Average</div>
              <div className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">81% Score</div>
              <div className="text-xs text-slate-500 mt-2 flex justify-between">
                <span>Math: 79%</span>
                <span>Science: 83%</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Class 10 Average</div>
              <div className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">79% Score</div>
              <div className="text-xs text-slate-500 mt-2 flex justify-between">
                <span>Math: 81%</span>
                <span>Science: 77%</span>
              </div>
            </div>
          </div>

          {/* Subject-Wise Performance Heatmap Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Curriculum Performance Heatmap
              </h3>
              <p className="text-xs text-slate-500">
                Identify which chapters require reinforcement or revision based on aggregate quiz performance
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Topic / Chapter</th>
                    <th className="px-5 py-3">Grade</th>
                    <th className="px-5 py-3">Subject</th>
                    <th className="px-5 py-3">Class Mastery %</th>
                    <th className="px-5 py-3">Difficulty Level</th>
                    <th className="px-5 py-3">Action Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(analytics?.subjectHeatmap || [
                    { topic: "Real Numbers & Radicals", grade: 9, subject: "Math", masteryPercent: 88, difficultyRating: "Low" },
                    { topic: "Polynomial Factorization", grade: 9, subject: "Math", masteryPercent: 68, difficultyRating: "High" },
                    { topic: "Matter & Latent Heat", grade: 9, subject: "Science", masteryPercent: 84, difficultyRating: "Medium" },
                    { topic: "Newton's Laws & Momentum", grade: 9, subject: "Science", masteryPercent: 72, difficultyRating: "High" },
                    { topic: "Quadratic Equations", grade: 10, subject: "Math", masteryPercent: 79, difficultyRating: "Medium" },
                    { topic: "Trigonometric Identities", grade: 10, subject: "Math", masteryPercent: 62, difficultyRating: "High" },
                    { topic: "Electricity & Ohm's Law", grade: 10, subject: "Science", masteryPercent: 75, difficultyRating: "High" },
                  ]).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{item.topic}</td>
                      <td className="px-5 py-3.5">Class {item.grade}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-600">{item.subject}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.masteryPercent >= 80
                                  ? "bg-emerald-500"
                                  : item.masteryPercent >= 70
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${item.masteryPercent}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800">{item.masteryPercent}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.difficultyRating === "Low"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.difficultyRating === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {item.difficultyRating} Difficulty
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.masteryPercent < 75 ? (
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            Revision Required
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            On Track
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Student Doubt Notifications */}
      {activeTab === "doubts" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Student Doubts & Questions Queue
              </h3>
              <p className="text-xs text-slate-500">
                Questions asked by students in Class 8, 9, and 10 needing teacher verification or response
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {doubts.map((doubt) => (
              <div
                key={doubt.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{doubt.studentName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Class {doubt.grade}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-[#243b53]">{doubt.subject}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    doubt.status === "pending"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-[#edf4f0] text-[#254636] border border-[#c4d7cd]"
                  }`}>
                    {doubt.status}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  "{doubt.question}"
                </div>

                {doubt.status === "pending" && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onResolveDoubt(doubt.id, "Teacher verified: Great question! Remember to apply conservation laws.")}
                      className="px-3 py-1.5 rounded-xl btn-accent font-black text-slate-950 text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> Mark Resolved & Send Answer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Enroll New Student</h3>
            <form onSubmit={handleEnrollSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g., Ananya Verma"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g., ananya.verma@lyrik.edu"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#334e68] font-semibold"
                >
                  <option value={8}>Class 8</option>
                  <option value={9}>Class 9</option>
                  <option value={10}>Class 10</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-accent font-black text-slate-950 text-xs shadow-xs cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
