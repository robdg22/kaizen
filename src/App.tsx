import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Search from './components/Search'
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Search />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/product/:tpnc" element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
