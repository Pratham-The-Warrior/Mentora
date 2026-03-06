import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/layout/theme-provider"
import { AuthProvider } from '@/hooks/useAuth'
import { ProtectedRoute, GuestRoute } from '@/components/shared/route-guards'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Explore from './pages/Explore'
import Careers from './pages/Careers'
import Colleges from './pages/Colleges'
import Contact from './pages/Contact'
import Counselor from './pages/Counselor'
import Faq from './pages/Faq'
import Onboarding from './pages/Onboarding'
import Opportunities from './pages/Opportunities'
import Quiz from './pages/Quiz'
import Resources from './pages/Resources'

function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/colleges" element={<Colleges />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/opportunities" element={<Opportunities />} />

                        {/* Guest-only (redirect to dashboard if already logged in) */}
                        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                        {/* Protected (redirect to login if not authenticated) */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                        <Route path="/counselor" element={<ProtectedRoute><Counselor /></ProtectedRoute>} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
