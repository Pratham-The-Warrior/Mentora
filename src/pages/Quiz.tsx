import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, ArrowRight, CheckCircle, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"

interface Question {
  id: number
  question: string
  options: string[]
  category: "analytical" | "creative" | "technical" | "social" | "practical"
}

const questions: Question[] = [
  {
    id: 1,
    question: "When faced with a complex problem, what's your first instinct?",
    options: [
      "Break it down into smaller, logical steps",
      "Look for creative, unconventional solutions",
      "Research similar problems and their solutions",
      "Discuss it with others to get different perspectives",
    ],
    category: "analytical",
  },
  {
    id: 2,
    question: "Which activity sounds most appealing to you?",
    options: [
      "Building and programming a robot",
      "Conducting a scientific experiment",
      "Designing a mobile app interface",
      "Leading a team project",
    ],
    category: "technical",
  },
  {
    id: 3,
    question: "What motivates you most in your studies?",
    options: [
      "Understanding how things work at a fundamental level",
      "Creating something new and innovative",
      "Solving real-world problems that help people",
      "Achieving high grades and recognition",
    ],
    category: "creative",
  },
  {
    id: 4,
    question: "In a group project, you naturally tend to:",
    options: [
      "Take charge and organize the team",
      "Focus on research and analysis",
      "Come up with creative ideas and solutions",
      "Ensure everyone's voice is heard",
    ],
    category: "social",
  },
  {
    id: 5,
    question: "Which subject combination interests you most?",
    options: [
      "Mathematics and Physics",
      "Biology and Chemistry",
      "Computer Science and Mathematics",
      "Physics and Chemistry",
    ],
    category: "technical",
  },
  {
    id: 6,
    question: "What type of work environment appeals to you?",
    options: [
      "A quiet lab or research facility",
      "A collaborative office with teams",
      "A dynamic startup environment",
      "A structured corporate setting",
    ],
    category: "practical",
  },
  {
    id: 7,
    question: "When learning something new, you prefer to:",
    options: [
      "Read detailed explanations and theory",
      "Watch demonstrations and examples",
      "Try hands-on experiments",
      "Discuss concepts with others",
    ],
    category: "practical",
  },
  {
    id: 8,
    question: "Which career aspect is most important to you?",
    options: [
      "High earning potential",
      "Making a positive impact on society",
      "Intellectual challenge and growth",
      "Job security and stability",
    ],
    category: "social",
  },
]

const careerRecommendations = {
  analytical: {
    primary: "Data Science & Analytics",
    secondary: ["Research Scientist", "Financial Analyst", "Operations Research"],
    description:
      "Your analytical mindset makes you perfect for careers involving data interpretation, research, and systematic problem-solving.",
  },
  creative: {
    primary: "Product Design & Innovation",
    secondary: ["UX/UI Designer", "Biotech Researcher", "Architect"],
    description:
      "Your creative thinking and innovation skills align well with design-focused and research-oriented careers.",
  },
  technical: {
    primary: "Software Engineering",
    secondary: ["Robotics Engineer", "AI/ML Engineer", "Systems Architect"],
    description: "Your technical aptitude and logical thinking make you ideal for engineering and technology roles.",
  },
  social: {
    primary: "Healthcare & Medicine",
    secondary: ["Public Health", "Science Communication", "Project Management"],
    description:
      "Your people-oriented approach suits careers where you can help others and work in collaborative environments.",
  },
  practical: {
    primary: "Engineering & Applied Sciences",
    secondary: ["Mechanical Engineer", "Civil Engineer", "Applied Physics"],
    description:
      "Your hands-on approach and practical mindset align with applied engineering and implementation-focused roles.",
  },
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  interface Results {
    topCategory: keyof typeof careerRecommendations
    scores: Record<string, number>
    recommendation: typeof careerRecommendations[keyof typeof careerRecommendations]
  }

  const [results, setResults] = useState<Results | null>(null)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const categoryScores: Record<keyof typeof careerRecommendations, number> = {
      analytical: 0,
      creative: 0,
      technical: 0,
      social: 0,
      practical: 0,
    }

    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        categoryScores[question.category]++
      }
    })

    const topCategory = Object.entries(categoryScores).reduce((a, b) =>
      categoryScores[a[0] as keyof typeof categoryScores] > categoryScores[b[0] as keyof typeof categoryScores] ? a : b,
    )[0] as keyof typeof careerRecommendations

    setResults({
      topCategory,
      scores: categoryScores,
      recommendation: careerRecommendations[topCategory],
    })
    setShowResults(true)
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="border-b bg-white/95 dark:bg-gray-900/95 dark:border-gray-800 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Mentora
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">STEM Career Guide</div>
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Career Assessment Results</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your responses, here are your personalized STEM career recommendations
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Recommendation */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg mb-6 dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl dark:text-white">Best Match</CardTitle>
                        <CardDescription className="dark:text-gray-400">Your top career recommendation</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {results.recommendation.primary}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{results.recommendation.description}</p>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                        95% Match
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Related Career Paths:</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {results.recommendation.secondary.map((career: string, index: number) => (
                          <div
                            key={career}
                            className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:bg-gray-800/50 transition-all"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">{career}</h4>
                            <Badge variant="outline" className="mt-2 dark:text-gray-400 dark:border-gray-700">
                              {90 - index * 5}% Match
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Recommended Next Steps</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Actions to help you pursue this career path
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Explore Detailed Career Information
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Learn about job responsibilities, required skills, and career progression
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Find Relevant Colleges & Programs
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Discover universities offering programs aligned with your career goals
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Schedule a Counselor Session</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Get personalized guidance from our career experts
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Personality Profile */}
                <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">Your Profile</CardTitle>
                    <CardDescription className="dark:text-gray-400">Strengths based on your responses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(results.scores).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize dark:text-gray-300">{category}</span>
                          <span className="dark:text-gray-300">{Math.round((score / questions.length) * 100)}%</span>
                        </div>
                        <Progress value={(score / questions.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">Take Action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link to="/explore">Explore Careers</Link>
                    </Button>
                    <Button
                      className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                      variant="outline"
                      asChild
                    >
                      <Link to="/colleges">Find Colleges</Link>
                    </Button>
                    <Button
                      className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                      variant="outline"
                      asChild
                    >
                      <Link to="/counselor">Talk to Counselor</Link>
                    </Button>
                    <Button
                      className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                      variant="outline"
                      asChild
                    >
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Share Results */}
                <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">Share Your Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Share your career assessment results with parents or counselors
                    </p>
                    <Button
                      variant="outline"
                      className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 dark:border-gray-800 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Mentora
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">STEM Career Guide</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="h-3 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {Math.round(progress)}% Complete - This assessment takes about 5 minutes
            </p>
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">{questions[currentQuestion].question}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose the option that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[questions[currentQuestion].id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(questions[currentQuestion].id, Number.parseInt(value))}
                className="space-y-4"
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="mt-1 dark:border-gray-600 dark:text-blue-500"
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer dark:text-gray-200">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[questions[currentQuestion].id] === undefined}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {currentQuestion === questions.length - 1 ? "Get Results" : "Next"}
                  {currentQuestion !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Info */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>This assessment evaluates your interests, skills, and preferences to recommend suitable STEM careers.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
