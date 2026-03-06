import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain, MessageCircle, Video, Calendar, Star, Clock,
  CheckCircle, Send, Bot, User, Sparkles, ChevronRight,
  Target, GraduationCap, Lightbulb, BookOpen, RotateCcw
} from "lucide-react"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import api from "@/lib/api"

// ─── Counselor data ────────────────────────────────────────────────────────────
const counselors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Engineering & Technology Careers",
    experience: "15+ years",
    rating: 4.9,
    reviews: 234,
    education: "PhD Computer Science, IIT Delhi",
    languages: ["English", "Hindi"],
    availability: "Mon-Fri, 9 AM - 6 PM",
    price: "₹1,500/session",
    image: "/placeholder.svg?height=100&width=100",
    expertise: ["IIT/NIT Admissions", "Computer Science", "Engineering Careers", "Study Abroad"],
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialization: "Medical & Life Sciences",
    experience: "12+ years",
    rating: 4.8,
    reviews: 189,
    education: "MBBS, MD, AIIMS Delhi",
    languages: ["English", "Hindi", "Tamil"],
    availability: "Tue-Sat, 10 AM - 7 PM",
    price: "₹1,800/session",
    image: "/placeholder.svg?height=100&width=100",
    expertise: ["NEET Preparation", "Medical Careers", "AIIMS Admissions", "Healthcare Paths"],
  },
  {
    id: 3,
    name: "Ms. Anita Verma",
    specialization: "International Education",
    experience: "10+ years",
    rating: 4.9,
    reviews: 156,
    education: "MS Stanford, MBA Wharton",
    languages: ["English", "Hindi"],
    availability: "Mon-Fri, 2 PM - 9 PM",
    price: "₹2,000/session",
    image: "/placeholder.svg?height=100&width=100",
    expertise: ["US Universities", "Scholarships", "SAT/ACT Prep", "Study Abroad"],
  },
]

// ─── AI Chat types & helpers ───────────────────────────────────────────────────
interface Message {
  id: string
  role: "user" | "model"
  content: string
  timestamp: Date
}

const PROMPT_SUGGESTIONS = [
  { icon: <Target className="w-4 h-4" />, label: "Which career suits me best based on my profile?" },
  { icon: <GraduationCap className="w-4 h-4" />, label: "What IITs should I target for computer science?" },
  { icon: <BookOpen className="w-4 h-4" />, label: "How should I prepare for JEE in the next 6 months?" },
  { icon: <Lightbulb className="w-4 h-4" />, label: "What are emerging careers in AI and data science?" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Should I choose PCM or PCB after 10th?" },
  { icon: <Brain className="w-4 h-4" />, label: "How do I study abroad after 12th on a scholarship?" },
]

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n")
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="font-bold text-base mt-2">{line.slice(3)}</h3>
        if (line.startsWith("# ")) return <h2 key={i} className="font-bold text-lg mt-2">{line.slice(2)}</h2>
        if (line.startsWith("- ") || line.startsWith("• ")) return (
          <div key={i} className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0 mt-2" />
            <span>{formatInline(line.slice(2))}</span>
          </div>
        )
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\./)?.[1]
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-xs font-bold opacity-70 w-4 flex-shrink-0 mt-0.5">{num}.</span>
              <span>{formatInline(line.replace(/^\d+\.\s/, ""))}</span>
            </div>
          )
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return <p key={i}>{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center flex-shrink-0">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

// ─── AI Chat Section ──────────────────────────────────────────────────────────
function AIChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem("onboardingData") || "{}") } catch { return {} }
  })()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError("")
    setInput("")

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const history = newMessages.slice(0, -1).slice(-6).map(m => ({ role: m.role, content: m.content }))
      const res = await api.post("/counselor/chat", { message: text.trim(), history })
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "model", content: res.data.reply, timestamp: new Date() }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Sidebar */}
      <div className="space-y-4">
        <Card className="border-0 shadow-lg dark:bg-gray-800/50">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center mb-2 shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base dark:text-white">AI Career Counselor</CardTitle>
            <CardDescription className="text-xs dark:text-gray-400">Powered by Gemini AI · Expert in Indian education</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(userData.stream || userData.class) && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1.5">📋 Your Profile</p>
                <div className="space-y-0.5">
                  {userData.class && <p className="text-xs text-blue-800 dark:text-blue-200">Class: {userData.class}</p>}
                  {userData.stream && <p className="text-xs text-blue-800 dark:text-blue-200">Stream: {userData.stream}</p>}
                  {userData.interests?.length > 0 && (
                    <p className="text-xs text-blue-800 dark:text-blue-200">Interests: {userData.interests.slice(0, 2).join(", ")}</p>
                  )}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">I can help with</p>
              <div className="space-y-1.5">
                {[
                  { icon: "🎓", label: "College & Admissions" },
                  { icon: "📚", label: "JEE / NEET / CUET Prep" },
                  { icon: "🌏", label: "Study Abroad" },
                  { icon: "🎯", label: "Career Path Selection" },
                  { icon: "💼", label: "Internships & Skills" },
                  { icon: "🧠", label: "Study Strategy & Tips" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                <RotateCcw className="w-3 h-3" /> New Chat
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat area */}
      <Card className="border-0 shadow-lg dark:bg-gray-800/50 flex flex-col min-h-[560px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 items-center justify-center shadow-lg mb-4">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ask Mentora AI</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                Get instant, personalized career guidance powered by Gemini AI. I know the Indian education system inside out!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {PROMPT_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s.label)}
                    className="flex items-center gap-2.5 p-3 text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:shadow-sm transition-all group"
                  >
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">{s.icon}</span>
                    <span className="text-xs text-gray-700 dark:text-gray-200 font-medium leading-snug">{s.label}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user"
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : "bg-gradient-to-br from-blue-600 to-green-600"
                    }`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[85%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                      }`}>
                      {msg.role === "model"
                        ? <FormattedMessage content={msg.content} />
                        : <p className="text-sm">{msg.content}</p>
                      }
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
                      {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div className="flex justify-center">
                  <div className="px-4 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    ⚠️ {error}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          <div className="flex gap-2 items-end bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px" }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career or education..."
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-3 px-4 focus:outline-none leading-relaxed"
              style={{ minHeight: "44px", maxHeight: "128px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="m-2 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-green-600 hover:opacity-90 disabled:opacity-40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send className="w-4 h-4 text-white" />
              }
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-600 mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CounselorPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null)
  const [sessionType, setSessionType] = useState<"chat" | "video">("video")
  const [question, setQuestion] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Expert Career Counseling</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Get personalized guidance from certified career counselors or ask our AI counselor instantly.
          </p>
        </div>

        <Tabs defaultValue="ai-chat" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 dark:bg-gray-800">
            <TabsTrigger value="ai-chat" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              🤖 AI Counselor
            </TabsTrigger>
            <TabsTrigger value="book-session" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Book a Session
            </TabsTrigger>
            <TabsTrigger value="ask-question" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Ask a Question
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Tab */}
          <TabsContent value="ai-chat">
            <AIChatSection />
          </TabsContent>

          {/* Book Session Tab */}
          <TabsContent value="book-session" className="space-y-8">
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Choose Your Session Type</CardTitle>
                <CardDescription className="dark:text-gray-400">Select how you'd like to connect with your counselor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${sessionType === "video" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                    onClick={() => setSessionType("video")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold dark:text-white">Video Call Session</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Face-to-face consultation with screen sharing</p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">Most Popular</Badge>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${sessionType === "chat" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                    onClick={() => setSessionType("chat")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold dark:text-white">Chat Session</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Text-based consultation with document sharing</p>
                    <Badge variant="outline" className="dark:text-gray-400 dark:border-gray-700">Budget Friendly</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Counselor</h2>
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {counselors.map((counselor) => (
                  <Card
                    key={counselor.id}
                    className={`border-0 shadow-lg cursor-pointer transition-all dark:bg-gray-800/50 ${selectedCounselor === counselor.id ? "ring-2 ring-blue-500 shadow-xl dark:ring-blue-400" : "hover:shadow-xl"}`}
                    onClick={() => setSelectedCounselor(counselor.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <img src={counselor.image} alt={counselor.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700" />
                        <div className="flex-1">
                          <CardTitle className="text-lg dark:text-white">{counselor.name}</CardTitle>
                          <CardDescription className="font-medium text-blue-600 dark:text-blue-400">{counselor.specialization}</CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium dark:text-gray-300">{counselor.rating}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">({counselor.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Experience: {counselor.experience}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Education: {counselor.education}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Languages: {counselor.languages.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Expertise:</p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.expertise.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs dark:text-gray-400 dark:border-gray-700">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">60 min</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{counselor.price}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedCounselor && (
              <Card className="border-0 shadow-lg dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="dark:text-white">Book Your Session</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Complete your booking with {counselors.find((c) => c.id === selectedCounselor)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date</label>
                      <Input type="date" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Time</label>
                      <Input type="time" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What would you like to discuss? (Optional)</label>
                    <Textarea placeholder="e.g., Career guidance for computer science, college selection for engineering..." rows={3} className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      <Calendar className="w-4 h-4 mr-2" /> Book Session
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400">You'll receive a confirmation email with session details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ask Question Tab */}
          <TabsContent value="ask-question" className="space-y-8">
            <Card className="border-0 shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="dark:text-white">Ask Our Experts</CardTitle>
                <CardDescription className="dark:text-gray-400">Submit your career-related questions and get expert answers within 24-48 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Question</label>
                  <Textarea
                    placeholder="Ask anything about STEM careers, college admissions, study abroad, or career planning..."
                    rows={5}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Class</label>
                    <Input placeholder="e.g., Class 11, Class 12" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject Stream</label>
                    <Input placeholder="e.g., PCM, PCB, PCMB" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <Input type="email" placeholder="your.email@example.com" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" disabled={!question.trim()}>
                  <Send className="w-4 h-4 mr-2" /> Submit Question
                </Button>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">Free Service</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">This service is completely free. You'll receive a detailed answer within 24-48 hours.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="dark:text-white">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">How do I choose between engineering and medical?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Consider your interests in problem-solving vs. helping people, your strengths in math/physics vs. biology, and long-term career goals.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">What are the best colleges for computer science?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Top options include IITs, NITs, IIIT Hyderabad, and for abroad: MIT, Stanford, CMU, UC Berkeley.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">How can I study abroad after 12th?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Prepare for standardized tests (SAT/ACT), maintain good grades, apply for scholarships, and start applications early.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
