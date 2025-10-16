import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authCookie = document.cookie
        .split(';')
        .find(c => c.trim().startsWith('site-auth='))
      
      if (authCookie && authCookie.split('=')[1] === 'authenticated') {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (password: string): boolean => {
    // In a real app, you'd get this from an environment variable or API
    // For now, we'll use a hardcoded password (you should set this in Vercel env vars)
    const correctPassword = 'your-secure-password-here' // TODO: Get from env var
    
    if (password === correctPassword) {
      // Set cookie that expires in 7 days
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      
      document.cookie = `site-auth=authenticated; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`
      setIsAuthenticated(true)
      return true
    }
    
    return false
  }

  const logout = () => {
    // Clear the cookie
    document.cookie = 'site-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
