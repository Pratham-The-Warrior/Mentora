import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthNavbar } from "@/components/auth-navbar"
import {
  Brain,
  Search,
  DollarSign,
  Clock,
  Code,
  Stethoscope,
  Rocket,
  Microscope,
  TrendingUp,
  ExternalLink,
} from "lucide-react"
import { Link } from "react-router-dom"

const careerCategories = [
  {
    id: "engineering",
    name: "Engineering",
    icon: Code,
    color: "bg-blue-100 text-blue-600",
    careers: [
      {
        title: "Computer Science Engineering",
        description: "Design and develop software systems, AI, and computing solutions",
        growth: "+22%",
        salary: "₹8-25 LPA",
        duration: "4 years",
        demand: "Very High",
        skills: ["Programming", "Problem Solving", "Mathematics", "Logic"],
        topColleges: ["IIT Delhi", "IIT Bombay", "IIIT Hyderabad", "NIT Trichy"],
      },
      {
        title: "Mechanical Engineering",
        description: "Design, build, and maintain mechanical systems and machines",
        growth: "+8%",
        salary: "₹6-18 LPA",
        duration: "4 years",
        demand: "High",
        skills: ["CAD Design", "Thermodynamics", "Materials Science", "Manufacturing"],
        topColleges: ["IIT Madras", "IIT Kharagpur", "NIT Warangal", "BITS Pilani"],
      },
      {
        title: "Aerospace Engineering",
        description: "Develop aircraft, spacecraft, and related systems",
        growth: "+6%",
        salary: "₹8-22 LPA",
        duration: "4 years",
        demand: "Medium",
        skills: ["Aerodynamics", "Propulsion", "Control Systems", "Materials"],
        topColleges: ["IIT Bombay", "IIT Madras", "IIT Kanpur", "IIST Trivandrum"],
      },
    ],
  },
  {
    id: "medical",
    name: "Medical & Healthcare",
    icon: Stethoscope,
    color: "bg-red-100 text-red-600",
    careers: [
      {
        title: "Medicine (MBBS)",
        description: "Diagnose, treat, and prevent diseases and injuries",
        growth: "+7%",
        salary: "₹10-50 LPA",
        duration: "5.5 years",
        demand: "Very High",
        skills: ["Medical Knowledge", "Empathy", "Communication", "Critical Thinking"],
        topColleges: ["AIIMS Delhi", "JIPMER", "CMC Vellore", "KGMU Lucknow"],
      },
      {
        title: "Biomedical Engineering",
        description: "Apply engineering principles to healthcare and medical devices",
        growth: "+5%",
        salary: "₹6-20 LPA",
        duration: "4 years",
        demand: "High",
        skills: ["Biology", "Engineering", "Medical Devices", "Data Analysis"],
        topColleges: ["IIT Delhi", "IIT Bombay", "VIT Vellore", "Manipal Institute"],
      },
    ],
  },
  {
    id: "commerce",
    name: "Commerce & Business",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
    careers: [
      {
        title: "Economics",
        description: "Analyze economic trends, policies, and market behavior",
        growth: "+14%",
        salary: "₹6-30 LPA",
        duration: "3-4 years",
        demand: "High",
        skills: ["Data Analysis", "Statistics", "Research", "Critical Thinking"],
        topColleges: ["LSR Delhi", "St. Xavier's Mumbai", "Christ University", "Loyola Chennai"],
      },
      {
        title: "Business Administration (BBA/MBA)",
        description: "Manage business operations, strategy, and organizational leadership",
        growth: "+10%",
        salary: "₹8-40 LPA",
        duration: "3-5 years",
        demand: "Very High",
        skills: ["Leadership", "Strategy", "Communication", "Project Management"],
        topColleges: ["IIM Ahmedabad", "IIM Bangalore", "XLRI Jamshedpur", "FMS Delhi"],
      },
      {
        title: "Chartered Accountancy (CA)",
        description: "Provide financial advisory, auditing, and taxation services",
        growth: "+8%",
        salary: "₹7-25 LPA",
        duration: "4-5 years",
        demand: "High",
        skills: ["Accounting", "Taxation", "Auditing", "Financial Analysis"],
        topColleges: ["ICAI Centers", "Shri Ram College", "Hans Raj College", "Kirori Mal College"],
      },
      {
        title: "Finance & Investment Banking",
        description: "Manage investments, financial planning, and banking operations",
        growth: "+12%",
        salary: "₹10-50 LPA",
        duration: "3-4 years",
        demand: "High",
        skills: ["Financial Modeling", "Risk Analysis", "Market Research", "Mathematics"],
        topColleges: ["SRCC Delhi", "Loyola Chennai", "Christ University", "NMIMS Mumbai"],
      },
      {
        title: "Company Secretary (CS)",
        description: "Ensure corporate compliance and governance",
        growth: "+6%",
        salary: "₹5-20 LPA",
        duration: "3-4 years",
        demand: "Medium",
        skills: ["Corporate Law", "Compliance", "Communication", "Legal Knowledge"],
        topColleges: ["ICSI Centers", "DU Colleges", "Mumbai University", "Pune University"],
      },
      {
        title: "Digital Marketing & E-commerce",
        description: "Develop online marketing strategies and manage digital businesses",
        growth: "+18%",
        salary: "₹4-20 LPA",
        duration: "3 years",
        demand: "Very High",
        skills: ["SEO/SEM", "Social Media", "Analytics", "Content Creation"],
        topColleges: ["NIFT Delhi", "Pearl Academy", "MIT Pune", "Symbiosis Pune"],
      },
    ],
  },
  {
    id: "space",
    name: "Space & Aerospace",
    icon: Rocket,
    color: "bg-purple-100 text-purple-600",
    careers: [
      {
        title: "Space Technology",
        description: "Develop satellites, rockets, and space exploration systems",
        growth: "+15%",
        salary: "₹12-30 LPA",
        duration: "4 years",
        demand: "High",
        skills: ["Aerospace Engineering", "Physics", "Programming", "Systems Design"],
        topColleges: ["IIST Trivandrum", "IIT Bombay", "IIT Madras", "IIT Kharagpur"],
      },
    ],
  },
  {
    id: "research",
    name: "Research & Academia",
    icon: Microscope,
    color: "bg-indigo-100 text-indigo-600",
    careers: [
      {
        title: "Scientific Research",
        description: "Conduct research in physics, chemistry, biology, or mathematics",
        growth: "+8%",
        salary: "₹5-25 LPA",
        duration: "4-8 years",
        demand: "Medium",
        skills: ["Research Methods", "Data Analysis", "Scientific Writing", "Critical Thinking"],
        topColleges: ["IISc Bangalore", "TIFR Mumbai", "IIT Delhi", "JNU Delhi"],
      },
    ],
  },
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredCareers = careerCategories
    .flatMap((category) =>
      category.careers.map((career) => ({ ...career, category: category.name, categoryId: category.id })),
    )
    .filter(
      (career) =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((career) => selectedCategory === "all" || career.categoryId === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Career Paths</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover exciting career opportunities in STEM, Commerce, and Business. Find your perfect match based on
            your interests and skills.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search careers, skills, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 dark:bg-gray-800">
            <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              All Careers
            </TabsTrigger>
            {careerCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers.map((career, index) => (
                <CareerCard key={index} career={career} />
              ))}
            </div>
          </TabsContent>

          {careerCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.careers.map((career, index) => (
                  <CareerCard key={index} career={{ ...career, category: category.name }} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* No Results */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No careers found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or explore different categories.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CareerCard({ career }: { career: any }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group dark:bg-gray-800/50 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
              {career.title}
            </CardTitle>
            <Badge variant="secondary" className="mt-2 dark:bg-gray-700 dark:text-gray-200">
              {career.category}
            </Badge>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
            {career.growth} Growth
          </Badge>
        </div>
        <CardDescription className="mt-3 dark:text-gray-400">{career.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Salary Range</p>
              <p className="font-semibold text-sm dark:text-gray-200">{career.salary}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-sm dark:text-gray-200">{career.duration}</p>
            </div>
          </div>
        </div>

        {/* Demand Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Job Demand:</span>
          <Badge
            className={
              career.demand === "Very High"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                : career.demand === "High"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
            }
          >
            {career.demand}
          </Badge>
        </div>

        {/* Skills */}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Skills:</p>
          <div className="flex flex-wrap gap-1">
            {career.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs dark:text-gray-400 dark:border-gray-700">
                {skill}
              </Badge>
            ))}
            {career.skills.length > 3 && (
              <Badge variant="outline" className="text-xs dark:text-gray-400 dark:border-gray-700">
                +{career.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Top Colleges */}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Top Colleges:</p>
          <div className="space-y-1">
            {career.topColleges.slice(0, 2).map((college: string) => (
              <p key={college} className="text-xs text-gray-600 dark:text-gray-400">
                • {college}
              </p>
            ))}
            {career.topColleges.length > 2 && (
              <p className="text-xs text-gray-500 dark:text-gray-500">+{career.topColleges.length - 2} more colleges</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
          variant="outline"
          asChild
        >
          <Link to={`/explore/${career.title.toLowerCase().replace(/\s+/g, "-")}`}>
            Learn More <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
