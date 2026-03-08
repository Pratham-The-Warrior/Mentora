import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, Zap, Target, Send, Check, ArrowLeft, Timer } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AuthNavbar } from "../components/layout/auth-navbar"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import api from "@/lib/api"

interface Question {
  _id: string
  text: string
  options: string[]
  category: string
  difficulty: number
  explanation?: string
}

interface CareerRecommendation {
  careerTitle: string
  matchScore: number
  aiReasoning: string
}

export default function QuizPage() {
  const [step, setStep] = useState<'start' | 'test' | 'results'>('start')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set())
  const [results, setResults] = useState<{
    scores: Record<string, number>
    recommendations: CareerRecommendation[]
  } | null>(null)
  const [progress, setProgress] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [explanation, setExplanation] = useState<string | "">("")
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const totalSlots = 15

  useEffect(() => {
    if (step !== 'test') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          fetchResults(true); // Force auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    checkExistingResult()
  }, [])

  const checkExistingResult = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("/aptitude/latest")
      if (data.success && data.recommendations) {
        setHasResult(true)
        setResults({
          scores: data.scores,
          recommendations: data.recommendations
        })
        setStep('results')
      } else {
        await startTest()
      }
    } catch (err) {
      await startTest()
    } finally {
      setLoading(false)
    }
  }

  const startTest = async () => {
    setLoading(true)
    setStep('start')
    setAnswers({})
    setMarkedForReview(new Set())
    setCurrentIndex(0)
    setTimeLeft(15 * 60)

    try {
      const { data } = await api.post("/aptitude/start")
      if (data.questions) {
        setQuestions(data.questions)
        setCurrentIndex(0)
        setStep('test')
        setProgress(0)
      }
    } catch (err) {
      console.error("Failed to start test:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelection = (answerIndex: number) => {
    const qId = questions[currentIndex]._id
    // Just update local state for the radio/button highlight
    setAnswers(prev => ({ ...prev, [qId]: answerIndex }))
    setIsCorrect(null) // Reset feedback on new selection
  }

  const handleSaveAndNext = async () => {
    const qId = questions[currentIndex]._id
    const answerIndex = answers[qId]

    if (answerIndex === undefined) {
      // If not answered, just move to next if possible
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setIsCorrect(null)
        setExplanation("")
      }
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post("/aptitude/submit-answer", {
        questionId: qId,
        answerIndex
      })

      setIsCorrect(data.isCorrect)
      setExplanation(data.explanation || "")

      // If correct, show green highlight for a moment before moving
      if (data.isCorrect) {
        setTimeout(() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setIsCorrect(null)
            setExplanation("")
          } else {
            // Last question answered
            setIsCorrect(null)
            setExplanation("")
          }
        }, 800)
      } else {
        // If incorrect, maybe move anyway or let user see? 
        // User said: "if question is correct just make the option green and save and move"
        // I'll just move after a delay regardless if they clicked Save & Next
        setTimeout(() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setIsCorrect(null)
            setExplanation("")
          }
        }, 800)
      }

      setProgress((Object.keys({ ...answers, [qId]: answerIndex }).length / questions.length) * 100)
    } catch (err) {
      console.error("Failed to submit answer:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleMarkForReview = () => {
    const qId = questions[currentIndex]._id
    setMarkedForReview(prev => {
      const newSet = new Set(prev)
      if (newSet.has(qId)) newSet.delete(qId)
      else newSet.add(qId)
      return newSet
    })
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsCorrect(null)
      setExplanation("")
    }
  }

  async function fetchResults(force = false) {
    if (!force && Object.keys(answers).length < 5) {
      alert("Please answer more questions to get a meaningful career profile.");
      return;
    }

    setLoading(true)
    setStep('start')
    try {
      const { data } = await api.post("/aptitude/results")
      setResults({
        scores: data.scores,
        recommendations: data.recommendations
      })
      setStep('results')
    } catch (err: any) {
      console.error("Failed to fetch results:", err)
      alert(err.response?.data?.message || "Failed to fetch results")
      setStep('test')
    } finally {
      setLoading(false)
    }
  }


  if (step === 'test' && questions[currentIndex]) {
    const currentQ = questions[currentIndex]

    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-300 flex flex-col font-sans">
        <AuthNavbar />

        <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          {/* Main Question Area - 70% */}
          <div className="flex-1 flex flex-col gap-4">
            <Card className="border-0 shadow-sm rounded-xl overflow-hidden bg-white dark:bg-gray-900 font-sans">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
                <div>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1 font-heading">
                    {currentQ.category.replace("-", " ")} APTITUDE
                  </p>
                  <h2 className="text-2xl font-black dark:text-white font-heading tracking-tight">Question {String(currentIndex + 1).padStart(2, '0')}</h2>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-0 text-[10px] font-bold px-3 py-1">
                    Adaptive Scoring
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Feedback removed for standard test behavior */}

                <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 leading-relaxed font-heading tracking-tight">
                  {currentQ.text}
                </div>

                <div className="grid gap-4">
                  {currentQ.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index)
                    const isSelected = answers[currentQ._id] === index

                    return (
                      <button
                        key={index}
                        disabled={loading}
                        onClick={() => handleSelection(index)}
                        className={`group flex items-center w-full p-3 rounded-xl border-2 transition-all text-left ${isSelected
                          ? isCorrect === true
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-blue-500 bg-blue-50/30'
                          : 'border-gray-100 dark:border-gray-800 hover:border-blue-200'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-xs font-bold transition-all ${isSelected
                          ? isCorrect === true
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 group-hover:border-blue-300'
                          }`}>
                          {letter}
                        </div>
                        <span className={`text-base tracking-tight ${isSelected ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                          {option}
                        </span>
                        {isSelected && (
                          <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center ${isCorrect === true ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                            {isCorrect === true ? <Check className="w-3 h-3 text-white" /> : <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Navigation Actions */}
            <div className="flex justify-between items-center mt-auto py-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || loading}
                className="rounded-lg h-10 px-6 border-gray-200 text-gray-600 hover:bg-gray-50 bg-white font-bold text-xs"
              >
                <ArrowLeft className="w-3 h-3 mr-2" /> Previous
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={toggleMarkForReview}
                  className={`rounded-lg h-10 px-6 border-blue-100 text-blue-600 hover:bg-blue-50 bg-white font-bold text-xs ${markedForReview.has(currentQ._id) ? 'bg-blue-50' : ''}`}
                >
                  Mark for Review
                </Button>
                <Button
                  onClick={handleSaveAndNext}
                  disabled={loading}
                  className="rounded-lg h-10 px-6 bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-lg shadow-gray-950/20 font-bold text-xs"
                >
                  Save & Next
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - 30% */}
          <div className="w-full lg:w-72 flex flex-col gap-4">
            <Card className="border-0 shadow-sm rounded-xl bg-white dark:bg-gray-900 font-sans">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] font-heading">Question Palette</CardTitle>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${timeLeft < 120 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                  <Timer className="w-3.5 h-3.5" />
                  {formatTime(timeLeft)}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-3 mb-8">
                  {questions.map((question, i) => {
                    const isCurrent = i === currentIndex
                    const isAnswered = answers[question._id] !== undefined
                    const isMarked = markedForReview.has(question._id)

                    let bgClass = "bg-gray-50 border-gray-100 text-gray-400"
                    if (isCurrent) bgClass = "border-blue-500 text-blue-600 bg-white ring-2 ring-blue-500/20 ring-offset-2"
                    else if (isMarked) bgClass = "bg-purple-500 border-purple-500 text-white"
                    else if (isAnswered) bgClass = "bg-emerald-500 border-emerald-500 text-white"
                    else bgClass = "bg-white border-gray-200 text-gray-600"

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all ${bgClass} hover:scale-105`}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-[10px] font-bold uppercase tracking-tight text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-200" /> Not Visited
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm" /> Marked
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-blue-500 border-2 rounded-sm" /> Current
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-xl overflow-hidden bg-blue-50/50 font-sans">
              <CardContent className="p-4">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.1em] mb-1 font-heading">Summary</p>
                <div className="text-base font-bold text-gray-900 mb-4 font-heading">
                  {Object.keys(answers).length} of {questions.length} questions answered
                </div>
                <Button
                  onClick={() => fetchResults()}
                  className="w-full h-10 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl flex items-center justify-center gap-2 font-black text-xs shadow-xl shadow-gray-950/20 tracking-wide font-heading"
                >
                  <Send className="w-3 h-3" /> Submit Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'results' && results) {
    const chartData = [
      { subject: 'Logical', A: results.scores.logical, fullMark: 5 },
      { subject: 'Analytical', A: results.scores.analytical, fullMark: 5 },
      { subject: 'Quantitative', A: results.scores.quantitative, fullMark: 5 },
      { subject: 'Verbal', A: results.scores.verbal, fullMark: 5 },
    ]

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        <AuthNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl font-black dark:text-white mb-2 font-heading tracking-tight text-[#1F3E35]">Assessment Complete</h1>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-sans">Here is your realistic aptitude profile.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="border-0 shadow-xl bg-white dark:bg-gray-900/50 font-sans overflow-hidden">
                <div className="h-1.5 bg-emerald-600" />
                <CardHeader className="py-4">
                  <CardTitle className="text-xl font-bold dark:text-emerald-50 text-[#1F3E35] font-heading">Aptitude Profile</CardTitle>
                  <CardDescription className="text-xs font-medium">Strength distribution across 4 core pillars</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#059669"
                        fill="#10B981"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#1F3E35] dark:text-emerald-50">Key Insights</h3>
                  <p className="text-[#4A675F] dark:text-gray-400 leading-relaxed font-medium">
                    Based on our adaptive algorithm, you performed exceptionally well in
                    <span className="text-emerald-600 font-black mx-1">
                      {Object.entries(results.scores).sort((a, b) => b[1] - a[1])[0][0]} reasoning
                    </span>.
                    Your profile suggests a strong foundation for professional success.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(results.scores).map(([key, val]) => (
                    <div key={key} className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-emerald-50 dark:border-emerald-900/20">
                      <p className="text-[10px] text-emerald-600 uppercase tracking-widest mb-1 font-black">{key}</p>
                      <div className="text-3xl font-black text-[#1F3E35] dark:text-white">{val}<span className="text-sm text-gray-400 font-bold ml-1">/5</span></div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={startTest}
                  variant="outline"
                  className="h-14 rounded-2xl border-2 border-emerald-100 text-emerald-700 font-black hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" /> Retake Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 bg-gray-50 font-sans">
      <div className="flex flex-col items-center max-w-sm text-center px-6">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-emerald-100 dark:border-emerald-900/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <Target className="absolute inset-0 m-auto w-6 h-6 text-emerald-600 animate-pulse" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 font-heading tracking-tight">Mentora Intelligence</h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
          {step === 'test'
            ? "Analyzing your performance..."
            : "Preparing your personalized experience..."}
        </p>
      </div>
    </div>
  )
}
