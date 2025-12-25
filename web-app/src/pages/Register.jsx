import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, UserPlus, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    primaryPhone: '',
    secondaryPhone: '',
    emailId: '',
    dateOfBirth: '',
    authPin: '',
    confirmPin: '',
    address: '',
    pincode: '',
    landmark: ''
  })
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.authPin !== formData.confirmPin) {
      setError('PINs do not match')
      return
    }

    if (formData.authPin.length < 4) {
      setError('PIN must be at least 4 characters')
      return
    }

    setLoading(true)

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone || null,
        emailId: formData.emailId,
        dateOfBirth: formData.dateOfBirth || null,
        authPin: formData.authPin,
        address: formData.address,
        pincode: formData.pincode,
        landmark: formData.landmark || null,
        status: 'ACTIVE'
      }

      const response = await authAPI.register(registrationData)

      if (response.data.status === 'SUCCESS') {
        alert('Registration successful! Please login with your credentials.')
        navigate('/login')
      } else {
        setError(response.data.errorMsg || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.response?.data?.errorMsg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-milkman to-milkman-dark py-8">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-milkman to-milkman-dark text-white p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white rounded-full p-3">
                <Package className="w-10 h-10 text-milkman" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-milkman-light mt-1 text-sm">Join MilkMan Delivery System</p>
          </div>

          {/* Registration Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Phone *
                  </label>
                  <input
                    id="primaryPhone"
                    name="primaryPhone"
                    type="tel"
                    value={formData.primaryPhone}
                    onChange={handleChange}
                    placeholder="Primary phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Phone
                  </label>
                  <input
                    id="secondaryPhone"
                    name="secondaryPhone"
                    type="tel"
                    value={formData.secondaryPhone}
                    onChange={handleChange}
                    placeholder="Secondary phone (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="emailId"
                    name="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="PIN code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              {/* Security Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="authPin" className="block text-sm font-medium text-gray-700 mb-1">
                    Create PIN *
                  </label>
                  <div className="relative">
                    <input
                      id="authPin"
                      name="authPin"
                      type={showPin ? "text" : "password"}
                      value={formData.authPin}
                      onChange={handleChange}
                      placeholder="Create your PIN"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm PIN *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPin"
                      name="confirmPin"
                      type={showConfirmPin ? "text" : "password"}
                      value={formData.confirmPin}
                      onChange={handleChange}
                      placeholder="Confirm your PIN"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-milkman to-milkman-dark text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Register</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-milkman font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
