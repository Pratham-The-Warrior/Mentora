import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
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
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/colleges" element={<Colleges />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/counselor" element={<Counselor />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/resources" element={<Resources />} />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
