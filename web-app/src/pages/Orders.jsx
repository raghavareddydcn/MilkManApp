import { useState, useEffect } from 'react'
import { Plus, Search, X, Edit2, Trash2, Save, Loader } from 'lucide-react'
import { orderAPI, customerAPI, productAPI } from '../services/api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [saving, setSaving] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
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

  const handleEdit = (order) => {
    setEditingOrder(order)
    setSelectedProducts(order.orderProductDetails?.map(p => ({
      productId: p.productId,
      quantity: p.quantity || 1
    })) || [])
    setShowEditModal(true)
  }

  const handleCancelEdit = () => {
    setEditingOrder(null)
    setShowEditModal(false)
    setSelectedProducts([])
  }

  const handleSaveEdit = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        orderId: editingOrder.orderId,
        customerId: editingOrder.customerId,
        productOrderReqs: selectedProducts.map(p => ({
          productId: p.productId,
          quantity: p.quantity
        })),
        deliveryDate: editingOrder.deliveryDate,
        deliveryTimeSlot: editingOrder.deliveryTimeSlot || 'MORNING',
        orderStatus: editingOrder.orderStatus,
        deliveryCharge: Number(editingOrder.deliveryCharge) || 0.0
      }

      await orderAPI.update(updateData)
      await fetchData()
      handleCancelEdit()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (orderId) => {
    if (!orderId) {
      alert('Error: Order ID is missing')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      return
    }

    try {
      await orderAPI.delete(orderId)
      await fetchData()
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Error deleting order. Please try again.')
    }
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.productId === productId)
      if (exists) {
        return prev.filter(p => p.productId !== productId)
      } else {
        return [...prev, { productId, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, Math.min(99, parseInt(quantity) || 1))
    setSelectedProducts(prev =>
      prev.map(p => p.productId === productId ? { ...p, quantity: qty } : p)
    )
  }

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customerId === customerId)
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'
  }

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId?.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orders</h1>
            <p className="text-blue-100">Manage customer orders</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Create Order</span>
          </button>
        </div>
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
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No orders found</td>
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
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit order"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.orderId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                    <option key={customer.customerId} value={customer.customerId}>
                      {customer.firstName} {customer.lastName} - {customer.primaryPhone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Products *</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                  {products.map(product => (
                    <label key={product.productId} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.productIds.includes(product.productId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, productIds: [...formData.productIds, product.productId] })
                          } else {
                            setFormData({ ...formData, productIds: formData.productIds.filter(id => id !== product.productId) })
                          }
                        }}
                        className="w-4 h-4 text-milkman"
                      />
                      <span className="flex-1">{product.productName} - {product.quantity || product.packageSize}</span>
                      <span className="font-semibold text-milkman">₹{product.productPrice}</span>
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

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Edit Order</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={saving}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Order ID */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Editing Order</p>
                <p className="text-lg font-bold text-blue-600">#{editingOrder.orderId}</p>
                <p className="text-sm text-gray-600 mt-1">{editingOrder.customerName}</p>
              </div>

              {/* Products Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Select Products</h3>
                  <p className="text-sm text-gray-500">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {products.map(product => {
                    const selected = selectedProducts.find(p => p.productId === product.productId)
                    return (
                      <div
                        key={product.productId}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selected 
                            ? 'bg-blue-50 border-blue-400 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-blue-200'
                        }`}
                        onClick={() => toggleProductSelection(product.productId)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                            selected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                          }`}>
                            {selected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${selected ? 'text-blue-800' : 'text-gray-800'}`}>
                              {product.productName}
                            </p>
                            <p className="text-sm text-gray-500">₹{product.productPrice?.toFixed(2)} per unit</p>
                          </div>
                        </div>
                        {selected && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-600">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={selected.quantity}
                              onChange={(e) => {
                                e.stopPropagation()
                                updateQuantity(product.productId, e.target.value)
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-3 py-2 border-2 border-blue-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleProductSelection(product.productId)
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove product"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Click on products to add/remove them. Adjust quantities using the input field.
                </p>
              </div>

              {/* Summary */}
              {selectedProducts.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                  <div className="space-y-1">
                    {selectedProducts.map(sp => {
                      const product = products.find(p => p.productId === sp.productId)
                      return (
                        <div key={sp.productId} className="flex justify-between text-sm">
                          <span>{product?.productName} x {sp.quantity}</span>
                          <span className="font-medium">₹{((product?.productPrice || 0) * sp.quantity).toFixed(2)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        ₹{selectedProducts.reduce((total, sp) => {
                          const product = products.find(p => p.productId === sp.productId)
                          return total + ((product?.productPrice || 0) * sp.quantity)
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || selectedProducts.length === 0}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
