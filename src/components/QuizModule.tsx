import React, { useState, useEffect } from "react";
import { 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  AlertCircle, 
  Lightbulb, 
  Sparkles,
  Calculator,
  Atom,
  Check
} from "lucide-react";
import { GradeLevel, Quiz, QuizQuestion, Subject, User } from "../types";

interface QuizModuleProps {
  quizzes: Quiz[];
  initialQuizId?: string;
  currentUser: User;
  selectedGrade: GradeLevel;
  onChangeGrade: (grade: GradeLevel) => void;
  onQuizCompleted: (quizId: string, score: number) => void;
  onBackToLessons: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  quizzes,
  initialQuizId,
  currentUser,
  selectedGrade,
  onChangeGrade,
  onQuizCompleted,
  onBackToLessons,
}) => {
  // Filter quizzes by grade
  const gradeQuizzes = quizzes.filter(q => q.class_level === selectedGrade);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(() => {
    if (initialQuizId) {
      const found = quizzes.find(q => q.id === initialQuizId || q.course_id === initialQuizId);
      if (found) return found;
    }
    return gradeQuizzes[0] || quizzes[0] || null;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 min default
  const [showHint, setShowHint] = useState(false);
  const [detailedResults, setDetailedResults] = useState<any[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when initialQuizId changes
  useEffect(() => {
    if (initialQuizId) {
      const found = quizzes.find(q => q.id === initialQuizId || q.course_id === initialQuizId);
      if (found) {
        setSelectedQuiz(found);
        resetQuizState(found);
      }
    }
  }, [initialQuizId, quizzes]);

  // Sync when quizzes list or grade changes and no selectedQuiz is active
  useEffect(() => {
    if (!selectedQuiz && quizzes.length > 0) {
      const match = quizzes.find(q => q.class_level === selectedGrade) || quizzes[0];
      setSelectedQuiz(match);
      resetQuizState(match);
    }
  }, [quizzes, selectedGrade, selectedQuiz]);

  // Timer countdown
  useEffect(() => {
    if (!selectedQuiz || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedQuiz, isSubmitted, selectedAnswers]);

  const resetQuizState = (quiz: Quiz) => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setTimeLeftSeconds(quiz.time_limit_minutes * 60);
    setShowHint(false);
    setDetailedResults([]);
    setFinalScore(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz || isSubmitted) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          quiz_id: selectedQuiz.id,
          answers: selectedAnswers,
          time_spent_minutes: Math.max(1, Math.round((selectedQuiz.time_limit_minutes * 60 - timeLeftSeconds) / 60)),
        }),
      });

      const data = await res.json();
      setFinalScore(data.score);
      setDetailedResults(data.detailedResults || []);
      setIsSubmitted(true);
      onQuizCompleted(selectedQuiz.id, data.score);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      // Client-side fallback calculation if offline
      let correct = 0;
      const details = selectedQuiz.questions.map((q, idx) => {
        const userSel = selectedAnswers[idx];
        const isCorr = userSel === q.correct_index;
        if (isCorr) correct++;
        return {
          questionId: q.id,
          question: q.question,
          userSelected: userSel,
          correctIndex: q.correct_index,
          isCorrect: isCorr,
          explanation: q.explanation,
        };
      });
      const pct = Math.round((correct / selectedQuiz.questions.length) * 100);
      setFinalScore(pct);
      setDetailedResults(details);
      setIsSubmitted(true);
      onQuizCompleted(selectedQuiz.id, pct);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!selectedQuiz || !Array.isArray(selectedQuiz.questions) || selectedQuiz.questions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Questions Available for this Quiz</h3>
        <p className="text-sm text-slate-500">Please choose another quiz or switch grades.</p>
        <button
          onClick={onBackToLessons}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Back to Lessons
        </button>
      </div>
    );
  }

  const currentQ: QuizQuestion = selectedQuiz.questions[currentQuestionIndex] || selectedQuiz.questions[0];
  const userChoice = selectedAnswers[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6">
      {/* Top Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Class {selectedQuiz.class_level}</span>
            <span>•</span>
            <span className={selectedQuiz.subject === "Math" ? "text-indigo-600 font-bold" : "text-emerald-600 font-bold"}>
              {selectedQuiz.subject}
            </span>
            <span>•</span>
            <span>Assessment Module</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">
            {selectedQuiz.chapter_title}
          </h1>
        </div>

        {/* Switch Chapter Quiz Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedQuiz.id}
            onChange={(e) => {
              const q = quizzes.find(item => item.id === e.target.value);
              if (q) {
                setSelectedQuiz(q);
                resetQuizState(q);
              }
            }}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {quizzes.map(q => (
              <option key={q.id} value={q.id}>
                Class {q.class_level} • {q.subject}: {q.chapter_title}
              </option>
            ))}
          </select>

          <button
            onClick={onBackToLessons}
            className="text-xs font-semibold px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl"
          >
            Video Lessons
          </button>
        </div>
      </div>

      {/* Main Quiz Layout: Left active questionnaire, Right status & info */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Question Box (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            {/* Question Progress & Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
              </span>

              <div className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-outfit">
                {currentQ.question}
              </h2>

              {currentQ.hint && (
                <div className="pt-1">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    {showHint ? "Hide Hint" : "Need a Hint?"}
                  </button>
                  {showHint && (
                    <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 text-xs text-amber-900 rounded-xl leading-relaxed">
                      💡 {currentQ.hint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MCQ Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = userChoice === idx;
                const optionLetters = ["A", "B", "C", "D"];
                return (
                  <div
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-slate-800 bg-slate-100/80 shadow-xs text-slate-950 font-bold"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {optionLetters[idx]}
                      </span>
                      <span className="text-sm font-sans">{option}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-slate-800 bg-slate-800" : "border-slate-300"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation & Submit Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  setCurrentQuestionIndex(prev => prev - 1);
                  setShowHint(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(prev => prev + 1);
                      setShowHint(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-xs transition-all cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="btn-submit-quiz"
                    disabled={isSubmitting}
                    onClick={handleSubmitQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black btn-accent shadow-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    {isSubmitting ? "Submitting..." : "Submit Answers"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette & Rules (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question Palette
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {selectedQuiz.questions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowHint(false);
                      }}
                      className={`h-10 rounded-xl text-xs font-bold transition-all border ${
                        isCurrent
                          ? "ring-2 ring-slate-800 border-slate-800 bg-slate-100 text-slate-950 font-black"
                          : isAnswered
                          ? "bg-[#365b49] text-white border-[#264237]"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#365b49]" />
                  <span>Answered: {answeredCount} of {selectedQuiz.questions.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-200" />
                  <span>Remaining: {selectedQuiz.questions.length - answeredCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Scoring Guidance */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Automated Marking
              </div>
              <p className="leading-relaxed">
                Upon submitting, your score is calculated and recorded in your student profile. You will immediately view full explanations for each choice.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Post-Quiz Results & Explanation Review Mode */
        <div className="space-y-6">
          {/* Score Card Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-[#182622] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e382d] text-[#9fc4b3] text-xs font-semibold border border-[#2d5242]">
                  <Award className="w-4 h-4 text-amber-400" /> Assessment Completed
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">
                  {finalScore !== null && finalScore >= 80
                    ? "Outstanding STEM Mastery! 🌟"
                    : finalScore !== null && finalScore >= 50
                    ? "Good Effort! Keep Practicing 👍"
                    : "Revision Recommended 📚"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Your results have been automatically recorded to your Class {selectedQuiz.class_level} academic record.
                </p>
              </div>

              {/* Big Score Dial */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur border border-white/10 shrink-0 min-w-[130px]">
                <span className="text-4xl font-black text-amber-400 font-outfit">{finalScore}%</span>
                <span className="text-xs text-slate-300 font-medium mt-1">Accuracy Score</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3 justify-center sm:justify-start">
              <button
                onClick={() => resetQuizState(selectedQuiz)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-100 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake This Quiz
              </button>
              <button
                onClick={onBackToLessons}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-accent font-black text-xs shadow-xs transition-all cursor-pointer"
              >
                Return to Video Lessons →
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Explanations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              Detailed Answer Key & Step-by-Step Explanations
            </h3>

            <div className="space-y-4">
              {detailedResults.map((result, idx) => {
                const q = selectedQuiz.questions[idx];
                const isCorrect = result.isCorrect;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border-2 p-5 shadow-xs transition-all space-y-4 ${
                      isCorrect ? "border-emerald-200" : "border-rose-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Question {idx + 1}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 font-outfit">
                            {result.question}
                          </h4>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                      </span>
                    </div>

                    {/* Option Choices Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const wasChosen = result.userSelected === optIdx;
                        const isTheCorrectOne = optIdx === result.correctIndex;
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              isTheCorrectOne
                                ? "bg-emerald-50/80 border-emerald-400 text-emerald-950 font-bold"
                                : wasChosen && !isCorrect
                                ? "bg-rose-50 border-rose-300 text-rose-950 line-through"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            <span>{opt}</span>
                            {isTheCorrectOne && (
                              <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                                Correct Answer
                              </span>
                            )}
                            {wasChosen && !isCorrect && (
                              <span className="text-[10px] uppercase font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Pedagogical Explanation:
                      </div>
                      <p className="text-slate-600">{result.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
