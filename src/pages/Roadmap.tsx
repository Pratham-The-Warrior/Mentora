import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Brain, ArrowRight, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Home, Printer,
  BarChart3, FileText, Compass, ExternalLink,
  GraduationCap, Sparkles
} from "lucide-react"
import { AuthNavbar } from "../components/layout/auth-navbar"
import { Link } from "react-router-dom"
import api from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────
interface CourseRecommendation {
  title: string
  platform: 'Coursera' | 'NPTEL' | 'YouTube' | 'freeCodeCamp' | 'Khan Academy' | 'Udemy' | 'edX'
  url: string
  effort: string
  isFree: boolean
  tags: string[]
}

interface Milestone {
  title: string
  duration: string
  description: string
  tasks: string[]
  completed: boolean
  completedAt?: string
  category?: string
}

interface RoadmapData {
  _id: string
  focusArea: string
  status: string
  milestones: Milestone[]
  createdAt: string
}

// ─── Platform config ────────────────────────────────────────────────────────
const platformConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  Coursera: { color: "text-blue-700", bg: "bg-blue-100", emoji: "🎓" },
  NPTEL: { color: "text-orange-700", bg: "bg-orange-100", emoji: "🏛️" },
  YouTube: { color: "text-red-700", bg: "bg-red-100", emoji: "▶️" },
  freeCodeCamp: { color: "text-green-700", bg: "bg-green-100", emoji: "💻" },
  'Khan Academy': { color: "text-teal-700", bg: "bg-teal-100", emoji: "📖" },
  Udemy: { color: "text-purple-700", bg: "bg-purple-100", emoji: "🎯" },
  edX: { color: "text-indigo-700", bg: "bg-indigo-100", emoji: "🌍" },
}

// ─── Focus area metadata ────────────────────────────────────────────────────
const focusAreaMeta: Record<string, { label: string; icon: string }> = {
  career: { label: "CAREER DEVELOPMENT", icon: "🎯" },
  exams: { label: "EXAM PREPARATION", icon: "📚" },
  skills: { label: "TECHNICAL SKILLS", icon: "💻" },
  college: { label: "COLLEGE READINESS", icon: "🏛️" },
}

// ─── TaskResourcePanel ──────────────────────────────────────────────────────
function TaskResourcePanel({ milestoneIndex, taskIndex }: { milestoneIndex: number; taskIndex: number }) {
  const [resources, setResources] = useState<CourseRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [fetched, setFetched] = useState(false)

  const handleFetch = async () => {
    if (fetched) { setOpen(!open); return }
    setOpen(true)
    setLoading(true)
    try {
      const res = await api.get(`/courses/task/${milestoneIndex}/${taskIndex}`)
      setResources(res.data.resources)
      setFetched(true)
    } catch (e) {
      console.error("Failed to fetch resources", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleFetch}
        className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#3d7a4a] hover:text-[#2d5a38] transition-colors mt-1.5 uppercase"
      >
        <Compass className="w-3.5 h-3.5" />
        Need help finding resources?
      </button>

      {open && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 py-3 px-2"
            >
              <div className="w-4 h-4 border-2 border-[#3d7a4a] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500 italic">Curating best resources for you...</span>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="space-y-2 pl-1"
            >
              {resources.map((course, i) => {
                const cfg = platformConfig[course.platform] ?? platformConfig.Coursera
                return (
                  <motion.a
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-100 bg-white/80 backdrop-blur-sm hover:border-[#3d7a4a]/30 hover:bg-green-50/40 hover:shadow-md transition-all group"
                  >
                    <span className="text-lg flex-shrink-0">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-[#3d7a4a] transition-colors truncate pr-2">
                        {course.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                          {course.platform}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {course.effort}
                        </span>
                        {course.isFree && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">FREE</span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#3d7a4a] transition-colors flex-shrink-0 mt-0.5" />
                  </motion.a>
                )
              })}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── MilestoneCard ──────────────────────────────────────────────────────────
function MilestoneCard({
  milestone, index, total, onToggle, toggling, isLocked,
}: {
  milestone: Milestone; index: number; total: number; onToggle: () => void; toggling: boolean; isLocked: boolean
}) {
  const [expanded, setExpanded] = useState(index === 0 && !isLocked)
  const isLast = index === total - 1

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    }
  }

  // ── Locked / collapsed row ──
  if (isLocked) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 md:gap-5 mb-2"
      >
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-[#3d7a4a]/30 text-[#3d7a4a]/50 bg-white/50 z-10">
            {index + 1}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 my-1 rounded-full bg-gray-200/50" style={{ minHeight: "1rem" }} />
          )}
        </div>

        <div className="flex-1 mb-4 rounded-xl border border-dashed border-gray-200 bg-white/30 backdrop-blur-[2px] p-4 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-gray-400 tracking-wide uppercase">
            Phase {index + 1} • Locked
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggle}
              disabled={toggling || isLocked}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#3d7a4a]/40 text-white cursor-not-allowed opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Complete
            </button>
            <ChevronDown className="w-5 h-5 text-[#3d7a4a]/30" />
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Expanded / collapsible card ──
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex gap-4 md:gap-5"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={onToggle}
          disabled={toggling}
          title={milestone.completed ? "Mark incomplete" : "Mark complete"}
          className={`
            relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            transition-all duration-300 z-10
            ${milestone.completed
              ? "bg-[#3d7a4a] text-white shadow-md"
              : "bg-[#3d7a4a] text-white shadow-md hover:scale-110 active:scale-95"
            }
            ${toggling ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {milestone.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <span>{index + 1}</span>
          )}
        </button>
        {!isLast && (
          <div className={`w-0.5 flex-1 my-1 rounded-full transition-all duration-700 ${milestone.completed ? "bg-[#3d7a4a]/40" : "bg-gray-200"
            }`} style={{ minHeight: "3rem" }} />
        )}
      </div>

      <div className={`flex-1 mb-6 rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${milestone.completed
        ? "border-[#3d7a4a]/30 bg-green-50/40"
        : "border-gray-200 bg-white hover:shadow-md"
        }`}>
        <div className={`h-1 w-full ${milestone.completed ? "bg-[#3d7a4a]" : "bg-[#3d7a4a]"}`} />

        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded text-xs font-bold text-gray-700 bg-gray-100 uppercase tracking-wide">
                  Phase {index + 1}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" /> {milestone.duration}
                </span>
                {milestone.completed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-[#3d7a4a] bg-green-100">
                    ✓ Completed
                  </span>
                )}
              </div>
              <h3 className={`text-xl font-bold tracking-tight ${milestone.completed ? "text-gray-400" : "text-gray-900"}`}>
                {milestone.title}
              </h3>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            >
              {expanded ? <ChevronUp className="w-5 h-5 text-[#3d7a4a]" /> : <ChevronDown className="w-5 h-5 text-[#3d7a4a]" />}
            </button>
          </div>

          <p className={`text-sm mt-2 leading-relaxed ${milestone.completed ? "text-gray-400" : "text-gray-600"}`}>
            {milestone.description}
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-5 pb-1">
                  <p className="text-xs font-bold text-[#3d7a4a] uppercase tracking-wider mb-4">
                    {milestone.tasks.length} Key Tasks
                  </p>

                  <div className="space-y-3">
                    {milestone.tasks.map((task, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-lg transition-all ${milestone.completed
                          ? "bg-green-50/60"
                          : "bg-gray-50 hover:bg-gray-100/80 hover:scale-[1.01] active:scale-100"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${milestone.completed
                            ? "bg-green-100 text-[#3d7a4a]"
                            : "border-2 border-[#3d7a4a] text-[#3d7a4a]"
                            }`}>
                            {milestone.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm leading-relaxed ${milestone.completed ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}>
                              {task}
                            </span>
                            {!milestone.completed && (
                              <TaskResourcePanel milestoneIndex={index} taskIndex={i} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onToggle}
                      disabled={toggling}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-300 ${milestone.completed
                        ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                        : "bg-[#3d7a4a] text-white hover:bg-[#2d5a38] shadow-md hover:shadow-lg"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {toggling ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {milestone.completed ? "Mark Incomplete" : "Mark Phase as Complete"}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const [userData, setUserData] = useState<{ class: string; stream: string; interests: string[]; goals?: string } | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [togglingIndex, setTogglingIndex] = useState<number | null>(null)
  const [justCompleted, setJustCompleted] = useState(false)

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
  const totalTasks = roadmap?.milestones.reduce((a, m) => a + m.tasks.length, 0) ?? 0
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const meta = focusAreaMeta[roadmap?.focusArea ?? "career"] ?? focusAreaMeta.career

  // Find the first uncompleted milestone index for locking logic
  const firstUncompletedIndex = roadmap?.milestones.findIndex(m => !m.completed) ?? 0

  // Get unique categories with progress for sidebar
  const categoryProgress = (() => {
    if (!roadmap) return []
    const catMap = new Map<string, { total: number; done: number }>()
    roadmap.milestones.forEach(m => {
      const cat = m.category || m.title
      const entry = catMap.get(cat) || { total: 0, done: 0 }
      entry.total++
      if (m.completed) entry.done++
      catMap.set(cat, entry)
    })
    return Array.from(catMap.entries()).map(([name, { total, done }]) => ({
      name,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    }))
  })()

  // ── No onboarding data ──
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Brain className="w-16 h-16 text-[#3d7a4a] mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Complete Onboarding First</h2>
          <p className="text-gray-500 mb-8">We need your profile to generate a personalized roadmap.</p>
          <Button asChild size="lg" className="bg-[#3d7a4a] hover:bg-[#2d5a38] text-white">
            <Link to="/onboarding">Start Onboarding <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] relative overflow-hidden" id="roadmap-printable">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-green-100/50 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] rounded-full bg-blue-50/40 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[15%] w-[30%] h-[30%] rounded-full bg-teal-50/50 blur-[110px]" />
      </div>

      <div className="relative z-10">
        <AuthNavbar />

        {/* ── Hero Section ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left — Title */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#3d7a4a] uppercase tracking-wider">
                    {meta.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <FileText className="w-4 h-4" /> {userData.class || "High School"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Your Learning<br />
                  <span className="text-[#3d7a4a]">Roadmap</span>
                </h1>
                {roadmap && (
                  <p className="mt-3 text-[#3d7a4a] font-medium">
                    Generated {new Date(roadmap.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    {userData.stream && <> • {userData.stream} Stream</>}
                  </p>
                )}
              </div>

              {/* Right — Progress Ring + Stats */}
              {roadmap && (
                <div className="flex items-center gap-8">
                  {/* Ring */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle
                        cx="64" cy="64" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                        stroke="#3d7a4a"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercent / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-gray-900">{progressPercent}%</span>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Done</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#3d7a4a]" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 leading-none">{completedCount}/{totalCount}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Milestones</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 leading-none">{totalTasks}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Total Tasks</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Completion Banner ── */}
        {justCompleted && (
          <div className="bg-[#3d7a4a] text-white px-4 py-4 text-center animate-in slide-in-from-top-2 duration-500">
            <span className="text-xl font-bold">🎉 Incredible! You've completed your entire roadmap! 🏆</span>
            <p className="text-green-100 text-sm mt-1">Your hard work and dedication have paid off. Go celebrate!</p>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-[#3d7a4a] opacity-20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-[#3d7a4a] flex items-center justify-center shadow-xl">
                  <Brain className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <p className="text-gray-500 text-lg font-medium">Loading your roadmap...</p>
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && !roadmap && (
            <div className="py-10">
              <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg p-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#3d7a4a] shadow-lg mb-6">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                  Ready to map your future?
                </h2>
                <p className="text-gray-600 mb-2 text-lg">
                  Craft a personalized guided roadmap based on your profile.
                </p>
                {userData.stream && (
                  <p className="text-[#3d7a4a] font-medium mb-8">
                    {userData.stream} Stream · {userData.interests?.slice(0, 2).join(" & ")}
                  </p>
                )}
                <Button size="lg" className="bg-[#3d7a4a] hover:bg-[#2d5a38] text-white font-semibold px-8 shadow-lg" asChild>
                  <Link to="/dashboard">Generate My Roadmap <ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
              </div>
            </div>
          )}

          {/* ── Roadmap Timeline + Sidebar ── */}
          {!loading && roadmap && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* Timeline */}
              <div className="min-w-0">
                {/* Instruction text */}
                <p className="text-sm text-gray-400 mb-6">Click on the phase circles to mark them complete</p>

                {roadmap.milestones.map((milestone, index) => (
                  <MilestoneCard
                    key={index}
                    milestone={milestone}
                    index={index}
                    total={roadmap.milestones.length}
                    onToggle={() => handleToggleMilestone(index)}
                    toggling={togglingIndex === index}
                    isLocked={!milestone.completed && index > firstUncompletedIndex}
                  />
                ))}
              </div>

              {/* ── Sidebar ── */}
              <div className="space-y-5">
                {[
                  /* Overall Progress */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-white/40 bg-white/60 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 rounded-full bg-[#3d7a4a]" />
                      Overall Progress
                    </h3>
                    <div className="space-y-0 divide-y divide-gray-100/50">
                      {categoryProgress.map((cat, i) => (
                        <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {cat.name}
                          </span>
                          <span className="text-sm font-bold text-gray-700">{cat.percent} %</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>,

                  /* Summary */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl border border-white/40 bg-white/60 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-100/80 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-teal-600" />
                      </div>
                      Summary
                    </h3>
                    <div className="space-y-0 divide-y divide-gray-100/50">
                      {[
                        { label: "Total Phases", value: totalCount, icon: <FileText className="w-4 h-4 text-gray-400" /> },
                        { label: "Completed", value: completedCount, icon: <CheckCircle2 className="w-4 h-4 text-[#3d7a4a]" /> },
                        { label: "Remaining", value: totalCount - completedCount, icon: null },
                        { label: "Total Tasks", value: totalTasks, icon: <FileText className="w-4 h-4 text-orange-400" /> },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            {stat.icon}
                            {stat.label}
                          </span>
                          <span className="font-bold text-gray-900">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>,

                  /* Quick Actions */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-xl border border-white/40 bg-white/60 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2.5">
                      <Button className="w-full justify-center gap-2 text-sm bg-[#3d7a4a] hover:bg-[#2d5a38] text-white shadow-sm" asChild>
                        <Link to="/dashboard"><Home className="w-4 h-4" /> Go to Dashboard</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        onClick={() => window.print()}
                      >
                        <Printer className="w-4 h-4" /> Print Roadmap
                      </Button>
                    </div>
                  </motion.div>
                ].map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
