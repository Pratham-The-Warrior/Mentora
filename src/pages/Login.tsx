import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, ArrowRight, Mail, Lock } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      await login(formData.email, formData.password)
      // Check if user has completed onboarding
      try {
        await api.get('/profile')
        navigate("/dashboard")
      } catch {
        navigate("/onboarding")
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              {/* Removed orange dot from logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Mentora
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">STEM Career Guide</div>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl dark:text-white">Welcome Back</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Log in to continue your STEM career journey with Mentora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-200">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                >
                  {loading ? "Logging in..." : "Log In"}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>

                {/* Signup Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-white dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 shadow-md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">New to Mentora?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Create an account to get personalized career recommendations, explore STEM paths, and connect with expert
              counselors.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
            >
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
