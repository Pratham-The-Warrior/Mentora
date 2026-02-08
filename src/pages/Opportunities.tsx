import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Award } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link } from "react-router-dom"

const opportunities = [
  {
    title: "STEM Summer Internship Program",
    organization: "Top Tech Companies",
    description: "6-week internship opportunity for high school and college students in tech and engineering",
    deadline: "March 15, 2026",
    stipend: "₹15,000 - ₹25,000",
    type: "Internship",
  },
  {
    title: "National Science Olympiad",
    organization: "Science Foundation",
    description: "Compete nationally in physics, chemistry, and biology competitions",
    deadline: "April 30, 2026",
    stipend: "Prizes up to ₹5,00,000",
    type: "Competition",
  },
  {
    title: "Research Fellowship",
    organization: "Leading Universities",
    description: "Conduct innovative research with guidance from experienced mentors",
    deadline: "Ongoing",
    stipend: "₹10,000 - ₹30,000/month",
    type: "Fellowship",
  },
  {
    title: "Coding Challenge Series",
    organization: "Tech Community",
    description: "Monthly coding competitions with networking opportunities",
    deadline: "Rolling",
    stipend: "Cash prizes & job opportunities",
    type: "Competition",
  },
  {
    title: "Startup Incubation Program",
    organization: "Innovation Hub",
    description: "Develop your STEM-based startup idea with mentorship and funding",
    deadline: "May 30, 2026",
    stipend: "Seed funding available",
    type: "Incubation",
  },
  {
    title: "Scholarship Programs",
    organization: "Various Institutions",
    description: "Merit-based and need-based scholarships for STEM students",
    deadline: "Multiple",
    stipend: "Up to full tuition coverage",
    type: "Scholarship",
  },
]

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Mentora
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">STEM Opportunities</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover internships, competitions, scholarships, and programs designed to advance your STEM career.
          </p>
        </div>

        <div className="space-y-6">
          {opportunities.map((opp) => (
            <Card
              key={opp.title}
              className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{opp.title}</h3>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap">
                        {opp.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{opp.organization}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{opp.description}</p>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {opp.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>{opp.stipend}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="md:whitespace-nowrap bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Don't miss out on great opportunities</h2>
          <p className="text-lg text-white/90 mb-8">
            Join Mentora to get personalized opportunities matched to your profile
          </p>
          <Button
            asChild
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg font-semibold"
          >
            <Link to="/signup">Sign Up Today</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 Mentora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
