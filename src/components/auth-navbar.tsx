import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Brain, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AuthNavbar() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail")
    const onboardingData = localStorage.getItem("onboardingData")
    setIsAuthenticated(!!(userEmail && onboardingData))
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("onboardingData")
    localStorage.removeItem("currentUser")
    setIsAuthenticated(false)
    navigate("/")
  }

  let authButtons: React.ReactNode = null

  if (!isLoading && isAuthenticated) {
    authButtons = (
      <>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </>
    )
  }

  if (!isLoading && !isAuthenticated) {
    authButtons = (
      <>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white ml-2"
        >
          <Link to="/signup">Get Started</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login">Log In</Link>
        </Button>
      </>
    )
  }

  const navigationLinks = (
    <>
      <Link to="/explore"
        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Explore
      </Link>
      <Link to="/careers"
        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Careers
      </Link>
      <Link to="/colleges"
        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Colleges
      </Link>
      <Link to="/counselor"
        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Counselor
      </Link>
    </>
  )

  return (
    <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Mentora
              </span>
            </Link>
          </div>

          {/* Desktop nav - Centered */}
          <nav className="hidden md:flex items-center justify-center space-x-1">
            <Link to="/explore" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Explore
            </Link>
            <Link to="/careers" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Careers
            </Link>
            <Link to="/colleges" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Colleges
            </Link>
            <Link to="/counselor" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Counselor
            </Link>
          </nav>

          {/* Actions & Mobile */}
          <div className="flex-1 flex justify-end items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1">
              <ThemeToggle />
              {authButtons}
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    {navigationLinks}
                    <div className="border-t pt-4 space-y-2">
                      {authButtons}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
