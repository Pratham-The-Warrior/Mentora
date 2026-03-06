import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoadmapCreatorModal } from "@/components/shared/roadmap-creator-modal"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, Users, Target, Brain, Lightbulb, TrendingUp, LayoutDashboard } from "lucide-react"
import { AuthNavbar } from "../components/layout/auth-navbar"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Arjun Sharma",
      role: "IIT Delhi, Computer Science",
      content:
        "Mentora helped me choose the right engineering stream and guided me through the JEE preparation journey.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "AIIMS Delhi, Medicine",
      content: "The career counseling sessions were incredibly helpful in clarifying my path towards medical school.",
      rating: 5,
    },
    {
      name: "Ananya Singh",
      role: "SRCC Delhi, Economics",
      content: "Thanks to Mentora's guidance, I discovered my passion for economics and got into my dream college.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthNavbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge
            className={`mb-4 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-300 ${isVisible ? "animate-fade-in" : "opacity-0"
              }`}
          >
            Where education finds you
          </Badge>
          <h1
            className={`text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-500 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-4"
              }`}
          >
            Your Career
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Journey</span>
            <br />
            Starts Here
          </h1>
          <p
            className={`text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-all duration-500 delay-100 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-4"
              }`}
          >
            Discover the perfect career path in STEM, Commerce, and Business. Explore top colleges worldwide and get
            personalized guidance from expert counselors.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-200 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-4"
              }`}
          >
            {isAuthenticated ? (
              // Logged-in users → go straight to Dashboard
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                >
                  <LayoutDashboard className="mr-2 w-4 h-4" />
                  Go to Dashboard
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200 bg-transparent"
                >
                  <Link to="/explore">Explore Careers</Link>
                </Button>
              </>
            ) : (
              // Guests → sign up flow
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                >
                  <Link to="/signup">
                    Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200 bg-transparent"
                >
                  <Link to="/explore">Explore Careers</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 transition-all duration-500 delay-300 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-4"
            }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Students Guided</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Colleges Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expert Counselors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">95%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Career Success
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From STEM to Commerce, we provide comprehensive guidance for your education and career journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "STEM Career Explorer",
              description:
                "Discover engineering, medical, research, and emerging technology fields with detailed career insights.",
              color: "blue",
              items: [
                "Engineering (IIT, NIT, Abroad)",
                "Medical & Life Sciences",
                "Computer Science & AI",
                "Space Technology & Research",
              ],
            },
            {
              icon: TrendingUp,
              title: "Commerce & Business Paths",
              description: "Explore economics, finance, business administration, and digital commerce opportunities.",
              color: "green",
              items: [
                "Economics & Finance",
                "Business Administration",
                "Chartered Accountancy",
                "Digital Marketing & E-commerce",
              ],
            },
            {
              icon: Globe,
              title: "Global College Finder",
              description: "Find the best colleges in India and abroad based on your preferences and academic profile.",
              color: "purple",
              items: [
                "IITs, NITs, AIIMS",
                "Top Commerce Colleges",
                "US Universities (MIT, Stanford)",
                "Scholarship Opportunities",
              ],
            },
            {
              icon: Users,
              title: "Expert Counselors",
              description: "Get personalized guidance from certified career counselors and industry experts.",
              color: "orange",
              items: [
                "1-on-1 Counseling Sessions",
                "Stream Selection Guidance",
                "Admission Strategy",
                "Career Planning",
              ],
            },
            {
              icon: Brain,
              title: "Aptitude Assessment",
              description: "Take comprehensive quizzes to discover your strengths and ideal career paths.",
              color: "teal",
              items: ["Interest & Aptitude Tests", "Personality Assessment", "Career Matching", "Skill Gap Analysis"],
            },
            {
              icon: Lightbulb,
              title: "Opportunities Hub",
              description: "Discover internships, research programs, competitions, and scholarships worldwide.",
              color: "pink",
              items: ["Research Internships", "Business Competitions", "Summer Programs", "Merit Scholarships"],
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800/50 dark:border-gray-700 group"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/50 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <CardTitle className="dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {feature.title}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {feature.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Students Say</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from students who have successfully navigated their career journey with Mentora's guidance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-48 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 transform ${index === currentTestimonial
                  ? "translate-x-0 opacity-100"
                  : index < currentTestimonial
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
                  }`}
              >
                <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700 h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Shape Your Future?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have found their perfect career path with Mentora.
          </p>
          <Button asChild size="lg" variant="secondary" className="transition-all duration-200">
            <Link to="/signup">
              Start Your Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Mentora</span>
              </div>
              <p className="text-gray-400">
                Empowering students to make informed decisions about their education and career paths across STEM and
                Commerce fields.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/careers" className="hover:text-white transition-colors duration-200">
                    Career Paths
                  </Link>
                </li>
                <li>
                  <Link to="/colleges" className="hover:text-white transition-colors duration-200">
                    Colleges
                  </Link>
                </li>
                <li>
                  <Link to="/opportunities" className="hover:text-white transition-colors duration-200">
                    Opportunities
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/counselor" className="hover:text-white transition-colors duration-200">
                    Talk to Counselor
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-white transition-colors duration-200">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors duration-200">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors duration-200">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors duration-200">
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors duration-200">
                    Social Media
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mentora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
