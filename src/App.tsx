import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Search from './components/Search'
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'

function App() {
  console.log('App component is rendering!')
  
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
