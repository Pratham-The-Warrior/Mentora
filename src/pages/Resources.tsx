import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Video, Download, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Link } from "react-router-dom"

const resources = [
  {
    category: "Study Materials",
    icon: BookOpen,
    items: [
      { title: "STEM Excellence Guide", description: "Comprehensive roadmap for STEM careers", type: "PDF" },
      { title: "College Preparation Handbook", description: "Step-by-step guide to college admissions", type: "PDF" },
      { title: "JEE/NEET Prep Resources", description: "Curated study materials and notes", type: "Resource" },
    ],
  },
  {
    category: "Video Tutorials",
    icon: Video,
    items: [
      { title: "Career Exploration Series", description: "Deep dives into different STEM fields", type: "Video" },
      { title: "College Campus Tours", description: "Virtual tours of top institutions", type: "Video" },
      { title: "Success Stories", description: "Inspiring journeys of successful students", type: "Video" },
    ],
  },
  {
    category: "Interactive Tools",
    icon: Download,
    items: [
      { title: "Career Matcher", description: "Find careers that match your skills", type: "Tool" },
      { title: "College Finder", description: "Discover colleges matching your profile", type: "Tool" },
      { title: "Salary Calculator", description: "Estimate potential earnings by career", type: "Tool" },
    ],
  },
]

export default function ResourcesPage() {
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
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Learning Resources</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Access curated study materials, video tutorials, and interactive tools to support your STEM journey.
          </p>
        </div>

        <div className="space-y-12">
          {resources.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{section.category}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {section.items.map((item) => (
                    <Card
                      key={item.title}
                      className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-xl transition-all"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg dark:text-white">{item.title}</CardTitle>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {item.type}
                          </Badge>
                        </div>
                        <CardDescription className="dark:text-gray-400">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          className="w-full bg-transparent border dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                          variant="outline"
                        >
                          <Link to="#">
                            Download <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
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
