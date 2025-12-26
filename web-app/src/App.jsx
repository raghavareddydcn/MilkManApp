import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import HomePage from './pages/HomePage'
import Customers from './pages/Customers'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Subscriptions from './pages/Subscriptions'
import CustomerProducts from './pages/CustomerProducts'
import CustomerOrders from './pages/CustomerOrders'
import CustomerSubscriptions from './pages/CustomerSubscriptions'
import Profile from './pages/Profile'

function AppContent() {
  const { isAdmin } = useAuth()

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
                    <Route path="/" element={<HomePage />} />
                    
                    {/* Admin Routes */}
                    <Route 
                      path="/customers" 
                      element={
                        <AdminRoute>
                          <Customers />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/products" 
                      element={
                        isAdmin() ? (
                          <AdminRoute>
                            <Products />
                          </AdminRoute>
                        ) : (
                          <CustomerProducts />
                        )
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        isAdmin() ? (
                          <AdminRoute>
                            <Orders />
                          </AdminRoute>
                        ) : (
                          <CustomerOrders />
                        )
                      } 
                    />
                    <Route 
                      path="/subscriptions" 
                      element={
                        isAdmin() ? (
                          <AdminRoute>
                            <Subscriptions />
                          </AdminRoute>
                        ) : (
                          <CustomerSubscriptions />
                        )
                      } 
                    />
                    
                    {/* Common Routes */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
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