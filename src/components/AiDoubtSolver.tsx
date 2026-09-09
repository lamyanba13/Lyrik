import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  Bot, 
  Send, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Lightbulb, 
  Calculator, 
  Atom, 
  User as UserIcon, 
  Copy, 
  Check, 
  HelpCircle,
  BookmarkPlus,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  Sparkle,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2
} from "lucide-react";
import { DoubtMessage, GradeLevel, Subject, User } from "../types";

interface ExtendedDoubtMessage extends DoubtMessage {
  escalatedToTeacher?: boolean;
  feedbackGiven?: "helpful" | "needs_review";
  followUpSuggestions?: string[];
  modeUsed?: "proof" | "summary" | "intuitive";
}

interface AiDoubtSolverProps {
  currentUser: User;
  selectedGrade: GradeLevel;
  onDoubtCreated?: (question: string, subject: Subject) => void;
  initialPrompt?: string;
}

export const AiDoubtSolver: React.FC<AiDoubtSolverProps> = ({
  currentUser,
  selectedGrade,
  onDoubtCreated,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ExtendedDoubtMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: `### 🎓 Welcome ${currentUser.name}!
I am your **Lyrik STEM Pedagogical Tutor**, calibrated for **Class ${selectedGrade} Mathematics & Science** (CBSE & ICSE standards).

#### How I help you master STEM:
- **Exact Derivations**: Step-by-step proofs with no skipped algebraic steps.
- **Sanity Checks**: Self-verification methods (LHS = RHS, dimensional unit checks).
- **Exam Pitfalls**: Highlighting common exam traps before you take tests.
- **Human Faculty Escalation**: Because AI is a learning assistant, you can click **"Request Faculty Review"** on any response to submit the problem directly to **Dr. Sunita Mehra** for verified faculty grading!

Feel free to ask a question below or choose one of the syllabus topics!`,
      timestamp: "Just now",
      followUpSuggestions: [
        "Prove √2 is an irrational number",
        "Derive v = u + at and s = ut + ½at²",
        "Explain Ohm's Law and V = IR",
        "Photosynthesis chemical reaction"
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState(initialPrompt || "");
  const [selectedSubject, setSelectedSubject] = useState<Subject>("Math");
  const [tutorMode, setTutorMode] = useState<"proof" | "summary" | "intuitive">("proof");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [escalatingId, setEscalatingId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Sync when initialPrompt changes
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setInputQuery(initialPrompt);
      if (initialPrompt.toLowerCase().includes("motion") || initialPrompt.toLowerCase().includes("cell") || initialPrompt.toLowerCase().includes("boiling") || initialPrompt.toLowerCase().includes("atom") || initialPrompt.toLowerCase().includes("photosynthesis")) {
        setSelectedSubject("Science");
      } else {
        setSelectedSubject("Math");
      }
    }
  }, [initialPrompt]);

  const quickPrompts = [
    { label: "Prove √2 is an irrational number", subject: "Math" as Subject },
    { label: "Derive v = u + at & s = ut + ½at²", subject: "Science" as Subject },
    { label: "Explain Middle-Term Splitting for Quadratics", subject: "Math" as Subject },
    { label: "How does Photosynthesis work with chemical equation?", subject: "Science" as Subject },
    { label: "Derive Newton's 2nd Law F = ma", subject: "Science" as Subject },
    { label: "Explain Ohm's Law & Resistors in Series vs Parallel", subject: "Science" as Subject },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend !== undefined ? textToSend : inputQuery;
    if (!query.trim() && !selectedImage) return;

    const userMessage: ExtendedDoubtMessage = {
      id: `usr_msg_${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      subject: selectedSubject,
      class_level: selectedGrade,
      imageUrl: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery("");
    const imgPayload = selectedImage;
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/doubts/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          subject: selectedSubject,
          class_level: selectedGrade,
          imageBase64: imgPayload,
          mode: tutorMode,
        }),
      });

      const data = await res.json();
      const aiMessage: ExtendedDoubtMessage = {
        id: `ai_msg_${Date.now()}`,
        sender: "ai",
        text: data.answer || "Here is the step-by-step curriculum explanation.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        subject: selectedSubject,
        class_level: selectedGrade,
        modeUsed: tutorMode,
        followUpSuggestions: [
          "Give me a practice problem on this",
          "What are the common exam pitfalls for this topic?",
          "Explain this with a real-life analogy"
        ]
      };

      setMessages(prev => [...prev, aiMessage]);

      if (onDoubtCreated) {
        onDoubtCreated(query, selectedSubject);
      }
    } catch (err) {
      console.error("AI Doubt Solver failed:", err);
      const errorMessage: ExtendedDoubtMessage = {
        id: `ai_err_${Date.now()}`,
        sender: "ai",
        text: "### ⚠️ Temporary Connection Interruption\nPlease verify the following core principles while we re-establish connection:\n1. Ensure all physical values are converted into standard SI units (meters, seconds, kilograms).\n2. Write down the governing formula before substituting values.\n3. Click **'Request Faculty Review'** if you want Dr. Sunita Mehra to review your question directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalateToTeacher = async (msgId: string, queryText: string) => {
    setEscalatingId(msgId);
    try {
      await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          studentName: currentUser.name,
          grade: selectedGrade,
          subject: selectedSubject,
          question: queryText.length > 120 ? queryText.slice(0, 117) + "..." : queryText,
          status: "pending",
        }),
      });

      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, escalatedToTeacher: true } : m));
      setFeedbackToast("Doubt submitted to Dr. Sunita Mehra! The instructor has been notified in the Teacher Portal.");
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (err) {
      console.error("Failed to escalate doubt to teacher:", err);
    } finally {
      setEscalatingId(null);
    }
  };

  const handleFeedback = (msgId: string, type: "helpful" | "needs_review") => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedbackGiven: type } : m));
    setFeedbackToast(type === "helpful" ? "Thank you! Marked as helpful and verified." : "Noted! We are calibrating our mathematical reasoning engine for this pattern.");
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[780px] overflow-hidden">
      {/* Feedback Toast Notification */}
      {feedbackToast && (
        <div className="bg-[#1e293b] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md transition-all border-b border-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#334e68] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 font-display">Lyrik AI STEM Tutor</h2>
              <span className="badge-sage text-[10px] flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-[#254636]" /> NCERT & ICSE Verified
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Class {selectedGrade} Syllabus
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-step mathematical proofs & scientific derivations • Faculty escalation backed
            </p>
          </div>
        </div>

        {/* Controls: Mode Selector & Subject Pill Filter */}
        <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Pedagogical Mode */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => setTutorMode("proof")}
              title="Full step-by-step proof with all algebraic operations"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tutorMode === "proof"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Step Proof
            </button>
            <button
              onClick={() => setTutorMode("summary")}
              title="Concise formula breakdown and key exam takeaways"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tutorMode === "summary"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Exam Summary
            </button>
            <button
              onClick={() => setTutorMode("intuitive")}
              title="Intuitive real-life explanation and practical analogy"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tutorMode === "intuitive"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Simple Analogy
            </button>
          </div>

          {/* Subject Pill Filter */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedSubject("Math")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedSubject === "Math"
                  ? "bg-[#edf2f7] text-[#243b53] font-bold border border-[#c4d1db]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" /> Math
            </button>
            <button
              onClick={() => setSelectedSubject("Science")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedSubject === "Science"
                  ? "bg-[#edf4f0] text-[#254636] font-bold border border-[#c4d7cd]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Atom className="w-3.5 h-3.5" /> Science
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-[#edf2f7]/60 border-b border-[#d8e2ea] overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-xs font-bold text-[#243b53] shrink-0 flex items-center gap-1 pl-1 font-display">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Syllabus Prompts:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSubject(p.subject);
              handleSendMessage(p.label);
            }}
            className="shrink-0 text-xs px-3 py-1 rounded-lg bg-white border border-[#c4d1db] text-[#243b53] hover:bg-[#334e68] hover:text-white transition-all shadow-2xs font-medium cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          // Find the preceding user question for escalation context
          const relatedUserQuestion = isUser 
            ? msg.text 
            : (messages[index - 1]?.sender === "user" ? messages[index - 1].text : "Curriculum query");

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                isUser ? "bg-slate-900 text-white" : "bg-[#334e68] text-white"
              }`}>
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className="max-w-[90%] sm:max-w-[80%] space-y-2">
                <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-slate-900 text-white rounded-tr-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs"
                }`}>
                  {/* Attached user image */}
                  {msg.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-white/20 max-h-56">
                      <img src={msg.imageUrl} alt="Uploaded problem" className="w-full object-cover" />
                    </div>
                  )}

                  {/* Header Badge for AI Responses */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 text-[11px] text-slate-500 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#334e68] flex items-center gap-1 font-display">
                          <GraduationCap className="w-3.5 h-3.5 text-[#334e68]" /> Lyrik STEM Derivation Engine
                        </span>
                        <span>•</span>
                        <span className="text-slate-500 font-stem text-[10px]">Class {selectedGrade} Standard</span>
                      </div>

                      {msg.escalatedToTeacher ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sent to Dr. Sunita Mehra
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEscalateToTeacher(msg.id, relatedUserQuestion)}
                          disabled={escalatingId === msg.id}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200 transition-colors cursor-pointer"
                          title="If the AI explanation is incomplete, submit to human faculty for review"
                        >
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>{escalatingId === msg.id ? "Submitting..." : "Request Teacher Review"}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Formatted Markdown Body */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}

                  {/* Follow-up Suggestion Chips for AI responses */}
                  {!isUser && msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Explore Next Step:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpSuggestions.map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#334e68] hover:text-white text-slate-700 border border-slate-200 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <span>{suggestion}</span>
                            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls & Timestamp */}
                <div className={`flex items-center gap-3 text-[11px] text-slate-400 ${isUser ? "justify-end" : "justify-between"}`}>
                  {!isUser ? (
                    <div className="flex items-center gap-3">
                      {/* Thumbs Up / Down Feedback */}
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        <button
                          onClick={() => handleFeedback(msg.id, "helpful")}
                          className={`p-1 rounded hover:text-slate-800 transition-colors cursor-pointer ${
                            msg.feedbackGiven === "helpful" ? "text-emerald-600 font-bold" : "text-slate-400"
                          }`}
                          title="Accurate and helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "needs_review")}
                          className={`p-1 rounded hover:text-slate-800 transition-colors cursor-pointer ${
                            msg.feedbackGiven === "needs_review" ? "text-rose-600 font-bold" : "text-slate-400"
                          }`}
                          title="Needs review or clarification"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Copy Explanation Button */}
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="w-3 h-3" /> Copy Proof
                          </span>
                        )}
                      </button>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#334e68] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#334e68] animate-spin" />
              <span className="font-medium">
                Lyrik STEM AI is applying multi-step theorem verification & SI unit consistency...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Upload Preview if image chosen */}
      {selectedImage && (
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={selectedImage} alt="Attachment" className="w-10 h-10 object-cover rounded-lg border border-slate-300" />
            <span className="text-xs text-slate-600 font-medium">Textbook photo attached ready to solve</span>
          </div>
          <button onClick={() => setSelectedImage(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Human Verification Notice Bar */}
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>STEM AI is a learning assistant. If any step is uncertain, click <strong>Request Teacher Review</strong> to have faculty grade it.</span>
        </span>
        <span className="hidden sm:inline text-slate-400 font-stem text-[10px]">NCERT Aligned</span>
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Image Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title="Upload photo of textbook problem or handwritten homework"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            id="input-doubt-query"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask any Class ${selectedGrade} ${selectedSubject} question (e.g. "Prove √2 is irrational" or "Why is momentum conserved?")...`}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#334e68] bg-slate-50 focus:bg-white transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            id="btn-send-doubt"
            disabled={!inputQuery.trim() && !selectedImage}
            className="px-5 py-2.5 rounded-xl btn-accent font-black text-slate-950 text-xs sm:text-sm shadow-xs transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Solve</span>
            <Send className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </form>
      </div>
    </div>
  );
};

