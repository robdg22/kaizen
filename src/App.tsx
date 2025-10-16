import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Search from './components/Search'
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'
import Login from './components/Login'
import { useState, useEffect } from 'react'

function App() {
  console.log('App component is rendering!')
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on mount
  useEffect(() => {
    console.log('useEffect is running!')
    const checkAuth = () => {
      console.log('Checking authentication...')
      console.log('Document cookie:', document.cookie)
      
      const authCookie = document.cookie
        .split(';')
        .find(c => c.trim().startsWith('site-auth='))
      
      console.log('Auth cookie found:', authCookie)
      
      if (authCookie && authCookie.split('=')[1] === 'authenticated') {
        console.log('User is authenticated')
        setIsAuthenticated(true)
      } else {
        console.log('User is not authenticated')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (password: string): boolean => {
    console.log('Login function called with password:', password)
    // Simple password check - you can change this
    const correctPassword = 'test123'
    
    if (password === correctPassword) {
      console.log('Password correct, setting cookie')
      // Set cookie that expires in 7 days
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      
      document.cookie = `site-auth=authenticated; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`
      setIsAuthenticated(true)
      return true
    }
    
    console.log('Password incorrect')
    return false
  }

  console.log('Current state - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated)

  if (isLoading) {
    console.log('App is loading...')
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, showing login')
    return <Login onLogin={login} />
  }

  console.log('User authenticated, showing main app')
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Search />
              <Footer />
            </>
          } />
          <Route path="/product/:tpnc" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
