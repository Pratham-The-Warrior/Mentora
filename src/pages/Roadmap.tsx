import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowRight, Calendar, CheckCircle2, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link } from "react-router-dom"

interface OnboardingData {
  class: string
  stream: string
  targetExam: string[]
  interests: string[]
  challenges: string[]
  goals: string
}

interface Milestone {
  title: string
  duration: string
  description: string
  tasks: string[]
}

export default function RoadmapPage() {
  const [userData, setUserData] = useState<OnboardingData | null>(null)
  const [roadmap, setRoadmap] = useState<Milestone[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("onboardingData")
    if (data) {
      setUserData(JSON.parse(data))
    }
  }, [])

  const generateRoadmap = async () => {
    if (!userData) return

    setLoading(true)
    setError("")

    setLoading(true)
    setError("")

    // Mock roadmap generation for frontend-only version
    setTimeout(() => {
      const mockMilestones = [
        {
          title: "Foundation & Assessment",
          duration: "Weeks 1-2",
          description: "Assess your current skills and build a strong foundation in your chosen stream.",
          tasks: ["Complete detailed interest inventory", "Review core concepts", "Identify top 3 potential careers"],
        },
        {
          title: "Skill Development",
          duration: "Weeks 3-8",
          description: "Focus on developing essential skills and gathering necessary resources.",
          tasks: ["Enroll in relevant online courses", "Practice problem-solving", "Join student communities"],
        },
        {
          title: "College & Exam Prep",
          duration: "Months 3-6",
          description: "Prepare for entrance exams and research target colleges.",
          tasks: ["Start exam-specific mock tests", "Research admission criteria", "Visit college websites"],
        },
      ]
      setRoadmap(mockMilestones)
      setLoading(false)
    }, 1500)
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please complete onboarding first</h2>
          <Button asChild className="mt-4">
            <Link to="/onboarding">Go to Onboarding</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Mentora
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">STEM Career Guide</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/dashboard"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200 font-medium"
              >
                Dashboard
              </Link>
              <Link to="/explore"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all duration-200 font-medium"
              >
                Explore
              </Link>
              <Link to="/colleges"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-all duration-200 font-medium"
              >
                Colleges
              </Link>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              <ThemeToggle />
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Personalized Learning Roadmap</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get a customized step-by-step guide based on your profile, interests, and career goals.
          </p>
        </div>

        {/* Generate Button */}
        {!roadmap && (
          <Card className="mb-8 border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="pt-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Ready to create your roadmap?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Based on your profile: <strong>{userData.stream}</strong> Stream, interested in{" "}
                  <strong>{userData.interests.slice(0, 2).join(", ")}</strong>
                </p>
                <Button size="lg" onClick={generateRoadmap} disabled={loading} className="gap-2">
                  {loading ? "Generating..." : "Generate My Roadmap"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200">{error}</h3>
                  <Button
                    size="sm"
                    onClick={generateRoadmap}
                    variant="outline"
                    className="mt-3 dark:border-red-700 bg-transparent"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roadmap Display */}
        {roadmap && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Roadmap</h2>
              <Button variant="outline" onClick={() => setRoadmap(null)} className="dark:border-gray-600">
                Generate New
              </Button>
            </div>

            {roadmap.map((milestone, index) => (
              <Card key={index} className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700 overflow-hidden">
                <div className="flex items-start gap-4 p-6">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {index < roadmap.length - 1 && <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600 mt-2" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{milestone.duration}</span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                        Phase {index + 1}
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">{milestone.description}</p>

                    {/* Tasks */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Key Tasks:</h4>
                      <ul className="space-y-2">
                        {milestone.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Next Steps */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link to="/counselor">Talk to a Counselor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
