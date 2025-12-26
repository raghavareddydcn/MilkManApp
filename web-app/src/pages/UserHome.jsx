import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Calendar, User, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { customerAPI, orderAPI, subscriptionAPI } from '../services/api'

const UserHome = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    orders: 0,
    subscriptions: 0,
    activeSubscriptions: 0
  })
  const [profile, setProfile] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentSubscriptions, setRecentSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [ordersRes, subsRes, profileRes] = await Promise.all([
        orderAPI.getAll(),
        subscriptionAPI.getAll(),
        customerAPI.getById(user?.customerId)
      ])
      
      // Set user's profile directly
      setProfile(profileRes.data)
      
      // Filter user's orders and subscriptions
      const userOrders = ordersRes.data?.filter(o => o.customerId === user?.customerId) || []
      const userSubs = subsRes.data?.filter(s => s.customerId === user?.customerId) || []
      const activeSubs = userSubs.filter(s => s.status === 'ACTIVE')
      
      setStats({
        orders: userOrders.length,
        subscriptions: userSubs.length,
        activeSubscriptions: activeSubs.length
      })
      
      // Get 3 most recent orders sorted by date
      const sortedOrders = userOrders.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      )
      setRecentOrders(sortedOrders.slice(0, 3))
      
      // Get 3 most recent subscriptions sorted by date
      const sortedSubs = userSubs.sort((a, b) => 
        new Date(b.deliveryStartDate || b.createdDate) - new Date(a.deliveryStartDate || a.createdDate)
      )
      setRecentSubscriptions(sortedSubs.slice(0, 3))
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatOrderId = (orderId) => {
    return orderId ? `ORD-${orderId.slice(-8).toUpperCase()}` : 'N/A'
  }

  const formatSubscriptionId = (subscriptionId) => {
    return subscriptionId ? `SUB-${subscriptionId.slice(-8).toUpperCase()}` : 'N/A'
  }

  const quickActions = [
    {
      icon: ShoppingCart,
      title: 'Order Products',
      description: 'Fresh milk delivered to your doorstep',
      link: '/products',
      color: 'from-blue-500 to-blue-600',
      highlight: true
    },
    {
      icon: Calendar,
      title: 'My Subscriptions',
      description: 'Manage recurring deliveries',
      link: '/subscriptions',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track your order history',
      link: '/orders',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: User,
      title: 'My Profile',
      description: 'Update your account information',
      link: '/profile',
      color: 'from-green-500 to-green-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-milkman"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-milkman via-milkman-dark to-blue-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Welcome Back!
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Hello, {profile?.firstname || user?.customerName}!
          </h1>
          <p className="text-xl text-milkman-light mb-6">
            Your fresh milk delivery partner
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">{stats.orders}</p>
              <p className="text-sm opacity-90">Total Orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
              <p className="text-sm opacity-90">Active Plans</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">{stats.subscriptions}</p>
              <p className="text-sm opacity-90">Subscriptions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA - Order Now */}
      <Link to="/products" className="block group">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold">Featured Action</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Fresh Milk Now</h2>
              <p className="text-blue-100">Browse products and place your order today</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 p-4 rounded-full group-hover:bg-white/30 transition-colors">
                <ShoppingCart className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-milkman" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.slice(1).map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} to={action.link} className="group">
                <div className={`bg-gradient-to-br ${action.color} rounded-xl shadow-md p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                  <Icon className="w-10 h-10 mb-4 opacity-90" />
                  <h3 className="text-lg font-bold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{action.description}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                    <span>Go to {action.title.split(' ')[action.title.split(' ').length - 1]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Orders & Subscriptions */}
      {(recentOrders.length > 0 || recentSubscriptions.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Recent Orders</h3>
                <Link to="/orders" className="text-milkman text-sm font-semibold hover:underline flex items-center gap-1">
                  View All Orders <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentOrders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{formatOrderId(order.orderId)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.orderDateTime || order.orderDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-milkman">
                    ₹{(order.orderTotal || order.totalAmount || 0).toFixed(2)}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.orderStatus || 'PENDING'}
                  </span>
                </div>
              </div>
            ))}
              </div>
            </div>
          )}
          
          {/* Recent Subscriptions */}
          {recentSubscriptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Recent Subscriptions</h3>
                <Link to="/subscriptions" className="text-milkman text-sm font-semibold hover:underline flex items-center gap-1">
                  View All Subscriptions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentSubscriptions.map((subscription) => (
                  <div key={subscription.subscriptionId} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{formatSubscriptionId(subscription.subscriptionId)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(subscription.deliveryStartDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-gray-600">
                        {subscription.deliveryFrequency.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-milkman">
                        ₹{(subscription.orderTotal || 0).toFixed(2)}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        subscription.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                        subscription.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {subscription.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {recentOrders.length === 0 && recentSubscriptions.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Activity Yet</h3>
          <p className="text-gray-600 mb-6">Start by ordering fresh milk or setting up a subscription</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-milkman text-white px-6 py-3 rounded-lg font-semibold hover:bg-milkman-dark transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      )}
    </div>
  )
}

export default UserHome
