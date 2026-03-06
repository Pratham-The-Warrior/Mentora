import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain, ArrowRight, CheckCircle2, Clock, Sparkles,
  ChevronDown, ChevronUp, Trophy, Target, Flame,
  BookOpen, Layers, BarChart3, Star, ExternalLink, GraduationCap
} from "lucide-react"
import { AuthNavbar } from "../components/layout/auth-navbar"
import { Link } from "react-router-dom"
import api from "@/lib/api"

// ─── Types ──────────────────────────────────────────────────────────────────
interface CourseRecommendation {
  title: string
  platform: 'Coursera' | 'NPTEL' | 'YouTube' | 'freeCodeCamp' | 'Khan Academy' | 'Udemy' | 'edX'
  url: string
  effort: string
  isFree: boolean
  tags: string[]
}

// ─── Platform config for badges and colors ───────────────────────────────────
const platformConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  Coursera: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/40", emoji: "🎓" },
  NPTEL: { color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40", emoji: "🏛️" },
  YouTube: { color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/40", emoji: "▶️" },
  freeCodeCamp: { color: "text-green-700 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/40", emoji: "💻" },
  'Khan Academy': { color: "text-teal-700 dark:text-teal-300", bg: "bg-teal-100 dark:bg-teal-900/40", emoji: "📖" },
  Udemy: { color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-100 dark:bg-purple-900/40", emoji: "🎯" },
  edX: { color: "text-indigo-700 dark:text-indigo-300", bg: "bg-indigo-100 dark:bg-indigo-900/40", emoji: "🌍" },
}

// ─── CoursePanel sub-component ───────────────────────────────────────────────
function CoursePanel({ milestoneIndex }: { milestoneIndex: number }) {
  const [courses, setCourses] = useState<CourseRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [open, setOpen] = useState(false)

  const handleFetch = async () => {
    if (fetched) { setOpen(!open); return }
    setOpen(true)
    setLoading(true)
    try {
      const res = await api.get(`/courses/milestone/${milestoneIndex}`)
      setCourses(res.data.courses)
      setFetched(true)
    } catch (e) {
      console.error("Failed to fetch courses", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 border-t border-gray-100 dark:border-gray-700/50 pt-4">
      <button
        onClick={handleFetch}
        className="flex items-center gap-2 w-full text-left group"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/40 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-950/30 dark:hover:to-orange-950/30 transition-all w-full">
          <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex-1">
            {fetched ? "Recommended Courses" : "✨ Find Courses for This Phase"}
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            {fetched ? `${courses.length} courses` : "Free + Paid"}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
        </div>
      </button>

      {open && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
            <div className="flex items-center gap-3 py-4 px-2">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Finding the best courses for you...</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {courses.map((course, i) => {
                const cfg = platformConfig[course.platform] ?? platformConfig.Coursera
                return (
                  <a
                    key={i}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/70 dark:bg-gray-700/30 hover:border-amber-200 dark:hover:border-amber-700/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/10 hover:shadow-sm transition-all duration-200 group"
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors leading-snug truncate pr-2">
                            {course.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                              {course.platform}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {course.effort}
                            </span>
                            {course.isFree ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">FREE</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">Paid</span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      {course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-[10px] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                )
              })}
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1 pb-1">
                Curated resources from Coursera, NPTEL, YouTube, Khan Academy &amp; more
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


interface Milestone {
  title: string
  duration: string
  description: string
  tasks: string[]
  completed: boolean
  completedAt?: string
}

interface RoadmapData {
  _id: string
  focusArea: string
  status: string
  milestones: Milestone[]
  createdAt: string
}

const focusAreaMeta: Record<string, { label: string; icon: string; color: string; gradient: string }> = {
  career: { label: "Career Development", icon: "🎯", color: "from-blue-500 to-indigo-600", gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" },
  exams: { label: "Exam Preparation", icon: "📚", color: "from-orange-500 to-red-600", gradient: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30" },
  skills: { label: "Technical Skills", icon: "💻", color: "from-green-500 to-teal-600", gradient: "from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30" },
  college: { label: "College Readiness", icon: "🏛️", color: "from-purple-500 to-violet-600", gradient: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30" },
}

const phaseColors = [
  { bg: "from-blue-600 to-indigo-600", ring: "ring-blue-200 dark:ring-blue-900", badge: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300", bar: "from-blue-500 to-indigo-500" },
  { bg: "from-violet-600 to-purple-600", ring: "ring-violet-200 dark:ring-violet-900", badge: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300", bar: "from-violet-500 to-purple-500" },
  { bg: "from-emerald-600 to-teal-600", ring: "ring-emerald-200 dark:ring-emerald-900", badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300", bar: "from-emerald-500 to-teal-500" },
  { bg: "from-amber-500 to-orange-600", ring: "ring-amber-200 dark:ring-amber-900", badge: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300", bar: "from-amber-400 to-orange-500" },
  { bg: "from-rose-600 to-pink-600", ring: "ring-rose-200 dark:ring-rose-900", badge: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300", bar: "from-rose-500 to-pink-500" },
]

function MilestoneCard({
  milestone, index, total, onToggle, toggling,
}: {
  milestone: Milestone; index: number; total: number; onToggle: () => void; toggling: boolean
}) {
  const [expanded, setExpanded] = useState(index === 0)
  const color = phaseColors[index % phaseColors.length]
  const isLast = index === total - 1

  return (
    <div className="flex gap-4 md:gap-6">
      {/* Timeline line + circle */}
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={onToggle}
          disabled={toggling}
          title={milestone.completed ? "Mark incomplete" : "Mark complete"}
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
            shadow-lg ring-4 ${color.ring} transition-all duration-500 z-10
            ${milestone.completed
              ? "bg-gradient-to-br from-green-400 to-emerald-600 scale-105"
              : `bg-gradient-to-br ${color.bg} hover:scale-110 active:scale-95`
            }
            ${toggling ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {milestone.completed ? (
            <CheckCircle2 className="w-6 h-6 drop-shadow" />
          ) : (
            <span className="text-sm font-bold">{index + 1}</span>
          )}
          {milestone.completed && (
            <span className="absolute -top-1 -right-1 text-sm">✨</span>
          )}
        </button>
        {!isLast && (
          <div className={`w-0.5 flex-1 my-1 rounded-full transition-all duration-700 ${milestone.completed ? "bg-gradient-to-b from-green-400 to-emerald-300 opacity-70" : "bg-gray-200 dark:bg-gray-700"
            }`} style={{ minHeight: "3rem" }} />
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-6 rounded-2xl border overflow-hidden shadow-md transition-all duration-500 ${milestone.completed
        ? "border-green-200 dark:border-green-800/60 bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:from-green-950/20 dark:to-emerald-950/10"
        : "border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 hover:shadow-xl hover:-translate-y-0.5"
        }`}>
        {/* Card top accent bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${milestone.completed ? "from-green-400 to-emerald-500" : color.bar}`} />

        <div className="p-5 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${color.badge} border-0 font-semibold text-xs px-3 py-1`}>
                  Phase {index + 1}
                </Badge>
                <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 text-xs flex items-center gap-1 px-2 py-1">
                  <Clock className="w-3 h-3" /> {milestone.duration}
                </Badge>
                {milestone.completed && (
                  <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-0 text-xs px-2 py-1">
                    ✓ Completed
                  </Badge>
                )}
              </div>
              <h3 className={`text-xl font-bold tracking-tight transition-all ${milestone.completed ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
                }`}>
                {milestone.title}
              </h3>
              <p className={`text-sm mt-1.5 leading-relaxed ${milestone.completed ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
                }`}>
                {milestone.description}
              </p>
            </div>
          </div>

          {/* Task progress bar */}
          <div className="mt-4 mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <span>{milestone.tasks.length} key tasks</span>
              {milestone.completed && <span className="text-green-600 dark:text-green-400 font-medium">All done 🎉</span>}
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${milestone.completed ? "from-green-400 to-emerald-500" : color.bar
                  }`}
                style={{ width: milestone.completed ? "100%" : "0%" }}
              />
            </div>
          </div>

          {/* Expandable task list */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mt-2"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? "Hide tasks" : "Show tasks"}
          </button>

          {expanded && (
            <ul className="mt-4 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              {milestone.tasks.map((task, i) => (
                <li key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${milestone.completed
                  ? "bg-green-50/60 dark:bg-green-950/10"
                  : "bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${milestone.completed
                    ? "bg-green-100 dark:bg-green-900/40"
                    : `bg-gradient-to-br ${color.bg} opacity-80`
                    }`}>
                    {milestone.completed
                      ? <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                      : <span className="text-white text-[9px] font-bold">{i + 1}</span>
                    }
                  </div>
                  <span className={`text-sm leading-relaxed ${milestone.completed ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-700 dark:text-gray-200"
                    }`}>
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Course Recommendations */}
          <CoursePanel milestoneIndex={index} />

          {/* Mark complete button */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={onToggle}
              disabled={toggling}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${milestone.completed
                ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
                : `bg-gradient-to-r ${color.bg} text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {toggling ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : milestone.completed ? (
                <><CheckCircle2 className="w-4 h-4" /> Mark Incomplete</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Mark as Complete</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RoadmapPage() {
  const [userData, setUserData] = useState<{ class: string; stream: string; interests: string[]; goals?: string } | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [togglingIndex, setTogglingIndex] = useState<number | null>(null)
  const [justCompleted, setJustCompleted] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const data = localStorage.getItem("onboardingData")
    if (data) setUserData(JSON.parse(data))
    const fetchRoadmap = async () => {
      try {
        const res = await api.get("/roadmap")
        setRoadmap(res.data.roadmap)
      } catch { /* no roadmap yet */ }
      finally { setLoading(false) }
    }
    fetchRoadmap()
  }, [])

  const handleToggleMilestone = async (index: number) => {
    if (!roadmap) return
    setTogglingIndex(index)
    try {
      const res = await api.patch(`/roadmap/milestone/${index}`)
      const updated: RoadmapData = res.data.roadmap
      setRoadmap(updated)
      const allDone = updated.milestones.every((m) => m.completed)
      if (allDone && !justCompleted) {
        setJustCompleted(true)
        setTimeout(() => setJustCompleted(false), 5000)
      }
    } catch (err) { console.error(err) }
    finally { setTogglingIndex(null) }
  }

  const completedCount = roadmap?.milestones.filter((m) => m.completed).length ?? 0
  const totalCount = roadmap?.milestones.length ?? 0
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const meta = focusAreaMeta[roadmap?.focusArea ?? "career"] ?? focusAreaMeta.career

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center p-8">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-3">Complete Onboarding First</h2>
          <p className="text-blue-200 mb-8">We need your profile to generate a personalized roadmap.</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Link to="/onboarding">Start Onboarding <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <AuthNavbar />

      {/* ── Hero Header ── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} border-b border-gray-200/60 dark:border-gray-800/60`}>
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Left — Title */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{meta.icon}</span>
                <Badge className={`bg-gradient-to-r ${meta.color} text-white border-0 text-sm font-semibold px-4 py-1.5 shadow`}>
                  {meta.label}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                Your Learning<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Roadmap</span>
              </h1>
              {roadmap && (
                <p className="mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  Generated {new Date(roadmap.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  {userData.stream && <> · <span className="text-blue-600 dark:text-blue-400">{userData.stream} Stream</span></>}
                </p>
              )}
            </div>

            {/* Right — Progress Ring */}
            {roadmap && (
              <div className="flex items-center gap-6">
                {/* Circle progress */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                    <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                    <circle
                      cx="56" cy="56" r="48" fill="none" strokeWidth="8" strokeLinecap="round"
                      stroke="url(#prog-grad)"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - progressPercent / 100)}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{progressPercent}%</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Done</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">{completedCount}/{totalCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Milestones</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">{roadmap.milestones.reduce((a, m) => a + m.tasks.length, 0)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Completion Celebration Banner ── */}
      {justCompleted && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-4 text-center animate-in slide-in-from-top-2 duration-500">
          <span className="text-xl font-bold">🎉 Incredible! You've completed your entire roadmap! 🏆</span>
          <p className="text-green-100 text-sm mt-1">Your hard work and dedication have paid off. Go celebrate!</p>
        </div>
      )}

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
                <Brain className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading your roadmap...</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !roadmap && (
          <div className="py-10">
            {/* Glassy empty card */}
            <div className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm shadow-2xl p-10 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                  Ready to map your future?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
                  Generate a personalized AI roadmap based on your profile.
                </p>
                {userData.stream && (
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-8">
                    {userData.stream} Stream · {userData.interests?.slice(0, 2).join(" & ")}
                  </p>
                )}
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" asChild>
                  <Link to="/dashboard">Generate My Roadmap <ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-8">
                  {[{ icon: <Target className="w-3 h-3" />, label: "Goal-aligned" },
                  { icon: <BookOpen className="w-3 h-3" />, label: "Curated tasks" },
                  { icon: <BarChart3 className="w-3 h-3" />, label: "Progress tracking" },
                  { icon: <Layers className="w-3 h-3" />, label: "Phase-by-phase" }].map((chip) => (
                    <span key={chip.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                      {chip.icon} {chip.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Roadmap Timeline ── */}
        {!loading && roadmap && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Timeline */}
            <div ref={confettiRef} className="min-w-0">
              {/* Generate new prompt */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Journey</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Click on the phase circles to mark them complete</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300 bg-transparent" asChild>
                  <Link to="/dashboard"><Sparkles className="w-3.5 h-3.5" /> New Roadmap</Link>
                </Button>
              </div>

              {roadmap.milestones.map((milestone, index) => (
                <MilestoneCard
                  key={index}
                  milestone={milestone}
                  index={index}
                  total={roadmap.milestones.length}
                  onToggle={() => handleToggleMilestone(index)}
                  toggling={togglingIndex === index}
                />
              ))}

              {/* Completion end state */}
              {completedCount === totalCount && totalCount > 0 && (
                <div className="mt-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white shadow-2xl animate-in zoom-in-95 duration-500">
                  <Trophy className="w-14 h-14 mx-auto mb-4 drop-shadow-lg" />
                  <h3 className="text-2xl font-extrabold mb-2">Roadmap Complete! 🎉</h3>
                  <p className="text-green-100 mb-6">You've finished all {totalCount} milestones. Time to take the next step!</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold" asChild>
                      <Link to="/counselor">Talk to Counselor</Link>
                    </Button>
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                      <Link to="/explore">Explore Careers</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">
              {/* Overall progress card */}
              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Overall Progress
                </h3>
                <div className="space-y-4">
                  {roadmap.milestones.map((m, i) => {
                    const c = phaseColors[i % phaseColors.length]
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-600 dark:text-gray-400 font-medium truncate max-w-[180px]">{m.title}</span>
                          <span className={m.completed ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-400"}>{m.completed ? "✓" : "–"}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${m.completed ? "from-green-400 to-emerald-500" : c.bar}`}
                            style={{ width: m.completed ? "100%" : "0%" }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Milestone summary */}
              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Phases", value: totalCount, icon: "🗺️" },
                    { label: "Completed", value: completedCount, icon: "✅" },
                    { label: "Remaining", value: totalCount - completedCount, icon: "⏳" },
                    { label: "Total Tasks", value: roadmap.milestones.reduce((a, m) => a + m.tasks.length, 0), icon: "📋" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span>{stat.icon}</span> {stat.label}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start gap-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" asChild>
                    <Link to="/dashboard"><Target className="w-4 h-4" /> Dashboard</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm bg-transparent dark:border-gray-700 dark:text-gray-300" asChild>
                    <Link to="/explore"><Layers className="w-4 h-4" /> Explore Careers</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm bg-transparent dark:border-gray-700 dark:text-gray-300" asChild>
                    <Link to="/counselor"><Brain className="w-4 h-4" /> Talk to Counselor</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
