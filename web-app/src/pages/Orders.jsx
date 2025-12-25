import { useState, useEffect } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { orderAPI, customerAPI, productAPI } from '../services/api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    customerId: '',
    productIds: [],
    orderDate: new Date().toISOString().split('T')[0],
    status: 'PENDING'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        orderAPI.getAll(),
        customerAPI.getAll(),
        productAPI.getAll()
      ])
      setOrders(ordersRes.data || [])
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
      await orderAPI.create(formData)
      fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Error creating order. Please try again.')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      customerId: '',
      productIds: [],
      orderDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    })
  }

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customerid === customerId)
    return customer?.name || 'Unknown'
  }

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId?.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Order</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent"
        />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Order Date</th>
                <th className="px-6 py-4 text-left">Total Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.orderDateTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-milkman">₹{order.orderTotal || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'ORDER_PLACED' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Date *</label>
                <input
                  type="date"
                  required
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Create Order</button>
                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
