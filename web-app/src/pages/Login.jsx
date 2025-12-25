import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, LogIn, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [authPin, setAuthPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!phoneNumber || !authPin) {
      setError('Please enter both phone number and PIN')
      setLoading(false)
      return
    }

    const result = await login(phoneNumber, authPin)
    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-milkman to-milkman-dark">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-milkman to-milkman-dark text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                <Package className="w-12 h-12 text-milkman" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">MilkMan</h1>
            <p className="text-milkman-light mt-2">Milk Delivery Management System</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="authPin" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN
                </label>
                <div className="relative">
                  <input
                    id="authPin"
                    type={showPin ? "text" : "password"}
                    value={authPin}
                    onChange={(e) => setAuthPin(e.target.value)}
                    placeholder="Enter your PIN"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPin ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-milkman to-milkman-dark text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-milkman font-semibold hover:underline">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
