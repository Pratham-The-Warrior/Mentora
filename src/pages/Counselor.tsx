import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MessageCircle, Video, Calendar, Star, Clock, CheckCircle, Send } from "lucide-react"
import { Link } from "react-router-dom"
import { AuthNavbar } from "@/components/auth-navbar"

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

export default function CounselorPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null)
  const [sessionType, setSessionType] = useState<"chat" | "video">("video")
  const [question, setQuestion] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Expert Career Counseling</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Get personalized guidance from certified career counselors who specialize in STEM education and career
            planning.
          </p>
        </div>

        <Tabs defaultValue="book-session" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 dark:bg-gray-800">
            <TabsTrigger value="book-session" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Book a Session
            </TabsTrigger>
            <TabsTrigger value="ask-question" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              Ask a Question
            </TabsTrigger>
          </TabsList>

          {/* Book Session Tab */}
          <TabsContent value="book-session" className="space-y-8">
            {/* Session Type Selection */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Choose Your Session Type</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Select how you'd like to connect with your counselor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${sessionType === "video"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    onClick={() => setSessionType("video")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold dark:text-white">Video Call Session</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Face-to-face consultation with screen sharing capabilities
                    </p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                      Most Popular
                    </Badge>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${sessionType === "chat"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    onClick={() => setSessionType("chat")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold dark:text-white">Chat Session</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Text-based consultation with document sharing
                    </p>
                    <Badge variant="outline" className="dark:text-gray-400 dark:border-gray-700">
                      Budget Friendly
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Counselor Selection */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Counselor</h2>
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {counselors.map((counselor) => (
                  <Card
                    key={counselor.id}
                    className={`border-0 shadow-lg cursor-pointer transition-all dark:bg-gray-800/50 dark:border-gray-700 ${selectedCounselor === counselor.id
                        ? "ring-2 ring-blue-500 shadow-xl dark:ring-blue-400"
                        : "hover:shadow-xl"
                      }`}
                    onClick={() => setSelectedCounselor(counselor.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <img
                          src={counselor.image || "/placeholder.svg"}
                          alt={counselor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-lg dark:text-white">{counselor.name}</CardTitle>
                          <CardDescription className="font-medium text-blue-600 dark:text-blue-400">
                            {counselor.specialization}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1 dark:text-gray-300">{counselor.rating}</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({counselor.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Experience: {counselor.experience}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          Education: {counselor.education}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Languages: {counselor.languages.join(", ")}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Expertise:</p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.expertise.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs dark:text-gray-400 dark:border-gray-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">60 min</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{counselor.price}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            {selectedCounselor && (
              <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Book Your Session</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Complete your booking with {counselors.find((c) => c.id === selectedCounselor)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Date
                      </label>
                      <Input type="date" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Time
                      </label>
                      <Input type="time" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What would you like to discuss? (Optional)
                    </label>
                    <Textarea
                      placeholder="e.g., Career guidance for computer science, college selection for engineering, study abroad options..."
                      rows={3}
                      className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive a confirmation email with session details
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ask Question Tab */}
          <TabsContent value="ask-question" className="space-y-8">
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Ask Our Experts</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Submit your career-related questions and get expert answers within 24-48 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Question
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Class
                    </label>
                    <Input
                      placeholder="e.g., Class 11, Class 12"
                      className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject Stream
                    </label>
                    <Input
                      placeholder="e.g., PCM, PCB, PCMB"
                      className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>

                <Button
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={!question.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Question
                </Button>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">Free Service</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        This service is completely free. You'll receive a detailed answer from our experts within 24-48
                        hours.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    How do I choose between engineering and medical?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Consider your interests in problem-solving vs. helping people, your strengths in math/physics vs.
                    biology, and long-term career goals.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    What are the best colleges for computer science?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Top options include IITs, NITs, IIIT Hyderabad, and for abroad: MIT, Stanford, CMU, UC Berkeley.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">How can I study abroad after 12th?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Prepare for standardized tests (SAT/ACT), maintain good grades, apply for scholarships, and start
                    applications early.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
