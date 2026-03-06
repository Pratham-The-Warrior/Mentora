import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import { Brain, Search, MapPin, BookOpen, Award, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

const collegeRegions = [
  {
    id: "usa",
    name: "USA",
    colleges: [
      {
        name: "Stanford University",
        location: "Stanford, California",
        stemScore: 99,
        acceptance: "3.2%",
        tuition: "$57,692",
        region: "USA",
        topProgram: "Computer Science",
        highlights: ["World-Class Research", "Silicon Valley Access", "Cutting-Edge Labs"],
        established: 1885,
      },
      {
        name: "MIT",
        location: "Cambridge, Massachusetts",
        stemScore: 100,
        acceptance: "2.7%",
        tuition: "$55,878",
        region: "USA",
        topProgram: "Engineering",
        highlights: ["Engineering Pioneer", "AI & Robotics", "Strong Networks"],
        established: 1861,
      },
      {
        name: "Georgia Tech",
        location: "Atlanta, Georgia",
        stemScore: 94,
        acceptance: "17%",
        tuition: "$31,370",
        region: "USA",
        topProgram: "Aerospace Engineering",
        highlights: ["Public Research Leader", "Industry Partnerships", "Affordable"],
        established: 1885,
      },
      {
        name: "Carnegie Mellon University",
        location: "Pittsburgh, Pennsylvania",
        stemScore: 98,
        acceptance: "9%",
        tuition: "$58,920",
        region: "USA",
        topProgram: "AI & Computer Science",
        highlights: ["AI Innovation Hub", "Tech Community", "Strong CS Program"],
        established: 1900,
      },
      {
        name: "Caltech",
        location: "Pasadena, California",
        stemScore: 99,
        acceptance: "2.4%",
        tuition: "$58,197",
        region: "USA",
        topProgram: "Physics & Engineering",
        highlights: ["Elite Science", "Research Intensive", "Small Classes"],
        established: 1891,
      },
    ],
  },
  {
    id: "europe",
    name: "Europe",
    colleges: [
      {
        name: "ETH Zurich",
        location: "Zurich, Switzerland",
        stemScore: 96,
        acceptance: "11%",
        tuition: "$1,500",
        region: "Europe",
        topProgram: "Engineering",
        highlights: ["Affordable Excellence", "Global Top 10", "European Access"],
        established: 1855,
      },
      {
        name: "Oxford University",
        location: "Oxford, United Kingdom",
        stemScore: 97,
        acceptance: "3.5%",
        tuition: "$37,000",
        region: "Europe",
        topProgram: "Physics & Mathematics",
        highlights: ["Historic Excellence", "Tutorial System", "Research Tradition"],
        established: 1096,
      },
      {
        name: "Cambridge University",
        location: "Cambridge, United Kingdom",
        stemScore: 97,
        acceptance: "3.3%",
        tuition: "$38,500",
        region: "Europe",
        topProgram: "Engineering & Natural Sciences",
        highlights: ["Nobel Prize Winners", "Global Recognition", "Top Research"],
        established: 1209,
      },
    ],
  },
  {
    id: "asia",
    name: "Asia",
    colleges: [
      {
        name: "NUS Singapore",
        location: "Singapore",
        stemScore: 92,
        acceptance: "5%",
        tuition: "$19,000",
        region: "Asia",
        topProgram: "Engineering & Computing",
        highlights: ["Asian Leader", "Tech Hub", "International Network"],
        established: 1905,
      },
      {
        name: "Tokyo Institute of Technology",
        location: "Tokyo, Japan",
        stemScore: 91,
        acceptance: "12%",
        tuition: "$5,000",
        region: "Asia",
        topProgram: "Electrical Engineering",
        highlights: ["Affordable Excellence", "Tech Innovation", "Industry Links"],
        established: 1881,
      },
    ],
  },
]

export default function CollegesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const filteredColleges = collegeRegions
    .flatMap((region) =>
      region.colleges.map((college) => ({ ...college, regionName: region.name, regionId: region.id })),
    )
    .filter(
      (college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((college) => selectedRegion === "all" || college.regionId === selectedRegion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Universities</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover world-leading institutions with exceptional STEM programs. Find the perfect university based on
            your interests, location, and academic goals.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search universities or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Region Tabs */}
        <Tabs value={selectedRegion} onValueChange={setSelectedRegion} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 dark:bg-gray-800">
            <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
              All Universities
            </TabsTrigger>
            {collegeRegions.map((region) => (
              <TabsTrigger
                key={region.id}
                value={region.id}
                className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300"
              >
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <UniversityCard key={index} college={college} />
              ))}
            </div>
          </TabsContent>

          {collegeRegions.map((region) => (
            <TabsContent key={region.id} value={region.id} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {region.colleges.map((college, index) => (
                  <UniversityCard key={index} college={{ ...college, regionName: region.name }} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* No Results */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No universities found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or explore different regions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function UniversityCard({ college }: { college: any }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group dark:bg-gray-800/50 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
              {college.name}
            </CardTitle>
            <Badge variant="secondary" className="mt-2 dark:bg-gray-700 dark:text-gray-200">
              {college.regionName}
            </Badge>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
            {college.stemScore}/100
          </Badge>
        </div>
        <CardDescription className="mt-3 flex items-center gap-1 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          {college.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Program */}
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Top Program</p>
          <p className="font-semibold text-sm dark:text-gray-200">{college.topProgram}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Acceptance</p>
              <p className="font-semibold text-sm dark:text-gray-200">{college.acceptance}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tuition</p>
              <p className="font-semibold text-sm dark:text-gray-200">{college.tuition}</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Highlights:</p>
          <div className="flex flex-wrap gap-1">
            {college.highlights.slice(0, 3).map((highlight: string) => (
              <Badge key={highlight} variant="outline" className="text-xs dark:text-gray-400 dark:border-gray-700">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
          variant="outline"
          asChild
        >
          <Link to={`/colleges/${college.name.toLowerCase().replace(/\s+/g, "-")}`}>
            Learn More <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
