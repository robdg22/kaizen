import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Search from './components/Search'
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'
import Login from './components/Login'
import { useState, useEffect } from 'react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check for URL bypass parameter
      const urlParams = new URLSearchParams(window.location.search)
      const bypassToken = urlParams.get('bypass')
      
      // Unique bypass token - change this to whatever you want
      const validBypassToken = 'dslfjhshsdjhf342kjj2l3424xx84749374xy'
      
      if (bypassToken === validBypassToken) {
        // Set authentication cookie when bypass is used
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        document.cookie = `site-auth=authenticated; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`
        setIsAuthenticated(true)
        setIsLoading(false)
        
        // Clean up the URL by removing the bypass parameter
        const newUrl = window.location.pathname + window.location.hash
        window.history.replaceState({}, document.title, newUrl)
        return
      }
      
      // Check for existing authentication cookie
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
    // Change this password to whatever you want
    const correctPassword = 'red-bridge-heart'
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />
  }

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
