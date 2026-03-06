import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Brain } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Link } from "react-router-dom"

const faqs = [
  {
    question: "What is Mentora and how can it help me?",
    answer:
      "Mentora is an AI-powered STEM career guidance platform that provides personalized recommendations, college matching, and expert counseling to help you make informed decisions about your educational and career path.",
  },
  {
    question: "Is the platform free to use?",
    answer:
      "Our basic features including career exploration and college finder are available for free. Premium features like expert counselor sessions have additional costs.",
  },
  {
    question: "How does the career assessment work?",
    answer:
      "Our assessment analyzes your academic profile, interests, skills, and goals using advanced algorithms to provide tailored career recommendations with detailed insights.",
  },
  {
    question: "Can I change my preferences after signup?",
    answer: "Yes! You can update your profile, interests, and goals anytime in your dashboard settings.",
  },
  {
    question: "How do I book a session with a counselor?",
    answer:
      "Navigate to the Counselor section, choose your preferred session type (video or chat), select an available time slot, and complete the booking.",
  },
  {
    question: "What makes your college recommendations accurate?",
    answer:
      "We use data from thousands of students, institutional rankings, STEM program quality metrics, and your personal profile to provide highly relevant college matches.",
  },
]

export default function FAQPage() {
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

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about Mentora and how to make the most of our platform.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border dark:border-gray-700 rounded-lg px-6 dark:bg-gray-800/30"
            >
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-white hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300 pt-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-white/90 mb-6">Get in touch with our support team</p>
          <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/contact">Contact Us</Link>
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
