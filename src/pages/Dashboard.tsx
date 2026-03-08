import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RoadmapCreatorModal } from "@/components/shared/roadmap-creator-modal"
import { Brain, BookOpen, Globe, Target, TrendingUp, Calendar, Award, MessageCircle, ExternalLink, Star, Clock, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Link } from "react-router-dom"
import { AuthNavbar } from "../components/layout/auth-navbar"
import api from "@/lib/api"

interface OnboardingData {
  class: string
  stream: string
  targetExam: string[]
  interests: string[]
  challenges: string[]
  goals: string
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<OnboardingData | null>(null)
  const [aptitudeResult, setAptitudeResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Try localStorage first for instant UI
      const localData = localStorage.getItem("onboardingData")
      if (localData) {
        setUserData(JSON.parse(localData))
        setLoading(false)
      }

      // 2. Fetch from backend
      try {
        const [profileRes, aptitudeRes] = await Promise.all([
          api.get('/profile'),
          api.get('/aptitude/latest').catch(() => ({ data: { success: false } })) // Fetch saved results
        ])

        if (profileRes.data.success && profileRes.data.profile) {
          const profile = profileRes.data.profile
          setUserData(profile)
          localStorage.setItem("onboardingData", JSON.stringify(profile))
        }

        if (aptitudeRes.data.success) {
          setAptitudeResult(aptitudeRes.data)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Loading your personalized dashboard...
          </h2>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Loading your personalized dashboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Please complete the onboarding process first.</p>
          <Button asChild className="mt-4">
            <Link to="/onboarding">Complete Setup</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getRecommendedCareers = () => {
    if (aptitudeResult?.recommendations && aptitudeResult.recommendations.length > 0) {
      return aptitudeResult.recommendations.map((r: any) => ({
        title: r.careerTitle,
        description: r.aiReasoning,
        matchScore: r.matchScore,
        isAptitudeBased: true
      }))
    }

    // Default stream-based fallback
    let careers = ["Engineering", "Research", "Technology", "Innovation"]
    if (userData.stream === "PCM" || userData.interests.includes("Computer Science & AI")) {
      careers = ["Computer Science Engineering", "Data Science", "Aerospace Engineering", "Robotics Engineering"]
    } else if (userData.stream === "PCB" || userData.interests.includes("Medical & Healthcare")) {
      careers = ["Medicine (MBBS)", "Biotechnology", "Biomedical Engineering", "Research in Life Sciences"]
    }

    return careers.map((c, i) => ({
      title: c,
      description: "High growth potential with excellent career prospects in the coming decade.",
      matchScore: 95 - i * 5,
      isAptitudeBased: false
    }))
  }

  const getRecommendedColleges = () => {
    if (userData.targetExam.includes("JEE Main & Advanced")) {
      return ["IIT Delhi", "IIT Bombay", "IIT Madras", "NIT Trichy"]
    }
    if (userData.targetExam.includes("NEET")) {
      return ["AIIMS Delhi", "JIPMER", "CMC Vellore", "KGMU Lucknow"]
    }
    if (userData.targetExam.includes("SAT/ACT (US)")) {
      return ["MIT", "Stanford University", "UC Berkeley", "Carnegie Mellon"]
    }
    return ["Top Universities", "Premier Institutes", "Research Universities"]
  }

  const getMatchedCounselors = () => {
    const counselors = [
      {
        id: "c1",
        name: "Dr. Priya Sharma",
        specialization: "Engineering & Tech Careers",
        rating: 4.9,
        image: "https://i.pravatar.cc/150?u=priya",
        matchReason: "Matches your PCM stream",
      },
      {
        id: "c2",
        name: "Dr. Rajesh Kumar",
        specialization: "Medical & Life Sciences",
        rating: 4.8,
        image: "https://i.pravatar.cc/150?u=rajesh",
        matchReason: "Matches your PCB stream",
      },
      {
        id: "c3",
        name: "Ms. Anita Verma",
        specialization: "International Education",
        rating: 4.9,
        image: "https://i.pravatar.cc/150?u=anita",
        matchReason: "Matches your Study Abroad goals",
      },
      {
        id: "c4",
        name: "Prof. Alok Gupta",
        specialization: "Pure Sciences & Research",
        rating: 4.7,
        image: "https://i.pravatar.cc/150?u=alok",
        matchReason: "Matches your core science interests",
      }
    ]

    if (userData.stream === "PCM" || userData.interests.includes("Computer Science & AI")) {
      return [counselors[0], counselors[2]]
    }
    if (userData.stream === "PCB" || userData.interests.includes("Medical & Healthcare")) {
      return [counselors[1], counselors[2]]
    }
    return [counselors[0], counselors[3]]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to your STEM journey! 🚀</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Based on your profile, we've curated personalized recommendations to help you succeed.
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="mb-8 border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Your Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Class</p>
                <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                  {userData.class}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Stream</p>
                <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                  {userData.stream}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Target Exams</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userData.targetExam.slice(0, 2).map((exam) => (
                    <Badge key={exam} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                      {exam}
                    </Badge>
                  ))}
                  {userData.targetExam.length > 2 && (
                    <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                      +{userData.targetExam.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Primary Goal</p>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50">
                  {userData.goals.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Career Paths */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Recommended Career Paths
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Based on your interests and academic stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {getRecommendedCareers().map((career: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow dark:hover:bg-gray-700/50 relative overflow-hidden group"
                    >
                      {career.isAptitudeBased && (
                        <div className="absolute top-0 right-0 py-1 px-3 bg-blue-600 text-white text-[10px] font-bold rounded-bl-lg">
                          VERIFIED FIT
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{career.title}</h3>
                        <Badge className={`${career.isAptitudeBased ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'} border-0`}>
                          {career.matchScore}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {career.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                      >
                        <Link
                          to="/counselor"
                          state={{ automatedQuery: `I want to learn more about becoming a ${career.title}. What is the roadmap, required skills, and growth potential?` }}
                        >
                          Learn More <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Matched Expert Counselors */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Matched Expert Counselors
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Experts carefully selected based on your stream and career goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMatchedCounselors().map((counselor) => (
                    <div
                      key={counselor.id}
                      className="flex items-center justify-between p-4 border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={counselor.image}
                          alt={counselor.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{counselor.name}</h3>
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                            {counselor.specialization}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium ml-1 dark:text-gray-300">{counselor.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 border-l dark:border-gray-600 pl-2">
                              {counselor.matchReason}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        asChild
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shrink-0 ml-4"
                      >
                        <Link to="/counselor">Book Session</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


            {/* Action Items */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Next Steps for You
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Recommended actions based on your current profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Take Career Aptitude Assessment</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get detailed insights into your strengths and ideal career matches
                      </p>
                    </div>
                    <Button size="sm" asChild>
                      <Link to="/quiz">Start Quiz</Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Schedule Counselor Session</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get personalized guidance from our expert career counselors
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                    >
                      <Link to="/counselor">Book Now</Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Explore Scholarship Opportunities</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Find financial aid options for your preferred colleges
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                    >
                      <Link to="/opportunities">Explore</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RoadmapCreatorModal userData={userData} />
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link to="/roadmap">
                    <MapPin className="w-4 h-4 mr-2" />
                    View My Roadmap
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link to="/quiz">
                    <Brain className="w-4 h-4 mr-2" />
                    Take Aptitude Test
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link to="/counselor">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Talk to Counselor
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link to="/explore">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Careers
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link to="/opportunities">
                    <Award className="w-4 h-4 mr-2" />
                    Find Opportunities
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Your Progress</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Complete your profile for better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="dark:text-gray-300">Profile Completion</span>
                    <span className="dark:text-gray-300">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="dark:text-gray-300">Basic info completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="dark:text-gray-300">Interests identified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="dark:text-gray-300">Aptitude test pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span className="dark:text-gray-300">Counselor session pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium dark:text-white">New scholarship opportunities available</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium dark:text-white">JEE 2024 application dates announced</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium dark:text-white">New webinar: "Studying CS abroad"</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
