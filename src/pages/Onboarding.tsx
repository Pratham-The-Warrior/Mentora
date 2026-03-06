import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Brain } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Link, useNavigate } from "react-router-dom"
import api from "@/lib/api"

interface OnboardingData {
  class: string
  stream: string
  targetExam: string[]
  interests: string[]
  challenges: string[]
  goals: string
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    class: "",
    stream: "",
    targetExam: [],
    interests: [],
    challenges: [],
    goals: "",
  })

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userEmail = localStorage.getItem("userEmail")
    if (!token && !userEmail) {
      navigate("/signup")
    }
  }, [navigate])

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save to localStorage for instant access
      localStorage.setItem("onboardingData", JSON.stringify(data))
      localStorage.setItem("currentUser", "true")
      // Save to backend API (non-blocking)
      try {
        await api.post('/profile', data)
      } catch (err) {
        console.warn('Profile API save failed, using localStorage fallback:', err)
      }
      navigate("/dashboard")
    }
  }


  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: "targetExam" | "interests" | "challenges", item: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((i) => i !== item) : [...prev[field], item],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm dark:border-gray-800">
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
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium">
                Step {step} of {totalSteps}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Complete your profile to get personalized recommendations
            </p>
          </div>

          <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">
                {step === 1 && "Let's start with the basics"}
                {step === 2 && "What's your academic stream?"}
                {step === 3 && "Which exams are you targeting?"}
                {step === 4 && "What interests you most?"}
                {step === 5 && "What challenges do you face?"}
                {step === 6 && "What's your primary goal?"}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {step === 1 && "Tell us about your current academic status"}
                {step === 2 && "This helps us understand your subject focus"}
                {step === 3 && "Select all that apply to your career plans"}
                {step === 4 && "Choose areas that excite you the most"}
                {step === 5 && "Help us understand how to support you better"}
                {step === 6 && "What do you want to achieve in the next 2-3 years?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Class */}
              {step === 1 && (
                <RadioGroup value={data.class} onValueChange={(value) => updateData("class", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="11" id="class11" />
                    <Label htmlFor="class11" className="dark:text-gray-200">
                      Class 11
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12" id="class12" />
                    <Label htmlFor="class12" className="dark:text-gray-200">
                      Class 12
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12th-passed" id="passed" />
                    <Label htmlFor="passed" className="dark:text-gray-200">
                      12th Passed (Gap Year)
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {/* Step 2: Stream */}
              {step === 2 && (
                <RadioGroup value={data.stream} onValueChange={(value) => updateData("stream", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PCM" id="pcm" />
                    <Label htmlFor="pcm" className="dark:text-gray-200">
                      PCM (Physics, Chemistry, Mathematics)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PCB" id="pcb" />
                    <Label htmlFor="pcb" className="dark:text-gray-200">
                      PCB (Physics, Chemistry, Biology)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PCMB" id="pcmb" />
                    <Label htmlFor="pcmb" className="dark:text-gray-200">
                      PCMB (All four subjects)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="dark:text-gray-200">
                      Other combination
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {/* Step 3: Target Exams */}
              {step === 3 && (
                <div className="space-y-4">
                  {["JEE Main & Advanced", "NEET", "BITSAT", "SAT/ACT (US)", "A-Levels (UK)", "Not sure yet"].map(
                    (exam) => (
                      <div key={exam} className="flex items-center space-x-2">
                        <Checkbox
                          id={exam}
                          checked={data.targetExam.includes(exam)}
                          onCheckedChange={() => toggleArrayItem("targetExam", exam)}
                        />
                        <Label htmlFor={exam} className="dark:text-gray-200">
                          {exam}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Step 4: Interests */}
              {step === 4 && (
                <div className="space-y-4">
                  {[
                    "Computer Science & AI",
                    "Mechanical Engineering",
                    "Medical & Healthcare",
                    "Biotechnology",
                    "Space & Aerospace",
                    "Environmental Science",
                    "Data Science & Analytics",
                    "Robotics & Automation",
                    "Research & Academia",
                    "Entrepreneurship",
                  ].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={data.interests.includes(interest)}
                        onCheckedChange={() => toggleArrayItem("interests", interest)}
                      />
                      <Label htmlFor={interest} className="dark:text-gray-200">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Challenges */}
              {step === 5 && (
                <div className="space-y-4">
                  {[
                    "Choosing the right career path",
                    "Understanding college admission process",
                    "Managing study time effectively",
                    "Dealing with exam pressure",
                    "Lack of career guidance",
                    "Financial constraints for education",
                    "Information about studying abroad",
                    "Parental pressure & expectations",
                  ].map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={data.challenges.includes(challenge)}
                        onCheckedChange={() => toggleArrayItem("challenges", challenge)}
                      />
                      <Label htmlFor={challenge} className="dark:text-gray-200">
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 6: Goals */}
              {step === 6 && (
                <RadioGroup value={data.goals} onValueChange={(value) => updateData("goals", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-iit" id="top-iit" />
                    <Label htmlFor="top-iit" className="dark:text-gray-200">
                      Get into top IITs/NITs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medical-college" id="medical" />
                    <Label htmlFor="medical" className="dark:text-gray-200">
                      Get into top medical colleges
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="study-abroad" id="abroad" />
                    <Label htmlFor="abroad" className="dark:text-gray-200">
                      Study abroad (US/UK/Canada)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="explore-options" id="explore" />
                    <Label htmlFor="explore" className="dark:text-gray-200">
                      Explore all available options
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="career-clarity" id="clarity" />
                    <Label htmlFor="clarity" className="dark:text-gray-200">
                      Get clarity on career direction
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {step === totalSteps ? "Complete Setup" : "Next"}
                  {step !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
