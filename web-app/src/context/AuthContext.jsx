import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import { useActivityTracker } from '../hooks/useActivityTracker'
import { useSessionTimeout } from '../hooks/useSessionTimeout'
import { useSessionCleanup } from '../hooks/useSessionCleanup'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSessionWarning, setShowSessionWarning] = useState(false)

  // Check for expired session on mount
  useEffect(() => {
    const sessionExpired = localStorage.getItem('sessionExpired')
    if (sessionExpired === 'true') {
      localStorage.clear()
      setUser(null)
      setLoading(false)
      return
    }

    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const userData = localStorage.getItem('user')
    
    if (token && refreshToken && userData && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Invalid user data in localStorage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('lastActivity')
    sessionStorage.clear()
    setUser(null)
    setShowSessionWarning(false)
  }, [])

  const handleSessionTimeout = useCallback(() => {
    console.log('Session timed out due to inactivity')
    handleLogout()
  }, [handleLogout])

  const handleWarning = useCallback(() => {
    console.log('Session timeout warning')
    setShowSessionWarning(true)
  }, [])

  const dismissWarning = useCallback(() => {
    setShowSessionWarning(false)
  }, [])

  // Activity tracking - DISABLED
  const lastActivityRef = null

  // Session timeout management - DISABLED
  const resetSessionTimer = useCallback(() => {
    // Session timeout disabled
  }, [])
  
  const clearTimers = useCallback(() => {
    // Session timeout disabled
  }, [])

  // Session cleanup on browser close - DISABLED
  // useSessionCleanup(true)

  const login = async (phoneNumber, authPin) => {
    try {
      const response = await authAPI.authenticate({ emailIdOrPhone: phoneNumber, authPin })
      const { authToken, refreshToken, customerName, customerId, role, status } = response.data
      console.log('  - customerName:', customerName, typeof customerName)
      console.log('  - role:', role, typeof role)
      console.log('  - status:', status, typeof status)
      console.log('  - authToken exists:', !!authToken)
      console.log('  - refreshToken exists:', !!refreshToken)
      
      if (status === 'SUCCESS' && authToken) {
        console.log('✅ Status is SUCCESS, proceeding with storage...')
        
        localStorage.setItem('token', authToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('lastActivity', Date.now().toString())
        localStorage.removeItem('sessionExpired')
        
        const customer = { customerId, customerName, role }
        
        console.log('👤 CUSTOMER OBJECT TO STORE:')
        console.log('  Object:', customer)
        console.log('  JSON:', JSON.stringify(customer))
        console.log('  role field present?', 'role' in customer)
        console.log('  role value:', customer.role)
        console.log('  role === "ADMIN"?', customer.role === 'ADMIN')
        
        const jsonString = JSON.stringify(customer)
        localStorage.setItem('user', jsonString)
        console.log('✅ Login successful -', customer.customerName, '| Role:', customer.role)
        
        setUser(customer)
        
        return { success: true }
      } else {
        console.error('❌ Login failed - status:', status)
        return { 
          success: false, 
          message: 'Invalid credentials' 
        }
      }
    } catch (error) {
      console.error('❌ LOGIN ERROR:', error)
      console.error('Error details:', error.response?.data)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = useCallback(() => {
    clearTimers()
    handleLogout()
  }, [clearTimers, handleLogout])

  const isAdmin = () => {
    return user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin, 
      loading,
      showSessionWarning,
      dismissWarning
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
