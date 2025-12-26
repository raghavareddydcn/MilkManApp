import { useState, useEffect } from 'react'
import { Plus, Search, X, Calendar, Edit2, Trash2, Save, Loader } from 'lucide-react'
import { subscriptionAPI, customerAPI, productAPI } from '../services/api'

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)
  const [saving, setSaving] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
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

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription)
    setSelectedProducts(subscription.subscriptionProductDetails?.map(p => ({
      productId: p.productId,
      quantity: p.quantity || 1
    })) || [])
    setShowEditModal(true)
  }

  const handleCancelEdit = () => {
    setEditingSubscription(null)
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
        subscriptionId: editingSubscription.subscriptionId,
        customerId: editingSubscription.customerId,
        productOrderReqs: selectedProducts.map(p => ({
          productId: p.productId,
          quantity: p.quantity
        })),
        deliveryStartDate: editingSubscription.deliveryStartDate,
        deliveryEndDate: editingSubscription.deliveryEndDate,
        deliveryTimeSlot: editingSubscription.deliveryTimeSlot,
        deliveryFrequency: editingSubscription.deliveryFrequency,
        deliveryDays: editingSubscription.deliveryDays?.split(', ') || [],
        orderStatus: editingSubscription.orderStatus,
        deliveryCharge: Number(editingSubscription.deliveryCharge) || 0.0
      }

      await subscriptionAPI.update(updateData)
      await fetchData()
      handleCancelEdit()
    } catch (error) {
      console.error('Error updating subscription:', error)
      alert('Error updating subscription. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (subscriptionId) => {
    if (!subscriptionId) {
      alert('Error: Subscription ID is missing.')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete subscription #${subscriptionId}?`)) {
      return
    }

    try {
      await subscriptionAPI.delete(subscriptionId)
      await fetchData()
    } catch (error) {
      console.error('Error deleting subscription:', error)
      alert('Error deleting subscription. Please try again.')
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

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subscriptionId?.toString().includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Subscriptions</h1>
            <p className="text-orange-100">Manage recurring deliveries</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">New Subscription</span>
          </button>
        </div>
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
            <div key={subscription.subscriptionId || Math.random()} className="card border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-gray-800">Sub #{subscription.subscriptionId || 'N/A'}</span>
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
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Products Subscribed</span>
                    <p className="text-xs text-gray-500 mt-1">Check details for product list</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(subscription)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit subscription"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(subscription.subscriptionId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete subscription"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
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

      {/* Edit Subscription Modal */}
      {showEditModal && editingSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Edit Subscription</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={saving}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Subscription ID */}
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Editing Subscription</p>
                <p className="text-lg font-bold text-orange-600">#{editingSubscription.subscriptionId}</p>
                <p className="text-sm text-gray-600 mt-1">{editingSubscription.customerName}</p>
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
                            ? 'bg-orange-50 border-orange-400 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-orange-200 hover:bg-orange-25'
                        }`}
                        onClick={() => toggleProductSelection(product.productId)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                            selected ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'
                          }`}>
                            {selected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${selected ? 'text-orange-800' : 'text-gray-800'}`}>
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
                              className="w-20 px-3 py-2 border-2 border-orange-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Subscription Summary</h4>
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
                      <span className="text-orange-600">
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
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default Subscriptions
