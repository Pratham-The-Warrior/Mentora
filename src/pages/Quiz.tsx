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
      { subject: 'LOGICAL', A: results.scores.logical, fullMark: 5 },
      { subject: 'ANALYTICAL', A: results.scores.analytical, fullMark: 5 },
      { subject: 'QUANTITATIVE', A: results.scores.quantitative, fullMark: 5 },
      { subject: 'VERBAL', A: results.scores.verbal, fullMark: 5 },
    ]

    const overallScore = (
      (results.scores.logical + results.scores.analytical + results.scores.quantitative + results.scores.verbal) / 4
    ).toFixed(1)

    // Calculate Top Performer and Growth Opportunity
    const scoreEntries = Object.entries(results.scores)
    scoreEntries.sort((a, b) => b[1] - a[1]) // highest first

    // Default values
    let topAttributeName = "Quantitative Reasoning"
    let topAttributeDesc = "You excel at identifying patterns in numerical data and complex logical sequences. This puts you in the top 5% of candidates."
    let growthAttributeName = "Growth Opportunity"
    let growthAttributeDesc = "While strong, your verbal processing speed can be further optimized. Consider practicing structured communication exercises."

    if (scoreEntries.length >= 4) {
      // Top Attribute
      const topKey = scoreEntries[0][0]
      if (topKey === 'logical') {
        topAttributeName = "Logical Reasoning"
        topAttributeDesc = "You excel at deducing underlying principles in complex scenarios. This puts you in a strong position for problem-solving tasks."
      } else if (topKey === 'analytical') {
        topAttributeName = "Analytical Thinking"
        topAttributeDesc = "You are highly skilled at breaking down data and identifying key trends to solve complex issues."
      } else if (topKey === 'quantitative') {
        topAttributeName = "Quantitative Reasoning"
        topAttributeDesc = "You excel at identifying patterns in numerical data and complex logical sequences. This puts you in the top 5% of candidates."
      } else if (topKey === 'verbal') {
        topAttributeName = "Verbal Proficiency"
        topAttributeDesc = "You excel in comprehending and synthesizing complex textual information rapidly."
      }

      // Growth Attribute
      const bottomKey = scoreEntries[3][0]
      if (bottomKey === 'logical') {
        growthAttributeDesc = "While strong, your foundational logical reasoning can be further optimized. Consider practicing more puzzles."
      } else if (bottomKey === 'analytical') {
        growthAttributeDesc = "While strong, your data parsing speed can be further optimized. Consider case-study simulations."
      } else if (bottomKey === 'quantitative') {
        growthAttributeDesc = "While strong, your numerical processing can be further optimized. Consider practicing rapid mental math."
      } else if (bottomKey === 'verbal') {
        growthAttributeDesc = "While strong, your verbal processing speed can be further optimized. Consider practicing structured communication exercises."
      }
    }

    // Determine max score for star
    const maxScore = scoreEntries[0][1];

    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-950 pb-24 font-sans text-gray-900 dark:text-gray-100">
        <AuthNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto flex flex-col items-center">

            <header className="text-center mb-12 flex flex-col items-center w-full max-w-2xl">
              <div className="relative mb-6 flex justify-center items-center">
                <div className="relative w-16 h-16 bg-[#dce5df] dark:bg-emerald-800/40 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 bg-[#2B5341] rounded-full flex items-center justify-center shadow-md shadow-emerald-900/20">
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight text-[#1F2937] dark:text-white">Assessment Complete</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Congratulations! You've successfully mapped your cognitive profile. Your results are processed and ready for analysis.
              </p>
            </header>

            {/* Top Section: Radar Chart + Key Insights */}
            <div className="grid lg:grid-cols-[1fr_1fr] gap-6 w-full mb-6">

              {/* Radar Chart Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aptitude Profile</h3>
                  <div className="flex items-center gap-1.5 bg-[#EAEFE9] dark:bg-gray-800 text-[#2B5341] dark:text-emerald-400 px-3 py-1 rounded-full">
                    <span className="text-sm font-black">{overallScore}</span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Overall Score</span>
                  </div>
                </div>

                <div className="flex-1 min-h-[250px] -mx-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                      <PolarGrid stroke="#F1F5F9" strokeWidth={1.5} />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700, letterSpacing: '1px' }}
                        dy={4}
                      />
                      <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#86EFAC"
                        strokeWidth={2}
                        fill="#bbf7d0"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Insights Section */}
              <div className="flex flex-col gap-4">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Key Insights</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Based on your performance, we've identified your strongest cognitive attributes.
                  </p>
                </div>

                {/* Top Performer Insight */}
                <div className="bg-[#F5F8F6] dark:bg-[#1A2621] rounded-2xl p-5 border border-[#E8EEEA] dark:border-[#1E3326]">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Zap className="w-5 h-5 text-[#2B5341] dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{topAttributeName}</h4>
                        <span className="bg-[#2B5341] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                          TOP PERFORMER
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {topAttributeDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Growth Opportunity Insight */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Brain className="w-5 h-5 text-gray-400 drop-shadow-sm" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">{growthAttributeName}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {growthAttributeDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Score Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">

              {/* Logical */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-28 relative">
                {results.scores.logical === maxScore && (
                  <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#EAEFE9] dark:bg-emerald-900/40 translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <svg className="absolute top-1.5 right-1.5 w-2 h-2 text-[#2B5341] dark:text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </div>
                )}
                <div>
                  <Brain className="w-4 h-4 text-gray-400 mb-2" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LOGICAL</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white flex items-baseline">
                  {results.scores.logical.toFixed(1)}<span className="text-xs text-gray-300 dark:text-gray-600 font-bold ml-1">/5</span>
                </div>
              </div>

              {/* Analytical */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-28 relative">
                {results.scores.analytical === maxScore && (
                  <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#EAEFE9] dark:bg-emerald-900/40 translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <svg className="absolute top-1.5 right-1.5 w-2 h-2 text-[#2B5341] dark:text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </div>
                )}
                <div>
                  <svg className="w-4 h-4 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ANALYTICAL</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white flex items-baseline">
                  {results.scores.analytical.toFixed(1)}<span className="text-xs text-gray-300 dark:text-gray-600 font-bold ml-1">/5</span>
                </div>
              </div>

              {/* Quantitative */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-28 relative">
                {results.scores.quantitative === maxScore && (
                  <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#EAEFE9] bg-opacity-80 translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <svg className="absolute top-1.5 right-1.5 w-2 h-2 text-[#2B5341] dark:text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </div>
                )}
                <div>
                  <svg className="w-4 h-4 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">QUANTITATIVE</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white flex items-baseline">
                  {results.scores.quantitative.toFixed(1)}<span className="text-xs text-gray-300 dark:text-gray-600 font-bold ml-1">/5</span>
                </div>
              </div>

              {/* Verbal */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-28 relative">
                {results.scores.verbal === maxScore && (
                  <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#EAEFE9] dark:bg-emerald-900/40 translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <svg className="absolute top-1.5 right-1.5 w-2 h-2 text-[#2B5341] dark:text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </div>
                )}
                <div>
                  <div className="font-serif italic text-gray-400 mb-1 text-sm leading-none ml-1">A/a</div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VERBAL</p>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white flex items-baseline">
                  {results.scores.verbal.toFixed(1)}<span className="text-xs text-gray-300 dark:text-gray-600 font-bold ml-1">/5</span>
                </div>
              </div>

            </div>

            {/* Detailed Pillar Breakdown */}
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Detailed Pillar Breakdown</h2>

            <div className="grid md:grid-cols-2 gap-4 w-full mb-12">

              {/* Logical Reasoning */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFE9] dark:bg-emerald-900/30 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-[#2B5341] dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Logical Reasoning</h3>
                  </div>
                  <div className="text-sm font-black text-[#2B5341] dark:text-emerald-400 flex items-baseline">
                    {results.scores.logical.toFixed(1)}<span className="text-[10px] text-gray-400 ml-0.5">/5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">
                  Your score indicates a high level of proficiency in deductive and inductive reasoning. You are adept at identifying underlying principles and structures in complex information, allowing you to solve problems methodically and efficiently.
                </p>

                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">RECOMMENDATIONS</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Practice advanced syllogisms and logic puzzles.</span>
                    </li>
                    <li className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Engage in strategic games like chess or complex simulators.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Analytical Thinking */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFE9] dark:bg-emerald-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2B5341] dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Analytical Thinking</h3>
                  </div>
                  <div className="text-sm font-black text-[#2B5341] dark:text-emerald-400 flex items-baseline">
                    {results.scores.analytical.toFixed(1)}<span className="text-[10px] text-gray-400 ml-0.5">/5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">
                  You demonstrate a strong ability to break down data and identify key trends. While consistent, there is room to improve your speed when processing large volumes of unstructured information to reach conclusions faster.
                </p>

                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">RECOMMENDATIONS</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Practice case-study simulations involving data sets.</span>
                    </li>
                    <li className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Explore data visualization courses to enhance pattern recognition.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quantitative Ability */}
              <div className="bg-[#F5F8F6] dark:bg-[#1A2621] rounded-2xl p-6 border border-[#E8EEEA] dark:border-[#1E3326] shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center border border-gray-100 dark:border-emerald-800">
                        <svg className="w-4 h-4 text-[#2B5341] dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quantitative Ability</h3>
                    </div>
                    <span className="bg-[#2B5341] text-white text-[8px] font-black px-2 py-0.5 w-max rounded-sm uppercase tracking-wider ml-11">
                      EXCEPTIONAL
                    </span>
                  </div>
                  <div className="text-sm font-black text-[#2B5341] dark:text-emerald-400 flex items-baseline">
                    {results.scores.quantitative.toFixed(1)}<span className="text-[10px] text-gray-500 ml-0.5">/5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 flex-1 leading-relaxed">
                  Your performance in this area is outstanding. You possess rapid numerical processing skills and an intuitive grasp of mathematical relationships, allowing you to solve complex quantitative problems with high accuracy.
                </p>

                <div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">RECOMMENDATIONS</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Explore advanced statistical modeling or algorithmic thinking.</span>
                    </li>
                    <li className="flex gap-2 items-start text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Apply your skills to predictive analytics or financial modeling.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Verbal Proficiency */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFE9] dark:bg-emerald-900/30 flex items-center justify-center">
                      <div className="font-serif italic text-[#2B5341] dark:text-emerald-400 text-sm leading-none ml-1 font-bold">A/a</div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Verbal Proficiency</h3>
                  </div>
                  <div className="text-sm font-black text-[#2B5341] dark:text-emerald-400 flex items-baseline">
                    {results.scores.verbal.toFixed(1)}<span className="text-[10px] text-gray-400 ml-0.5">/5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">
                  You have a solid foundation in verbal reasoning and comprehension. Focusing on increasing your reading speed and refining your ability to synthesize main ideas from complex texts will help elevate this score further.
                </p>

                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">RECOMMENDATIONS</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Engage with high-complexity literature and editorial content.</span>
                    </li>
                    <li className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2B5341] mt-0.5 shrink-0" />
                      <span>Practice summarizing complex documents into concise bullet points.</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-4">
              <Button
                onClick={() => window.print()}
                className="h-12 px-8 rounded-xl bg-[#2B5341] hover:bg-[#1f3d30] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/10 w-full sm:w-auto"
              >
                Print Report <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                className="h-12 px-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold text-sm w-full sm:w-auto hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Return to Dashboard
              </Button>
            </div>

            <button
              onClick={startTest}
              className="mt-6 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-400 transition-colors"
            >
              Retake Assessment
            </button>

            <div className="mt-16 text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide">
              © 2024 Mentora AI Assessment System. All results are encrypted and confidential.
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
