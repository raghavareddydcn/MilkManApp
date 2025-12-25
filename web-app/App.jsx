import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SessionWarningModal from './components/SessionWarningModal'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Customers from './pages/Customers'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Subscriptions from './pages/Subscriptions'

function AppContent() {
  const { showSessionWarning, dismissWarning, logout } = useAuth()

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      
      <SessionWarningModal
        show={showSessionWarning}
        onDismiss={dismissWarning}
        onLogout={logout}
        minutesRemaining={2}
      />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
