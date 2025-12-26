import { useState, useEffect } from 'react'
import { Plus, Search, X, Calendar, Edit2, Trash2, Save, Loader } from 'lucide-react'
import { subscriptionAPI, customerAPI, productAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CustomerSubscriptions = () => {
  const { user } = useAuth()
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
    customerId: user?.customerId || '',
    productOrderReqs: [],
    deliveryStartDate: new Date().toISOString().split('T')[0],
    deliveryEndDate: '',
    deliveryFrequency: 'DAILY',
    orderStatus: 'ACTIVE',
    deliveryDays: [],
    deliveryTimeSlot: '06:00-09:00',
    deliveryCharge: 0
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
      
      console.log('✅ Subscriptions data:', subsRes.data)
      // Filter for customer's own subscriptions only
      const userSubs = (subsRes.data || []).filter(s => s.customerId === user?.customerId)
      console.log(`✅ Filtered ${userSubs.length} subscriptions for customer: ${user?.customerId}`)
      
      console.log('✅ Products data:', productsRes.data)
      if (productsRes.data && productsRes.data.length > 0) {
        console.log('✅ First product:', productsRes.data[0])
        console.log('✅ Product keys:', Object.keys(productsRes.data[0]))
      }
      
      setSubscriptions(userSubs)
      setCustomers(customersRes.data || [])
      setProducts(productsRes.data || [])
    } catch (error) {
      console.error('❌ Error fetching data:', error)
      console.error('❌ Error details:', error.response?.data || error.message)
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
      customerId: user?.customerId || '',
      productOrderReqs: [],
      deliveryStartDate: new Date().toISOString().split('T')[0],
      deliveryEndDate: '',
      deliveryFrequency: 'DAILY',
      orderStatus: 'ACTIVE',
      deliveryDays: [],
      deliveryTimeSlot: '06:00-09:00',
      deliveryCharge: 0
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
    console.log('🗑️ handleDelete called with ID:', subscriptionId)
    console.log('🗑️ ID type:', typeof subscriptionId)
    console.log('🗑️ ID is undefined?', subscriptionId === undefined)
    console.log('🗑️ ID is null?', subscriptionId === null)
    
    if (!subscriptionId) {
      console.error('❌ subscriptionId is undefined or null!')
      alert('Error: Subscription ID is missing. Check browser console for details.')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete subscription #${subscriptionId}?`)) {
      return
    }

    try {
      console.log('🗑️ Calling delete API for ID:', subscriptionId)
      await subscriptionAPI.delete(subscriptionId)
      console.log('✅ Delete successful')
      await fetchData()
    } catch (error) {
      console.error('❌ Error deleting subscription:', error)
      console.error('❌ Error response:', error.response?.data)
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
    const customer = customers.find(c => c.customerid === customerId)
    return customer?.name || 'Unknown'
  }

  const formatSubscriptionId = (subscriptionId) => {
    return subscriptionId ? `SUB-${subscriptionId.slice(-8).toUpperCase()}` : 'N/A'
  }

  const validateEndDate = (startDate, endDate, frequency) => {
    if (!endDate || !startDate) return true // Optional end date
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    
    if (frequency === 'WEEKLY' && diffDays < 7) {
      alert('For weekly subscriptions, end date must be at least 7 days after start date')
      return false
    }
    
    if (frequency === 'MONTHLY' && diffDays < 30) {
      alert('For monthly subscriptions, end date must be at least 30 days after start date')
      return false
    }
    
    return true
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

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No subscriptions found</div>
        ) : (
          filteredSubscriptions.map((subscription) => (
            <div key={subscription.subscriptionId || Math.random()} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{formatSubscriptionId(subscription.subscriptionId)}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Start: {new Date(subscription.deliveryStartDate).toLocaleDateString()}
                      </div>
                      {subscription.deliveryEndDate && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 font-medium mt-1">
                          <Calendar className="w-4 h-4" />
                          End: {new Date(subscription.deliveryEndDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{subscription.orderTotal?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{subscription.deliveryFrequency}</p>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        subscription.orderStatus === 'ACTIVE' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        <span className="font-semibold">
                          {subscription.orderStatus}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        title="Edit Subscription"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subscription.subscriptionId)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Delete Subscription"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products */}
                {subscription.subscriptionProductDetails && subscription.subscriptionProductDetails.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Subscribed Products</h4>
                    </div>
                    <div className="space-y-2">
                      {subscription.subscriptionProductDetails.map((product, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{product.productName}</p>
                            <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                          </div>
                          <p className="font-semibold text-orange-600">₹{(product.productPrice * product.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              {/* Customer ID is auto-populated from logged-in user */}
              
              {/* Product Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700">Select Products</h3>
                  <p className="text-sm text-gray-500">
                    {formData.productOrderReqs.length} product{formData.productOrderReqs.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
                  {products.map(product => {
                    const selected = formData.productOrderReqs.find(p => p.productId === product.productId)
                    return (
                      <div
                        key={product.productId}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selected 
                            ? 'bg-orange-50 border-orange-400 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-orange-200'
                        }`}
                        onClick={() => {
                          if (selected) {
                            setFormData({ 
                              ...formData, 
                              productOrderReqs: formData.productOrderReqs.filter(p => p.productId !== product.productId) 
                            })
                          } else {
                            setFormData({ 
                              ...formData, 
                              productOrderReqs: [...formData.productOrderReqs, { productId: product.productId, quantity: 1 }] 
                            })
                          }
                        }}
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
                                const newQty = parseInt(e.target.value) || 1
                                setFormData({
                                  ...formData,
                                  productOrderReqs: formData.productOrderReqs.map(p => 
                                    p.productId === product.productId ? { ...p, quantity: newQty } : p
                                  )
                                })
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-3 py-2 border-2 border-orange-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setFormData({ 
                                  ...formData, 
                                  productOrderReqs: formData.productOrderReqs.filter(p => p.productId !== product.productId) 
                                })
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

              {/* Frequency Selection - Ask First */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Frequency *</label>
                <select
                  required
                  value={formData.deliveryFrequency}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      deliveryFrequency: e.target.value,
                      deliveryEndDate: '' // Reset end date when frequency changes
                    })
                  }}
                  className="input-field"
                >
                  <option value="DAILY">Daily</option>
                  <option value="ALTERNATE_DAYS">Alternate Days</option>
                  <option value="WEEKLY">Weekly (minimum 7 days)</option>
                </select>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deliveryStartDate}
                    onChange={(e) => setFormData({ ...formData, deliveryStartDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    min={(() => {
                      if (!formData.deliveryStartDate) return new Date().toISOString().split('T')[0]
                      const start = new Date(formData.deliveryStartDate)
                      let daysToAdd = 1
                      if (formData.deliveryFrequency === 'WEEKLY') daysToAdd = 7
                      start.setDate(start.getDate() + daysToAdd)
                      return start.toISOString().split('T')[0]
                    })()}
                    value={formData.deliveryEndDate}
                    onChange={(e) => setFormData({ ...formData, deliveryEndDate: e.target.value })}
                    className="input-field"
                  />
                  {formData.deliveryFrequency === 'WEEKLY' && (
                    <p className="text-xs text-gray-500 mt-1">⚠️ Weekly subscriptions require minimum 7 days</p>
                  )}
                </div>
              </div>

              {/* Subscription Summary */}
              {formData.productOrderReqs.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Subscription Summary</h4>
                  <div className="space-y-1">
                    {formData.productOrderReqs.map(sp => {
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
                        ₹{formData.productOrderReqs.reduce((total, sp) => {
                          const product = products.find(p => p.productId === sp.productId)
                          return total + ((product?.productPrice || 0) * sp.quantity)
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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

export default CustomerSubscriptions
