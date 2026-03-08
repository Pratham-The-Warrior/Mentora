import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"

interface OnboardingData {
  class: string
  stream: string
  targetExam: string[]
  interests: string[]
  challenges: string[]
  goals: string
}

interface RoadmapCreatorModalProps {
  userData: OnboardingData | null
  children?: React.ReactNode
}

export function RoadmapCreatorModal({ userData, children }: RoadmapCreatorModalProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"intro" | "generating" | "generated" | "error">("intro")
  const [errorMessage, setErrorMessage] = useState("")

  const focusAreas = [
    { id: "career", label: "Career Development", description: "Build skills for your target career", icon: "🎯" },
    { id: "exams", label: "Exam Preparation", description: "Master entrance exams (JEE/NEET/SAT)", icon: "📚" },
    { id: "skills", label: "Technical Skills", description: "Learn programming & STEM skills", icon: "💻" },
    { id: "college", label: "College Readiness", description: "Prepare for college applications", icon: "🏛️" },
  ]

  const handleGenerateRoadmap = async (area: string) => {
    if (!userData) return

    setStep("generating")
    setErrorMessage("")

    try {
      await api.post("/roadmap/generate", { focusArea: area })
      setStep("generated")
      setTimeout(() => {
        setOpen(false)
        setStep("intro")
        navigate("/roadmap")
      }, 1500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrorMessage(msg || "Failed to generate roadmap. Please try again.")
      setStep("error")
    }
  }

  if (!userData) return null

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setStep("intro") }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full justify-start bg-transparent dark:border-gray-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Your Roadmap
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
        {step === "intro" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 dark:text-white">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Personalized Roadmap Creator
              </DialogTitle>
              <DialogDescription className="dark:text-gray-300">
                Choose a focus area and we'll craft a guided step-by-step path based on your profile
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 py-6">
              {focusAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleGenerateRoadmap(area.id)}
                  className="p-4 rounded-lg border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-left group dark:bg-gray-700/50"
                >
                  <div className="text-2xl mb-2">{area.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {area.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{area.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Generate</span>
                    <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                </button>
              ))}
            </div>

            {/* Profile Summary */}
            <Card className="p-4 bg-gray-50 dark:bg-gray-700/50 border-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📋 Your Profile</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    {userData.stream} Stream
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                    Class {userData.class}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {interest}
                    </Badge>
                  ))}
                  {userData.interests.length > 3 && (
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      +{userData.interests.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}

        {step === "generating" && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Creating Your Roadmap</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Mentora is analyzing your profile and crafting your personalized learning path...
            </p>
            <div className="mt-4 space-y-2 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Analyzing your interests & goals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Creating milestone phases</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Finalizing your roadmap...</span>
              </div>
            </div>
          </div>
        )}

        {step === "generated" && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Roadmap is Ready! 🎉</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We've created a personalized learning roadmap tailored to your goals. Redirecting you now...
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generation Failed</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{errorMessage}</p>
            <Button onClick={() => setStep("intro")} variant="outline" className="dark:border-gray-600">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
