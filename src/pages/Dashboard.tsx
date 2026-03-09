import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RoadmapCreatorModal } from "@/components/shared/roadmap-creator-modal"
import { Brain, BookOpen, Globe, Target, TrendingUp, Calendar, Award, MessageCircle, ExternalLink, Star, Clock, MapPin, Check, Route, Sparkles, ArrowRight, GraduationCap, Cpu, School } from "lucide-react"
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
  const [roadmaps, setRoadmaps] = useState<any[]>([])
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
        const [profileRes, aptitudeRes, roadmapsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/aptitude/latest').catch(() => ({ data: { success: false } })), // Fetch saved results
          api.get('/roadmap/all').catch(() => ({ data: { success: false, roadmaps: [] } })) // Fetch all roadmaps
        ])

        if (profileRes.data.success && profileRes.data.profile) {
          const profile = profileRes.data.profile
          setUserData(profile)
          localStorage.setItem("onboardingData", JSON.stringify(profile))
        }

        if (aptitudeRes.data.success) {
          setAptitudeResult(aptitudeRes.data)
        }

        if (roadmapsRes.data?.success && roadmapsRes.data?.roadmaps) {
          setRoadmaps(roadmapsRes.data.roadmaps)
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

            {/* Your Active Roadmaps */}
            {roadmaps.length > 0 && (
              <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700 bg-gradient-to-br from-white to-[#f8faf9] dark:from-gray-800 dark:to-gray-800/80">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 dark:text-white text-xl">
                        <Route className="w-6 h-6 text-[#3d7a4a] dark:text-green-400" />
                        Your Active Roadmaps
                      </CardTitle>
                      <CardDescription className="dark:text-gray-300 mt-1">
                        Continue your personalized learning journeys
                      </CardDescription>
                    </div>
                    <RoadmapCreatorModal userData={userData}>
                      <Button variant="outline" size="sm" className="hidden sm:flex border-[#3d7a4a] text-[#3d7a4a] hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30">
                        Create New +
                      </Button>
                    </RoadmapCreatorModal>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Reverse array or slice first 4 to show most recent */}
                    {roadmaps.slice(0, 3).map((roadmap, index) => {
                      // Calculate progress
                      const totalMilestones = roadmap.milestones?.length || 0;
                      const completedMilestones = roadmap.milestones?.filter((m: any) => m.completed).length || 0;
                      const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                      // Map focusArea to styling with aesthetic background gradients/images
                      const focusConfig: Record<string, { label: string, icon: any, description: string, tag: string, image: string, iconBg: string, iconColor: string }> = {
                        career: { label: "Career Development", icon: Target, description: "Build essential skills to land your dream job and accelerate your career growth.", tag: "STRATEGIC", image: "/roadmaps/career.png", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
                        exams: { label: "Exam Preparation", icon: GraduationCap, description: "Comprehensive focus on your target exams with adaptive practice modules.", tag: "INTENSIVE", image: "/roadmaps/exams.png", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
                        skills: { label: "Technical Skills", icon: Cpu, description: "Master in-demand programming, design, and technical competencies.", tag: "PRACTICAL", image: "/roadmaps/tech.png", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
                        college: { label: "College Readiness", icon: School, description: "Preparing for admissions, essay writing, and international scholarship applications.", tag: "ESSENTIAL", image: "/roadmaps/college.png", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" }
                      };

                      const config = focusConfig[roadmap.focusArea] || focusConfig.career;
                      const isCompleted = progressPercentage === 100;

                      return (
                        <div key={roadmap._id || index} className="group relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-800 flex flex-col h-full">
                          {/* Image Header Area */}
                          <div className="h-36 w-full relative overflow-hidden flex flex-col justify-end p-4">
                            {/* AI Generated Background Image */}
                            <img
                              src={config.image}
                              alt={config.label}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Dark overlay for depth and text legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="relative z-10 flex items-center justify-between">
                              <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider rounded-md border border-white/20 shadow-sm ${isCompleted ? 'bg-green-600' : 'bg-[#00b050]'}`}>
                                {isCompleted ? 'COMPLETED' : config.tag}
                              </span>
                            </div>
                          </div>

                          {/* Content Area */}
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center shadow-sm -mt-10 relative z-20 border-[3px] border-white dark:border-gray-800`}>
                                <config.icon className={`w-6 h-6 ${config.iconColor}`} />
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider">Last active</span>
                                <span className="text-xs font-semibold text-slate-600 dark:text-gray-300">
                                  {new Date(roadmap.updatedAt || roadmap.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                              {config.label}
                            </h4>
                            <p className="text-[14px] text-slate-500 dark:text-gray-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
                              {config.description}
                            </p>

                            <div className="mb-4">
                              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide mb-2">
                                <span className="text-slate-400 dark:text-gray-500">Current Progress</span>
                                <span className="text-[#00b050] dark:text-green-400 font-bold">
                                  {progressPercentage}%
                                </span>
                              </div>
                              <Progress value={progressPercentage} className={`h-2 ${isCompleted ? 'bg-green-100 dark:bg-green-950 text-green-500' : 'text-[#00b050] bg-gray-100'}`} />
                              <div className="flex items-center gap-1.5 mt-3">
                                <Check className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-medium text-[11px] text-slate-400 dark:text-gray-400 tracking-wide">
                                  {completedMilestones} OF {totalMilestones} PHASES COMPLETED
                                </span>
                              </div>
                            </div>

                            <Button asChild variant={isCompleted ? "outline" : "default"} className={`w-full h-10 text-xs font-semibold tracking-wide transition-all ${!isCompleted ? 'bg-[#00b050] text-white hover:bg-[#009040] border-0' : 'border-slate-200 text-slate-600'}`}>
                              <Link to="/roadmap">
                                {isCompleted ? 'Review Roadmap' : 'Continue Learning'} <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )
                    })}

                    {/* "Explore New Horizons" Extra Card */}
                    <div className="group rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 flex flex-col items-center justify-center p-8 text-center min-h-[360px] hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors shadow-sm">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <MapPin className="w-6 h-6 text-slate-400 dark:text-gray-500" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Explore New Horizons
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 max-w-[220px] leading-relaxed">
                        Don't stop now! Start a new roadmap for coding, creative writing, or financial literacy.
                      </p>
                      <RoadmapCreatorModal userData={userData}>
                        <Button variant="outline" className="font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 bg-white rounded-full px-8 h-10 shadow-sm">
                          Browse Catalog
                        </Button>
                      </RoadmapCreatorModal>
                    </div>

                  </div>
                  <div className="mt-6 sm:hidden">
                    <RoadmapCreatorModal userData={userData}>
                      <Button variant="outline" className="w-full border-dashed border-[#00b050] text-[#00b050]">
                        Create New Roadmap <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </RoadmapCreatorModal>
                  </div>
                </CardContent>
              </Card>
            )}

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
                        <div className="absolute top-0 right-0 py-1 px-3 bg-blue-600 text-white text-[10px] font-bold rounded-bl-lg z-10">
                          VERIFIED FIT
                        </div>
                      )}
                      <div className={`flex flex-col gap-1 mb-3 ${career.isAptitudeBased ? 'mt-4' : ''}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{career.title}</h3>
                          <Badge className={`${career.isAptitudeBased ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'} border-0 text-[10px] h-5`}>
                            {career.matchScore}% Match
                          </Badge>
                        </div>
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
                  {aptitudeResult ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Assessment Completed</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Your cognitive profile and career matches are ready
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent opacity-80 hover:opacity-100">
                        <Link to="/quiz">View Results</Link>
                      </Button>
                    </div>
                  ) : (
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
                  )}

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
                    <span className="dark:text-gray-300">{50 + (aptitudeResult ? 25 : 0)}%</span>
                  </div>
                  <Progress value={50 + (aptitudeResult ? 25 : 0)} className="h-2" />
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
                    <div className={`w-2 h-2 ${aptitudeResult ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}></div>
                    <span className="dark:text-gray-300">
                      {aptitudeResult ? 'Aptitude test completed' : 'Aptitude test pending'}
                    </span>
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
