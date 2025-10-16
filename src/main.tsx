import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx is loading...')

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

if (!rootElement) {
  console.error('Root element not found!')
  throw new Error('Root element not found')
}

console.log('Creating React root...')
const root = createRoot(rootElement)

console.log('Rendering App component...')
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('App rendered successfully!')
