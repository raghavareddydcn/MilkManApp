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
    resetSessionTimer()
  }, [])

  // Activity tracking
  const lastActivityRef = useActivityTracker(() => {
    if (user) {
      resetSessionTimer()
      localStorage.setItem('lastActivity', Date.now().toString())
    }
  })

  // Session timeout management
  const { resetTimer: resetSessionTimer, clearTimers } = useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 2,
    onTimeout: handleSessionTimeout,
    onWarning: handleWarning,
    enabled: !!user
  })

  // Session cleanup on browser close
  useSessionCleanup(true)

  const login = async (phoneNumber, authPin) => {
    try {
      const response = await authAPI.authenticate({ emailIdOrPhone: phoneNumber, authPin })
      const { authToken, refreshToken, customerName, customerId, status } = response.data
      
      if (status === 'SUCCESS' && authToken) {
        localStorage.setItem('token', authToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('lastActivity', Date.now().toString())
        localStorage.removeItem('sessionExpired')
        
        const customer = { customerId, customerName }
        localStorage.setItem('user', JSON.stringify(customer))
        setUser(customer)
        
        // Start session timer
        resetSessionTimer()
        
        return { success: true }
      } else {
        return { 
          success: false, 
          message: 'Invalid credentials' 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
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
    return user?.emailId === 'admin@milkman.com' || user?.customerId === 'ADMIN001'
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
