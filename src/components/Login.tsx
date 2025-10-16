import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const Login = () => {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const hasError = searchParams.get('error') === '1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Create form data and submit to /api/login endpoint
    const formData = new FormData()
    formData.append('password', password)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData
      })

      if (response.ok || response.status === 302) {
        // Redirect will be handled by the API response
        window.location.href = '/'
      } else {
        // Handle error case
        window.location.href = '/login?error=1'
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Tesco Logo */}
          <div className="mx-auto h-16 w-16 mb-6">
            <svg viewBox="0 0 100 100" className="h-16 w-16 text-blue-600">
              <rect width="100" height="100" fill="currentColor" rx="8"/>
              <text x="50" y="60" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">T</text>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Site Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the password to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {hasError && (
            <div className="text-red-600 text-sm text-center">
              Incorrect password. Please try again.
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This site is password protected
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
