import { useState, useEffect } from 'react'
import { Plus, Search, X, Calendar } from 'lucide-react'
import { subscriptionAPI, customerAPI, productAPI } from '../services/api'

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    customerId: '',
    productIds: [],
    subscriptionStartDate: new Date().toISOString().split('T')[0],
    subscriptionEndDate: '',
    frequency: 'DAILY',
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [subsRes, customersRes, productsRes] = await Promise.all([
        subscriptionAPI.getAll(),
        customerAPI.getAll(),
        productAPI.getAll()
      ])
      setSubscriptions(subsRes.data || [])
      setCustomers(customersRes.data || [])
      setProducts(productsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await subscriptionAPI.create(formData)
      fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Error creating subscription:', error)
      alert('Error creating subscription. Please try again.')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      customerId: '',
      productIds: [],
      subscriptionStartDate: new Date().toISOString().split('T')[0],
      subscriptionEndDate: '',
      frequency: 'DAILY',
      status: 'ACTIVE'
    })
  }

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customerid === customerId)
    return customer?.name || 'Unknown'
  }

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subscriptionId?.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage recurring deliveries</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Subscription</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No subscriptions found</div>
        ) : (
          filteredSubscriptions.map((subscription) => (
            <div key={subscription.subscriptionId} className="card border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-gray-800">Sub #{subscription.subscriptionId}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {subscription.customerName}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  subscription.orderStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.orderStatus}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold text-gray-800">{subscription.deliveryFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(subscription.deliveryStartDate).toLocaleDateString()}
                  </span>
                </div>
                {subscription.deliveryEndDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(subscription.deliveryEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Products Subscribed</span>
                <p className="text-xs text-gray-500 mt-1">Check details for product list</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Create New Subscription</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer *</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.customerid} value={customer.customerid}>
                      {customer.name} - {customer.primaryphone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Products *</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                  {products.map(product => (
                    <label key={product.productid} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.productIds.includes(product.productid)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, productIds: [...formData.productIds, product.productid] })
                          } else {
                            setFormData({ ...formData, productIds: formData.productIds.filter(id => id !== product.productid) })
                          }
                        }}
                        className="w-4 h-4 text-milkman"
                      />
                      <span className="flex-1">{product.productname} - {product.quantity}</span>
                      <span className="font-semibold text-milkman">₹{product.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.subscriptionStartDate}
                    onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.subscriptionEndDate}
                    onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
                <select
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="input-field"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="ALTERNATE_DAYS">Alternate Days</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Create Subscription</button>
                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscriptions
