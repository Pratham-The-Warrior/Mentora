import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../lib/api'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // Restore session on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password })
        const { token: newToken, user: newUser } = response.data
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        // Keep legacy keys for backward compatibility with pages not yet updated
        localStorage.setItem('userEmail', newUser.email)
        setToken(newToken)
        setUser(newUser)
    }

    const signup = async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/signup', { name, email, password })
        const { token: newToken, user: newUser } = response.data
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        localStorage.setItem('userEmail', newUser.email)
        setToken(newToken)
        setUser(newUser)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('onboardingData')
        localStorage.removeItem('currentUser')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                signup,
                logout,
                isAuthenticated: !!user && !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
