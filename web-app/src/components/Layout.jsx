import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Package, ShoppingCart, Calendar, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/customers', label: 'Customers', icon: Users, adminOnly: true },
    { path: '/profile', label: 'Profile', icon: User, userOnly: true },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/subscriptions', label: 'Subscriptions', icon: Calendar },
  ]
  
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) return isAdmin()
    if (item.userOnly) return !isAdmin()
    return true
  })
  
  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-milkman to-milkman-dark text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <Package className="w-8 h-8 text-milkman" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MilkMan</h1>
                <p className="text-sm text-milkman-light">Milk Delivery Management System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white text-milkman font-semibold shadow-md'
                        : 'hover:bg-milkman-dark text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/20 px-4 py-2 rounded-lg">
                <User className="w-5 h-5" />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                  {isAdmin() && <p className="text-xs text-milkman-light">Admin</p>}
                </div>
              </div>
              
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-red-500 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-2 flex justify-around">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-milkman bg-milkman-light'
                    : 'text-gray-600 hover:text-milkman'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 MilkMan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
