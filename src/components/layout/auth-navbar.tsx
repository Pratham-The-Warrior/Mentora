import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Brain, Menu, LayoutDashboard, LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AuthNavbar() {
    const navigate = useNavigate()
    const { isAuthenticated, logout, loading, user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
        setIsMobileMenuOpen(false)
    }

    // ── Desktop auth area ────────────────────────────────────────
    const authButtons: React.ReactNode = !loading && isAuthenticated ? (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    Dashboard
                </Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        {user?.name?.split(" ")[0] ?? "Account"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-900 dark:border-gray-700">
                    <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer">
                        <LogOut className="w-4 h-4" /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ) : !loading && !isAuthenticated ? (
        <div className="flex items-center gap-1.5">
            <Button asChild variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300">
                <Link to="/login">Log In</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                <Link to="/signup">Get Started</Link>
            </Button>
        </div>
    ) : null

    // ── Mobile auth links ────────────────────────────────────────
    const mobileAuthLinks: React.ReactNode = !loading && isAuthenticated ? (
        <>
            <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 transition-colors w-full text-left"
            >
                <LogOut className="w-4 h-4" /> Logout
            </button>
        </>
    ) : (
        <>
            <Link
                to="/login"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                Log In
            </Link>
            <Link
                to="/signup"
                className="block px-3 py-2 text-white bg-gradient-to-r from-blue-600 to-green-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                Get Started
            </Link>
        </>
    )

    const navLinks = [
        { to: "/explore", label: "Explore" },
        { to: "/careers", label: "Careers" },
        { to: "/colleges", label: "Colleges" },
        { to: "/counselor", label: "Counselor" },
    ]

    return (
        <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-800">
            <div className="container mx-auto px-4 py-3.5">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo area */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                Mentora
                            </span>
                        </Link>
                    </div>

                    {/* Desktop nav - Perfectly Centered */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-1 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop actions area */}
                    <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
                        <ThemeToggle />
                        {authButtons}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="dark:border-gray-700">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] dark:bg-gray-900 dark:border-gray-700">
                                <SheetHeader>
                                    <SheetTitle className="dark:text-white">Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-1 mt-6">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <div className="border-t dark:border-gray-700 pt-3 mt-3 flex flex-col gap-2">
                                        {mobileAuthLinks}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
