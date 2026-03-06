import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowRight, TrendingUp, Users, Zap } from "lucide-react"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import { Link } from "react-router-dom"

const featuredCareers = [
  {
    title: "Software Engineer",
    description: "Design and develop applications that power the modern world",
    growth: "+22%",
    salary: "₹8-25 LPA",
  },
  {
    title: "Data Scientist",
    description: "Extract insights from data to drive business decisions",
    growth: "+35%",
    salary: "₹10-30 LPA",
  },
  {
    title: "AI/ML Specialist",
    description: "Build intelligent systems that learn and adapt",
    growth: "+40%",
    salary: "₹12-35 LPA",
  },
  {
    title: "Cloud Architect",
    description: "Design scalable cloud infrastructure solutions",
    growth: "+28%",
    salary: "₹15-40 LPA",
  },
  {
    title: "Biomedical Engineer",
    description: "Innovate healthcare through engineering",
    growth: "+15%",
    salary: "₹6-20 LPA",
  },
  {
    title: "Aerospace Engineer",
    description: "Design next-generation aircraft and spacecraft",
    growth: "+10%",
    salary: "₹8-22 LPA",
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthNavbar />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Discover Your Perfect Career</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore in-demand STEM careers with detailed insights on growth rates, salaries, and required skills.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">500+ Careers</h3>
              <p className="text-gray-600 dark:text-gray-300">Explore diverse career paths across industries</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <Zap className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Real-time Data</h3>
              <p className="text-gray-600 dark:text-gray-300">Current salary ranges and growth projections</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Expert Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Learn from industry professionals</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Careers Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Careers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCareers.map((career) => (
              <Card
                key={career.title}
                className="border-0 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800/50 dark:border-gray-700 group"
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                    {career.title}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">{career.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Growth</span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {career.growth}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Salary</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{career.salary}</span>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-transparent border dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    variant="outline"
                  >
                    <Link to="/explore">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to explore your career path?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Take our personalized assessment to get career recommendations tailored to your skills and interests.
          </p>
          <Button
            asChild
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-semibold"
          >
            <Link to="/signup">
              Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Mentora</h3>
              <p className="text-gray-400">Empowering your STEM career journey</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/explore" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/colleges" className="hover:text-white">
                    Colleges
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/counselor" className="hover:text-white">
                    Counselor
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Mentora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
