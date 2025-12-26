import { Link } from 'react-router-dom'
import { Users, Package, ShoppingCart, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { customerAPI, productAPI, orderAPI, subscriptionAPI } from '../services/api'

const AdminHome = () => {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    subscriptions: 0
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [customers, products, orders, subscriptions] = await Promise.all([
        customerAPI.getAll(),
        productAPI.getAll(),
        orderAPI.getAll(),
        subscriptionAPI.getAll()
      ])
      
      setStats({
        customers: customers.data?.length || 0,
        products: products.data?.length || 0,
        orders: orders.data?.length || 0,
        subscriptions: subscriptions.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    { title: 'Total Customers', value: stats.customers, icon: Users, color: 'from-blue-500 to-blue-600', link: '/customers' },
    { title: 'Products', value: stats.products, icon: Package, color: 'from-green-500 to-green-600', link: '/products' },
    { title: 'Active Orders', value: stats.orders, icon: ShoppingCart, color: 'from-purple-500 to-purple-600', link: '/orders' },
    { title: 'Subscriptions', value: stats.subscriptions, icon: Calendar, color: 'from-orange-500 to-orange-600', link: '/subscriptions' }
  ]

  const features = [
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Manage customer accounts, track orders, and maintain delivery preferences',
      link: '/customers'
    },
    {
      icon: Package,
      title: 'Product Catalog',
      description: 'Browse and manage milk products with pricing and availability',
      link: '/products'
    },
    {
      icon: ShoppingCart,
      title: 'Order Processing',
      description: 'Create and track orders with real-time status updates',
      link: '/orders'
    },
    {
      icon: Calendar,
      title: 'Subscription Plans',
      description: 'Set up recurring deliveries with flexible scheduling options',
      link: '/subscriptions'
    }
  ]

  const benefits = [
    { icon: Clock, text: 'Real-time order tracking' },
    { icon: CheckCircle, text: 'Automated delivery scheduling' },
    { icon: TrendingUp, text: 'Business analytics dashboard' }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-milkman-light to-white opacity-50"></div>
        <div className="relative text-center py-16 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Admin <span className="text-milkman">Dashboard</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage your milk delivery business operations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
                  <Icon className="w-5 h-5 text-milkman" />
                  <span className="font-medium text-gray-700">{benefit.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Link key={index} to={stat.link} className="group">
                <div className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-12 h-12 opacity-80" />
                    <span className="text-4xl font-bold">
                      {loading ? '...' : stat.value}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold opacity-90">{stat.title}</h3>
                  <p className="text-sm opacity-75 mt-1 group-hover:opacity-100 transition-opacity">View details →</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link key={index} to={feature.link}>
                <div className="card group cursor-pointer border-2 border-transparent hover:border-milkman">
                  <div className="flex items-start space-x-4">
                    <div className="bg-milkman-light p-3 rounded-lg group-hover:bg-milkman transition-colors">
                      <Icon className="w-8 h-8 text-milkman group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gradient-to-r from-milkman to-milkman-dark rounded-xl shadow-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
        <p className="text-lg mb-6 opacity-90">Streamline your daily operations</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/customers" className="bg-white text-milkman px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md">
            Add Customer
          </Link>
          <Link to="/orders" className="bg-milkman-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-80 transition-colors shadow-md border-2 border-white">
            Create Order
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AdminHome
