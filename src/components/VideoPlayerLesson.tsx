import React, { useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  FileText, 
  Bookmark, 
  Plus, 
  Calculator, 
  Atom, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { CourseLesson, GradeLevel, Subject, TimestampedNote } from "../types";

interface VideoPlayerLessonProps {
  currentLesson?: CourseLesson | null;
  allLessons: CourseLesson[];
  selectedGrade: GradeLevel;
  onChangeGrade: (grade: GradeLevel) => void;
  onSelectLesson: (lesson: CourseLesson) => void;
  onTakeQuiz: (lessonId: string) => void;
  onMarkComplete: (lessonId: string) => void;
  isCompleted?: boolean;
}

export const VideoPlayerLesson: React.FC<VideoPlayerLessonProps> = ({
  currentLesson,
  allLessons,
  selectedGrade,
  onChangeGrade,
  onSelectLesson,
  onTakeQuiz,
  onMarkComplete,
  isCompleted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "summary" | "transcript">("notes");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<"ALL" | Subject>("ALL");
  const [userCustomNotes, setUserCustomNotes] = useState<TimestampedNote[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [showAddNoteInput, setShowAddNoteInput] = useState(false);

  // Safe active lesson resolution with graceful fallback
  const activeLesson: CourseLesson | null = 
    currentLesson ||
    allLessons.find(l => l.class_level === selectedGrade) ||
    (allLessons && allLessons.length > 0 ? allLessons[0] : null);

  // Filter lessons in sidebar
  const filteredSidebarLessons = allLessons
    .filter(l => l.class_level === selectedGrade)
    .filter(l => selectedSubjectFilter === "ALL" || l.subject === selectedSubjectFilter);

  // Video control helpers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const jumpToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleAddUserNote = () => {
    if (!newNoteText.trim()) return;
    const currentSec = Math.floor(currentTime);
    const newNote: TimestampedNote = {
      timestamp: currentSec,
      timestampFormatted: formatSeconds(currentSec),
      label: "My Personal Note",
      text: newNoteText.trim(),
    };
    setUserCustomNotes([...userCustomNotes, newNote]);
    setNewNoteText("");
    setShowAddNoteInput(false);
  };

  if (!activeLesson) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Lessons Available for Class {selectedGrade}</h3>
        <p className="text-sm text-slate-500 max-w-md">
          Please select another grade level from the curriculum selector or choose from the syllabus.
        </p>
        <div className="flex items-center gap-2 pt-2">
          {([8, 9, 10] as GradeLevel[]).map(g => (
            <button
              key={g}
              onClick={() => onChangeGrade(g)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Class {g}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const lessonNotes = Array.isArray(activeLesson.notes) ? activeLesson.notes : [];
  const combinedNotes = [...lessonNotes, ...userCustomNotes].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-6">
      {/* Top Header Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Class {activeLesson.class_level}</span>
            <span>•</span>
            <span className={activeLesson.subject === "Math" ? "text-[#243b53] font-bold" : "text-[#254636] font-bold"}>
              {activeLesson.subject}
            </span>
            <span>•</span>
            <span>Chapter {activeLesson.chapter_number}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">
            {activeLesson.chapter_title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">{activeLesson.topic}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onMarkComplete(activeLesson.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isCompleted
                ? "bg-[#edf4f0] text-[#254636] border border-[#c4d7cd]"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#365b49]" />
            {isCompleted ? "Marked as Completed" : "Mark Complete"}
          </button>

          <button
            id="btn-take-quiz-top"
            onClick={() => onTakeQuiz(activeLesson.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black btn-accent shadow-xs transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-950" />
            Take Chapter Quiz →
          </button>
        </div>
      </div>

      {/* Main Video & Navigation Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Video Player & Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Video Container */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-md aspect-video flex flex-col justify-end">
            <video
              ref={videoRef}
              src={activeLesson.video_url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handlePlayPause}
            />

            {/* In-Video Overlay Play Button if paused */}
            {!isPlaying && (
              <div 
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-xs transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900/90 text-amber-400 border border-slate-700 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-amber-400 translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Custom Bottom Video Controls Bar */}
            <div className="relative z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 space-y-2 text-white">
              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayPause} className="hover:text-amber-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button onClick={() => jumpToTimestamp(Math.max(0, currentTime - 10))} title="Rewind 10s">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                  </button>
                  <span className="font-mono text-slate-300">
                    {formatSeconds(currentTime)} / {formatSeconds(duration || activeLesson.duration_seconds || 600)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono">1080p HD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Timestamped Notes, Summary, Transcript */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center border-b border-slate-200 px-4 pt-2 gap-2 bg-slate-50/50">
              <button
                id="tab-btn-notes"
                onClick={() => setActiveTab("notes")}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "notes"
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Timestamped Notes ({combinedNotes.length})
              </button>
              <button
                id="tab-btn-summary"
                onClick={() => setActiveTab("summary")}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "summary"
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Key Formulas & Summary
              </button>
              <button
                id="tab-btn-transcript"
                onClick={() => setActiveTab("transcript")}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "transcript"
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Lesson Transcript
              </button>
            </div>

            {/* Tab 1: Timestamped Notes with Jump Capability */}
            {activeTab === "notes" && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Click on any timestamp badge to immediately jump to that portion in the lesson.
                  </p>
                  <button
                    onClick={() => setShowAddNoteInput(!showAddNoteInput)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-500" />
                    Add Note at {formatSeconds(currentTime)}
                  </button>
                </div>

                {showAddNoteInput && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 space-y-2">
                    <div className="text-xs font-semibold text-slate-800">
                      Creating note at timestamp <span className="font-mono">{formatSeconds(currentTime)}</span>:
                    </div>
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Type your notes or key formula here..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddNoteInput(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddUserNote}
                        className="px-3 py-1 text-xs font-bold btn-accent rounded-md shadow-xs"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {combinedNotes.map((note, idx) => {
                    const isPassed = currentTime >= note.timestamp;
                    return (
                      <div
                        key={idx}
                        onClick={() => jumpToTimestamp(note.timestamp)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isPassed
                            ? "bg-slate-50/80 border-slate-200 hover:border-slate-400"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="shrink-0 font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {note.timestampFormatted}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{note.label}</div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Summary & Key Formulas */}
            {activeTab === "summary" && (
              <div className="p-5 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-outfit">
                    Key Chapter Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {(activeLesson.summary || []).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#365b49] mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeLesson.key_formulas && activeLesson.key_formulas.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-[#243b53] uppercase tracking-wider mb-2 font-outfit flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-[#334e68]" />
                      Essential Mathematical & Scientific Formulas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeLesson.key_formulas.map((formula, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-xs">
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Full Transcript */}
            {activeTab === "transcript" && (
              <div className="p-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lesson Audio Transcript</h4>
                <p className="text-xs text-slate-700 leading-loose bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {activeLesson.transcript || "Transcript not available for this lesson."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chapter Navigation Side Menu (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Course Syllabus
              </h3>
              {/* Grade selector pill */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {([8, 9, 10] as GradeLevel[]).map(g => (
                  <button
                    key={g}
                    onClick={() => onChangeGrade(g)}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                      selectedGrade === g ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-500"
                    }`}
                  >
                    Class {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject filter chips */}
            <div className="flex gap-1.5">
              {(["ALL", "Math", "Science"] as const).map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    selectedSubjectFilter === subj
                      ? "bg-slate-100 border-slate-300 text-slate-900 font-black"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {subj === "ALL" ? "All Subjects" : subj}
                </button>
              ))}
            </div>

            {/* Chapter Items List */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredSidebarLessons.map(lesson => {
                const isSelected = lesson.id === activeLesson.id;
                return (
                  <div
                    key={lesson.id}
                    id={`sidebar-lesson-${lesson.id}`}
                    onClick={() => onSelectLesson(lesson)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-slate-100/90 border-slate-300 border-l-4 border-l-amber-500 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`px-1.5 py-0.2 rounded font-semibold ${
                          lesson.subject === "Math" ? "badge-steel" : "badge-sage"
                        }`}>
                          {lesson.subject}
                        </span>
                        <span className="text-slate-400">• Ch {lesson.chapter_number}</span>
                        <span className="text-slate-400 font-mono">({lesson.duration})</span>
                      </div>
                      <div className={`text-xs font-bold line-clamp-1 ${isSelected ? "text-slate-950 font-black" : "text-slate-800"}`}>
                        {lesson.chapter_title}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-500" : "text-slate-300"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Quiz CTA Card */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-[#182622] rounded-2xl text-white shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Ready for Quiz?
            </div>
            <h4 className="text-sm font-bold font-outfit text-white">Test Your Mastery of This Chapter</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Answer 3 timed multiple choice questions to calculate your accuracy and record progress.
            </p>
            <button
              onClick={() => onTakeQuiz(activeLesson.id)}
              className="w-full py-2 px-3 rounded-xl btn-accent font-black text-xs shadow-xs transition-all text-center cursor-pointer"
            >
              Start Chapter Quiz Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
