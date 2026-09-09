import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { StudentDashboard } from "./components/StudentDashboard";
import { VideoPlayerLesson } from "./components/VideoPlayerLesson";
import { QuizModule } from "./components/QuizModule";
import { PerformanceDashboard } from "./components/PerformanceDashboard";
import { AiDoubtSolver } from "./components/AiDoubtSolver";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { ParentDashboard } from "./components/ParentDashboard";
import { 
  CourseLesson, 
  DoubtNotification, 
  GradeLevel, 
  ParentReport, 
  Quiz, 
  Subject, 
  TeacherAnalytics, 
  User, 
  UserProgress, 
  UserRole,
  UserXpStats
} from "./types";
import { 
  FALLBACK_CURRICULUM, 
  FALLBACK_QUIZZES, 
  FALLBACK_PROGRESS, 
  FALLBACK_DOUBTS 
} from "./data/mockCurriculum";
import { calculateUserXp, calculateQuizXp, XP_CONFIG } from "./utils/xpSystem";
import { Award, Sparkles, Zap, CheckCircle2, X } from "lucide-react";

// Safe Fallback initial data in case the backend is booting
const FALLBACK_USERS: User[] = [
  { id: "usr_student_1", name: "Aarav Sharma", role: "student", grade: 9, email: "aarav@lyrik.edu", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav" },
  { id: "usr_teacher_1", name: "Dr. Sunita Rao", role: "teacher", email: "sunita.rao@lyrik.edu", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sunita" },
  { id: "usr_parent_1", name: "Rajesh Sharma", role: "parent", email: "rajesh.sharma@lyrik.edu", avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Rajesh" },
];

export default function App() {
  const [users, setUsers] = useState<User[]>(FALLBACK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(FALLBACK_USERS[0]);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(9);
  const [activeView, setActiveView] = useState<string>("overview");

  const [lessons, setLessons] = useState<CourseLesson[]>(FALLBACK_CURRICULUM);
  const [quizzes, setQuizzes] = useState<Quiz[]>(FALLBACK_QUIZZES);
  const [userProgress, setUserProgress] = useState<UserProgress[]>(FALLBACK_PROGRESS);
  const [doubts, setDoubts] = useState<DoubtNotification[]>(FALLBACK_DOUBTS);
  const [teacherAnalytics, setTeacherAnalytics] = useState<TeacherAnalytics | null>(null);
  const [parentReport, setParentReport] = useState<ParentReport | null>(null);

  // Gamification XP & Level System State
  const [bonusXp, setBonusXp] = useState<number>(50); // Daily streak bonus
  const [xpNotification, setXpNotification] = useState<{ amount: number; reason: string } | null>(null);

  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(FALLBACK_CURRICULUM[0]);
  const [activeQuizId, setActiveQuizId] = useState<string | undefined>(undefined);
  const [doubtInitialQuery, setDoubtInitialQuery] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-dismiss XP celebration notification after 3.8s
  useEffect(() => {
    if (xpNotification) {
      const timer = setTimeout(() => setXpNotification(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [xpNotification]);

  // Derived real-time XP and Level state
  const xpStats = calculateUserXp(userProgress, bonusXp);

  // Load initial dataset from backend Express APIs
  useEffect(() => {
    async function loadData() {
      try {
        const [uRes, cRes, qRes, pRes, dRes, tRes, prRes] = await Promise.all([
          fetch("/api/users").then(r => r.json()).catch(() => ({ users: FALLBACK_USERS })),
          fetch("/api/curriculum").then(r => r.json()).catch(() => ({ lessons: FALLBACK_CURRICULUM })),
          fetch("/api/quizzes").then(r => r.json()).catch(() => ({ quizzes: FALLBACK_QUIZZES })),
          fetch("/api/progress?user_id=usr_student_1").then(r => r.json()).catch(() => ({ progress: FALLBACK_PROGRESS })),
          fetch("/api/doubts").then(r => r.json()).catch(() => ({ doubts: FALLBACK_DOUBTS })),
          fetch("/api/analytics/teacher").then(r => r.json()).catch(() => null),
          fetch("/api/analytics/parent?student_id=usr_student_1").then(r => r.json()).catch(() => null),
        ]);

        const loadedUsers: User[] = Array.isArray(uRes) ? uRes : (uRes?.users || FALLBACK_USERS);
        const loadedLessons: CourseLesson[] = Array.isArray(cRes) ? cRes : (cRes?.lessons || FALLBACK_CURRICULUM);
        const loadedQuizzes: Quiz[] = Array.isArray(qRes) ? qRes : (qRes?.quizzes || FALLBACK_QUIZZES);
        const loadedProgress: UserProgress[] = Array.isArray(pRes) ? pRes : (pRes?.progress || FALLBACK_PROGRESS);
        const loadedDoubts: DoubtNotification[] = Array.isArray(dRes) ? dRes : (dRes?.doubts || FALLBACK_DOUBTS);

        if (loadedUsers.length > 0) {
          setUsers(loadedUsers);
          const student = loadedUsers.find(u => u.role === "student") || loadedUsers[0];
          setCurrentUser(student);
          if (student.grade) setSelectedGrade(student.grade);
        }
        if (loadedLessons.length > 0) {
          setLessons(loadedLessons);
          const forGrade = loadedLessons.find(l => l.class_level === selectedGrade) || loadedLessons[0];
          setSelectedLesson(prev => prev || forGrade);
        }
        if (loadedQuizzes.length > 0) setQuizzes(loadedQuizzes);
        if (loadedProgress.length > 0) setUserProgress(loadedProgress);
        if (loadedDoubts.length > 0) setDoubts(loadedDoubts);
        if (tRes) setTeacherAnalytics(tRes);
        if (prRes) setParentReport(prRes);
      } catch (err) {
        console.warn("Using fallback local data while API initializes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle switching role
  const handleRoleChange = (role: UserRole) => {
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      const tempUser: User = {
        id: `usr_${role}_temp`,
        name: role === "teacher" ? "Prof. Sunita Rao" : role === "parent" ? "Rajesh Sharma" : "Aarav Sharma",
        role,
        email: `${role}@lyrik.edu`,
        grade: role === "student" ? selectedGrade : undefined,
      };
      setCurrentUser(tempUser);
    }

    // Default view transition on role switch
    if (role === "teacher") {
      setActiveView("teacher");
    } else if (role === "parent") {
      setActiveView("parent");
    } else {
      setActiveView("overview");
    }
  };

  // Handle Grade Change
  const handleGradeChange = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    const firstForGrade = lessons.find(l => l.class_level === grade);
    if (firstForGrade) {
      setSelectedLesson(firstForGrade);
    }
  };

  // Navigate to interactive lesson
  const handleSelectLesson = (lesson: CourseLesson) => {
    setSelectedLesson(lesson);
    setActiveView("lessons");
  };

  // Navigate to Quiz
  const handleTakeQuiz = (lessonId: string) => {
    const q = quizzes.find(item => item.course_id === lessonId || item.id === lessonId);
    if (q) {
      setActiveQuizId(q.id);
    }
    setActiveView("quizzes");
  };

  // Handle Quiz Completed
  const handleQuizCompleted = (quizId: string, score: number) => {
    const targetQuiz = quizzes.find(q => q.id === quizId);
    const courseId = targetQuiz?.course_id || quizId;

    setUserProgress(prev => {
      const existing = prev.find(p => p.course_id === courseId);
      if (existing) {
        return prev.map(p => 
          p.course_id === courseId 
            ? { ...p, quiz_score: score, completed_status: score >= 50 ? true : p.completed_status }
            : p
        );
      } else {
        return [
          ...prev,
          {
            course_id: courseId,
            user_id: currentUser.id,
            completed_status: score >= 50,
            quiz_score: score,
            time_spent_minutes: 5,
            last_accessed: new Date().toISOString(),
          }
        ];
      }
    });
  };

  // Handle Mark Complete for Lesson
  const handleMarkComplete = (lessonId: string) => {
    setUserProgress(prev => {
      const existing = prev.find(p => p.course_id === lessonId);
      if (existing) {
        return prev.map(p => p.course_id === lessonId ? { ...p, completed_status: !p.completed_status } : p);
      } else {
        return [
          ...prev,
          {
            course_id: lessonId,
            user_id: currentUser.id,
            completed_status: true,
            quiz_score: null,
            time_spent_minutes: 15,
            last_accessed: new Date().toISOString(),
          }
        ];
      }
    });
  };

  // Handle Teacher Create Quiz
  const handleQuizCreated = async (newQuizData: Partial<Quiz>) => {
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuizData),
      });
      const savedQuiz = await res.json();
      setQuizzes(prev => [savedQuiz, ...prev]);
    } catch (err) {
      console.error("Failed to save quiz to server:", err);
      // Local state fallback
      const fallbackQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        course_id: newQuizData.course_id || `course_${Date.now()}`,
        chapter_title: newQuizData.chapter_title || "Custom Quiz",
        class_level: newQuizData.class_level || 9,
        subject: newQuizData.subject || "Math",
        time_limit_minutes: newQuizData.time_limit_minutes || 5,
        questions: newQuizData.questions || [],
      };
      setQuizzes(prev => [fallbackQuiz, ...prev]);
    }
  };

  // Handle Teacher Enroll Student
  const handleEnrollStudent = async (studentData: { name: string; email: string; grade: GradeLevel }) => {
    try {
      const res = await fetch("/api/users/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      const savedStudent = await res.json();
      setUsers(prev => [...prev, savedStudent]);
    } catch (err) {
      const fallbackStudent: User = {
        id: `usr_${Date.now()}`,
        name: studentData.name,
        email: studentData.email,
        role: "student",
        grade: studentData.grade,
      };
      setUsers(prev => [...prev, fallbackStudent]);
    }
  };

  // Handle Teacher Resolve Doubt
  const handleResolveDoubt = async (doubtId: string, answer?: string) => {
    try {
      await fetch("/api/doubts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doubtId, answer }),
      });
      setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, status: "resolved" } : d));
    } catch (err) {
      setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, status: "resolved" } : d));
    }
  };

  // Student new doubt submission
  const handleStudentDoubtCreated = (question: string, subject: Subject) => {
    const newDoubt: DoubtNotification = {
      id: `d_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      grade: selectedGrade,
      subject,
      question,
      timestamp: "Just now",
      status: "pending",
    };
    setDoubts(prev => [newDoubt, ...prev]);
  };

  const pendingDoubtsCount = doubts.filter(d => d.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 antialiased selection:bg-[#334e68] selection:text-white">
      {/* Top Application Navbar */}
      <Navbar
        currentUser={currentUser}
        selectedGrade={selectedGrade}
        onGradeChange={handleGradeChange}
        onRoleChange={handleRoleChange}
        pendingDoubtsCount={pendingDoubtsCount}
        onOpenDoubtModal={() => setActiveView("doubts")}
      />

      {/* Main Container with Sidebar + Dynamic View Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentRole={currentUser.role}
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          pendingDoubtsCount={pendingDoubtsCount}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* VIEW: Student Dashboard */}
          {activeView === "overview" && (
            <StudentDashboard
              currentUser={currentUser}
              selectedGrade={selectedGrade}
              onChangeGrade={handleGradeChange}
              lessons={lessons}
              userProgress={userProgress}
              onSelectLesson={handleSelectLesson}
              onTakeQuiz={handleTakeQuiz}
              onOpenDoubts={(prompt) => {
                setDoubtInitialQuery(prompt);
                setActiveView("doubts");
              }}
              onOpenPerformance={() => setActiveView("performance")}
            />
          )}

          {/* VIEW: Interactive Video Lesson */}
          {activeView === "lessons" && (
            <VideoPlayerLesson
              currentLesson={selectedLesson || lessons.find(l => l.class_level === selectedGrade) || lessons[0] || null}
              allLessons={lessons}
              selectedGrade={selectedGrade}
              onChangeGrade={handleGradeChange}
              onSelectLesson={(lesson) => setSelectedLesson(lesson)}
              onTakeQuiz={handleTakeQuiz}
              onMarkComplete={handleMarkComplete}
              isCompleted={userProgress.some(p => p.course_id === (selectedLesson?.id || lessons[0]?.id) && p.completed_status)}
            />
          )}

          {/* VIEW: Chapter-Wise Quiz Module */}
          {activeView === "quizzes" && (
            <QuizModule
              quizzes={quizzes}
              initialQuizId={activeQuizId}
              currentUser={currentUser}
              selectedGrade={selectedGrade}
              onChangeGrade={handleGradeChange}
              onQuizCompleted={handleQuizCompleted}
              onBackToLessons={() => setActiveView("lessons")}
            />
          )}

          {/* VIEW: Performance Dashboard */}
          {activeView === "performance" && (
            <PerformanceDashboard
              currentUser={currentUser}
              userProgress={userProgress}
              lessons={lessons}
              selectedGrade={selectedGrade}
              onSelectLesson={handleSelectLesson}
              onTakeQuiz={handleTakeQuiz}
            />
          )}

          {/* VIEW: AI Doubt Solver */}
          {activeView === "doubts" && (
            <AiDoubtSolver
              currentUser={currentUser}
              selectedGrade={selectedGrade}
              onDoubtCreated={handleStudentDoubtCreated}
              initialPrompt={doubtInitialQuery}
            />
          )}

          {/* VIEW: Teacher Dashboard */}
          {(activeView === "teacher" || activeView === "teacher-quiz") && (
            <TeacherDashboard
              users={users}
              lessons={lessons}
              analytics={teacherAnalytics}
              doubts={doubts}
              onResolveDoubt={handleResolveDoubt}
              onQuizCreated={handleQuizCreated}
              onEnrollStudent={handleEnrollStudent}
            />
          )}

          {/* VIEW: Parent / Admin Dashboard */}
          {(activeView === "parent" || activeView === "parent-settings") && (
            <ParentDashboard
              parentReport={parentReport}
              students={users.filter(u => u.role === "student")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
